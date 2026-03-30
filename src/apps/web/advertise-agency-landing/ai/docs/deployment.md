# S3 Deployment Guide

**Last updated:** 2026-03-30
**Status:** Production ready

---

## Overview

The deployment system uses **manifest-based selective sync** to deploy only changed files to S3-compatible storage. It compares local build output against remote state using SHA-256 hashes, enabling:

- **Fast "no changes" detection** — Skip deployment entirely if build output is unchanged
- **Selective upload** — Only upload new/modified files (saves bandwidth and time)
- **Automatic cleanup** — Delete files removed from the build
- **Safe retry** — Manifests updated last ensures atomic state

---

## Architecture

### Two Manifests

| File | Purpose | Update timing |
|------|---------|---------------|
| `buildMeta.json` | Build-wide hash + metadata | Fast deployment gate |
| `manifest.json` | File-level manifest (every output file) | Diff computation |

### Deployment Flow

```
┌─────────────────┐
│ 1. Vite SSG Build │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ 2. postBuildBuildManifest.ts │
│    - SHA-256 per file   │
│    - build-wide hash    │
│    - write manifests    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 3. Fetch remote buildMeta.json │
└────────┬────────────────┘
         │
    ┌────┴────┐
    │ Hashes  │
    │ match?  │
    └────┬────┘
         │
    ┌────┴────┐
    │  Yes    │  →  Exit (no upload)
    └─────────┘
         │ No
         ▼
┌─────────────────────────┐
│ 4. Fetch remote manifest.json │
│ 5. Compute file diff    │
│    - added              │
│    - changed            │
│    - removed            │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 6. Selective sync       │
│    - upload + changed   │
│    - delete removed     │
│    - skip unchanged     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 7. Upload manifests LAST │
│    - manifest.json      │
│    - buildMeta.json     │
└─────────────────────────┘
```

---

## Commands

### Full Deployment (Build + Deploy)

```bash
# Bash (Linux/Mac/WSL)
pnpm deploy:content:S3

# PowerShell (Windows)
pnpm deploy:content:S3:win

# Verbose mode (shows file list)
pnpm deploy:content:S3:win:verbose
```

### Deploy Only (Skip Build)

```bash
# Bash
pnpm copy:content:S3

# PowerShell
pnpm copy:content:S3:win

# Verbose mode
pnpm copy:content:S3:win:verbose
```

### Manifest Generation Only

```bash
pnpm postbuild:buildManifest
```

---

## Environment Variables

Create `.env.deploy` at project root:

```bash
CONTENT_S3_ACCESS_KEY=YCAJ...
CONTENT_S3_SECRET_KEY=your-secret-key
CONTENT_S3_REGION=ru-central1
CONTENT_S3_BUCKET=rmaster35ru-content
CONTENT_S3_ENDPOINT=https://storage.yandexcloud.net
```

| Variable | Description | Required |
|----------|-------------|----------|
| `CONTENT_S3_ACCESS_KEY` | S3 access key ID | Yes |
| `CONTENT_S3_SECRET_KEY` | S3 secret access key | Yes |
| `CONTENT_S3_REGION` | S3 region | Yes |
| `CONTENT_S3_BUCKET` | Bucket name | Yes |
| `CONTENT_S3_ENDPOINT` | S3 endpoint URL | Yes |

---

## Expected Output

### No Changes (Skip)

```
[deploy] Starting selective deployment to S3...
[deploy] Fetching remote buildMeta.json...
[deploy] OK: Build hashes match - no deployment needed

=== Deployment Summary ===
Status: SKIPPED (no changes)
Build hash: sha256:abc123...
```

### Partial Changes

```
[deploy] Starting selective deployment to S3...
[deploy] Fetching remote buildMeta.json...
[deploy] Build hashes differ - computing file diff...
[deploy] Fetching remote manifest.json...
[deploy] Files to add: 2
[deploy] Files to change: 1
[deploy] Files to remove: 0
[deploy] Files unchanged: 111

[deploy] Uploading files...
[deploy] Deleting removed files...
[deploy] Updating remote manifests...
[deploy] OK: Deployment complete

=== Deployment Summary ===
Status: COMPLETED
--------------------------------
Files added:     2
Files changed:   1
Files removed:   0
Files unchanged: 111
--------------------------------
Total uploaded:  245.3 KB
```

### Verbose Mode

```
[deploy] Files to add: 2
[deploy] Files to change: 1
[deploy] Files to remove: 0

Added files:
  + assets/new-feature-abc123.js
  + images/hero-banner.webp

Changed files:
  ~ index.html

[deploy] Uploading files...
```

---

## Troubleshooting

### Credentials / Configuration

| Issue | Solution |
|-------|----------|
| `FATAL: .env.deploy not found` | Ensure `.env.deploy` exists at project root |
| `required env var CONTENT_S3_ACCESS_KEY is not set` | Add all `CONTENT_S3_*` variables to `.env.deploy` |
| `Unable to locate credentials` | Check `.env.deploy` has valid keys; verify `s3Common.ps1/sh` sources the file |
| `Access Denied` | Verify S3 credentials have `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject` permissions |

### Deployment Failures

| Issue | Solution |
|-------|----------|
| `Failed to fetch remote manifest.json` | Verify bucket exists and endpoint URL is correct |
| `Failed to upload: <file>` | Check bucket permissions; verify disk space; retry |
| `Failed to delete: <file>` | Check bucket permissions; some providers require versioning disabled |
| Deployment uploads ALL files every time | Check if source files are changing (global hash invalidation); verify `.ssg-cache/` is preserved between builds |

### Path Issues

| Issue | Solution |
|-------|----------|
| S3 keys have `%5C` or backslashes | Bug: manifest paths must use forward slashes; check `walkDirectory()` normalization |
| Empty folder prefix in S3 (`s3://bucket//file`) | Bug: S3 URI should be `s3://bucket` (no trailing `/`); destination: `"$S3Uri/$file"` |

---

## Cache Behavior

### Incremental SSG Cache

The build uses `.ssg-cache/` to restore unchanged pages from cache:

```
[incremental-ssg] 0/33 routes changed, 33 from cache
[incremental-ssg] Restoring 33 files from cache...
```

**Cache invalidation:**

- **Global hash change** → All routes rebuilt (source files, config files changed)
- **Per-route hash change** → Only affected routes rebuilt (content JSON changed)

### Deployment Cache

The deployment compares against **remote state** in S3:

- First deployment → Full upload
- Subsequent deployments → Only changed files uploaded

---

## File Manifests

### buildMeta.json

```json
{
  "buildHash": "sha256:8b7c2f...",
  "gitSha": "a1b2c3d4",
  "createdAt": "2026-03-29T00:00:00Z",
  "entryCount": 128,
  "totalSize": 7145678
}
```

### manifest.json

```json
{
  "version": "a1b2c3d4",
  "files": {
    "index.html": {
      "sha256": "7e1f...",
      "size": 1482,
      "type": "html",
      "cacheControl": "no-cache"
    },
    "assets/app-8f31.js": {
      "sha256": "9c2a...",
      "size": 184233,
      "type": "asset",
      "cacheControl": "public,max-age=31536000,immutable"
    }
  }
}
```

---

## Cache-Control Headers

| File Type | Header |
|-----------|--------|
| HTML (`.html`) | `no-cache` |
| Assets (hash in filename) | `public,max-age=31536000,immutable` |
| Manifests | `no-cache` |
| Other | `public,max-age=3600` |

---

## Scripts Reference

| Script | Platform | Purpose |
|--------|----------|---------|
| `scripts/postBuildBuildManifest.ts` | Cross-platform | Generates manifests post-build |
| `scripts/copyContentToS3.ps1` | Windows | Selective S3 deployment |
| `scripts/copyContentToS3.sh` | Linux/Mac | Selective S3 deployment |
| `scripts/s3Common.ps1` | Windows | Load S3 credentials |
| `scripts/s3Common.sh` | Linux/Mac | Load S3 credentials |

---

## Testing

### Test Skip Scenario

```bash
# Build and deploy
pnpm deploy:content:S3:win

# Deploy again (should skip)
pnpm deploy:content:S3:win
# Expected: "Build hashes match - no deployment needed"
```

### Test Selective Upload

```bash
# Modify a source file
echo "// change" >> src/App.tsx

# Build and deploy
pnpm deploy:content:S3:win
# Expected: Only changed files uploaded
```

### Test Verbose Mode

```bash
pnpm deploy:content:S3:win:verbose
# Expected: Lists all added, changed, removed files
```

---

## Related Documentation

- [`pdrWorkflow.md`](./pdrWorkflow.md) — PDR step workflow
- [`devWorkflow.md`](./devWorkflow.md) — Development commands and build pipeline
- [`architecture.md`](./architecture.md) — Technical architecture overview
