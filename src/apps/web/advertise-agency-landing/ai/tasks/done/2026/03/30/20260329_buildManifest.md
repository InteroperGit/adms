# PDR-012: Manifest-Based Smart Deployment to S3

**Created:** 2026-03-29
**Status:** Todo
**Priority:** High

---

## Overview

Build a deployment system for Vite SSG that uploads build output to S3-compatible storage **only when output has changed**. Uses file-level and build-level manifests to enable selective synchronization.

---

## Goals

- [ ] Prevent redundant deployments when build output is unchanged
- [ ] Detect changes efficiently before syncing files
- [ ] Upload only new, changed, or removed files
- [ ] Work with any S3-compatible storage provider (via AWS CLI)
- [ ] Keep deployment logic deterministic and reproducible
- [ ] Support large static builds efficiently

---

## Non-Goals

- Provider-specific CDN behavior
- Runtime server-side rendering
- Full bucket mirroring on every deployment
- Complex asset rewriting beyond manifest generation

---

## Core Idea

### Two Manifests Generated Post-Build

| File | Purpose | Usage |
|------|---------|-------|
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
         ▼
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

## Functional Requirements

### FR1: Build Artifact Generation

**Script:** `scripts/postBuildBuildManifest.ts` (TypeScript, runs post-build)

**Must:**
- Inspect final build output directory (`build/client/`)
- Calculate SHA-256 for every file
- Create stable file manifest (sorted keys)
- Compute build-wide hash from file hashes
- Write `manifest.json` and `buildMeta.json` to build output

**Integration:** Runs automatically after Vite build (added to build command)

### FR2: Build-Level Hashing

- Compute single hash from all file hashes
- Hash changes if ANY output file changes
- Used as fast comparison before downloading full manifest

### FR3: Remote Comparison

**Scripts:** `scripts/copyContentToS3.ps1` / `scripts/copyContentToS3.sh`

**Must:**
1. Fetch remote `buildMeta.json`
2. Compare remote vs local build hash
3. Skip deployment if hashes match
4. If hash differs → proceed to file diff

### FR4: File Diffing

When build hashes differ:
1. Fetch remote `manifest.json`
2. Compare local vs remote file manifests
3. Identify:
   - **Added files** (in local, not in remote)
   - **Changed files** (hash differs)
   - **Removed files** (in remote, not in local)
   - **Unchanged files** (hash matches)

### FR5: Selective Sync

- Upload only **added** and **changed** files
- Delete only **removed** files
- Leave **unchanged** files untouched

### FR6: Manifest Update Order

**Critical:** Upload manifests LAST to ensure atomic state

```
1. File uploads (added/changed)
2. File deletions (removed)
3. Upload manifest.json
4. Upload buildMeta.json
```

---

## Data Model

### buildMeta.json

```json
{
  "buildHash": "sha256:8b7c2f...",
  "gitSha": "a1b2c3d4",
  "createdAt": "2026-03-29T00:00:00Z",
  "entryCount": 128
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

## Deployment Algorithm

### Step 1: Build
```bash
pnpm build
# Runs: tsc && react-router build && postBuildBuildManifest.ts && ...
```

### Step 2: Generate Manifests
Automatic via `postBuildBuildManifest.ts`

### Step 3: Fetch Remote State
- Download `s3://bucket/buildMeta.json`
- If not exists → first deployment (proceed)

### Step 4: Compare Build Hashes
- Match → exit successfully (no upload)
- Differ → proceed to diff

### Step 5: Diff Manifests
- Download `s3://bucket/manifest.json`
- Compare file hashes

### Step 6: Sync Files
- Upload new/modified files
- Delete removed files
- Skip unchanged files

### Step 7: Finalize
- Upload new `manifest.json`
- Upload new `buildMeta.json`

---

## Cache Policy

| File Type | Cache-Control |
|-----------|---------------|
| HTML entry files | `no-cache` (revalidate frequently) |
| Versioned assets (hash in filename) | `public,max-age=31536000,immutable` |
| Manifests | `no-cache` |

### Note: Data Files Not Tracked

Content data files (`data/content/*.json`) are NOT deployed to S3 via this system. They are managed separately and not included in the manifest.

---

## Error Handling

| Error | Behavior |
|-------|----------|
| Manifest generation fails | Fail build |
| Remote state fetch fails | Fail deployment |
| Upload/delete fails mid-sync | Abort, do NOT update manifests |
| Incomplete sync | Manifests not updated (safe retry) |

---

## Observability

Deployment output must report:

```
Deployment Summary
────────────────────────────────
Status: [Skipped | Completed]
────────────────────────────────
Files added:    12
Files changed:  3
Files removed:  1
Files unchanged: 112
────────────────────────────────
Total uploaded:  1.2 MB
Total deleted:   45 KB
────────────────────────────────
```

---

## Acceptance Criteria

- [ ] Unchanged build → deployment skipped
- [ ] Partial changes → only affected files uploaded
- [ ] Removed files → deleted from storage
- [ ] Remote manifests always reflect latest successful deploy
- [ ] Works with any S3-compatible provider (AWS CLI)
- [ ] No dependency on provider-specific CDN features
- [ ] `postBuildBuildManifest.ts` generates both manifests
- [ ] `copyContentToS3.ps1` and `copyContentToS3.sh` implement selective deploy

---

## Implementation Plan

### Phase 1: Manifest Generation ✅ COMPLETE

**Created:** `scripts/postBuildBuildManifest.ts`

**Features implemented:**
- [x] Walks `build/client/` directory recursively
- [x] Computes SHA-256 per file
- [x] Classifies file types (html/asset/manifest)
- [x] Assigns cache-control headers by type
- [x] Writes sorted `manifest.json` with file entries
- [x] Writes `buildMeta.json` with build-wide hash + metadata
- [x] Integrated into build command via `pnpm postbuild`
- [x] Logs summary with file counts, sizes, and build hash
- [x] Graceful handling of missing git (returns null)

**Build command updated:**
```json
"postbuild:buildManifest": "vite-node scripts/postBuildBuildManifest.ts"
"postbuild": "pnpm postbuild:buildManifest && pnpm postbuild:seo && pnpm postbuild:cache && pnpm postbuild:sitemap && pnpm postbuild:robots"
"build": "tsc -b tsconfig.app.json && react-router build && pnpm postbuild"
```

**Test results:**
- Build completes successfully
- manifest.json: 146 files, sorted alphabetically
- buildMeta.json: build hash, git SHA, timestamp, entry count, total size

### Phase 2: Refactor Deployment Scripts ✅ COMPLETE

**Scripts:**
- `scripts/copyContentToS3.ps1` — PowerShell selective sync
- `scripts/copyContentToS3.sh` — Bash selective sync

**Features:**
- [x] Build hash comparison for fast "no changes" detection
- [x] File-level diff for selective upload
- [x] Per-file cache-control from manifest
- [x] Atomic manifest update (uploaded last)
- [x] Proper path normalization (forward slashes for S3)
- [x] PSCustomObject property access fix for paths with special chars

**Bugs fixed:**
- PowerShell `??` operator not supported in PS 5.x → replaced with if/else
- Array splatting in middle of array → use `@(...) + $endpointArgs`
- PSCustomObject property access for paths like `assets/file.js` → use `PSObject.Properties[$path].Value`
- Undefined `$BytesDeleted` variable → removed (not tracked)
- `$FilesRemoved` counter not initialized → added initialization
- Bash `grep -c .` returning malformed output → get counts directly from Node.js (`d.added.length`)

**Test results:**
- First deployment: 114 files uploaded (6.82 MB)
- Second deployment: Skipped (hashes match)
- Partial changes: 6 added + 1 changed (536.3 KB uploaded)
- File deletion: 6 old files removed
- Both PowerShell and Bash scripts working

---

### Simplify/Code Review ✅ COMPLETE

**Fixes applied:**

1. **`postBuildBuildManifest.ts`:**
   - Added `CACHE_CONTROL` constants (type-safe)
   - Changed to streaming hash for large files
   - Parallel file processing with `Promise.all` batching (10 files/batch)
   - Removed dead manifest classification code

2. **`copyContentToS3.ps1`:**
   - Added S3 constants for file names
   - Proper temp file cleanup with `trap` handler
   - Removed unused counter variables (use array counts)
   - Removed obvious "what" comments

3. **`copyContentToS3.sh`:**
   - Single Node.js invocation for all diff computation (was 5+)
   - Proper Windows path handling with `cygpath -wm`
   - Batch cache-control lookup (single parse)
   - Removed unused array declarations
   - Path normalization for S3 keys (forward slashes)

**Tested:**
- Both scripts skip correctly when hashes match
- Paths in manifest.json use forward slashes (S3-compatible)
- Selective upload works (only changed files uploaded)
- File deletion works (removed files deleted from S3)
- Manifests updated last for atomic state

### Phase 3: Testing ✅ COMPLETE

**Test results:**

1. **Unchanged build (skip)** ✅
   - Remote hash: `sha256:61b74029a8cfa5ddd33eb1c89bdda117343b2ee4060939969104aa5b5d4f9669`
   - Local hash: `sha256:61b74029a8cfa5ddd33eb1c89bdda117343b2ee4060939969104aa5b5d4f9669`
   - Result: Deployment skipped, exit code 0

2. **Partial changes (selective upload)** ✅
   - Files added: 6
   - Files changed: 1
   - Files unchanged: 107
   - Total uploaded: 536.3 KB (vs 6.82 MB full build)
   - Result: Only changed files uploaded

3. **File removal (delete)** ✅
   - Files removed: 6 (old hashed assets)
   - Result: All removed files deleted from S3

4. **First deployment (full upload)** ✅
   - Tested in prior session
   - 114 files uploaded (6.82 MB)

5. **Error recovery** ✅
   - Manifests updated last ensures safe retry
   - If upload fails, manifests not updated → retry on next deploy

6. **Real S3 bucket (Yandex Cloud Storage)** ✅
   - Tested with `pnpm deploy:content:S3:win`
   - Endpoint: `https://storage.yandexcloud.net`
   - Bucket: `rmaster35ru-content`

### Phase 4: Documentation & Cleanup ✅ COMPLETE

**Usage examples:**

```bash
# Full deployment (build + deploy)
pnpm deploy:content:S3          # Bash (Linux/Mac/WSL)
pnpm deploy:content:S3:win      # PowerShell (Windows)

# Verbose deployment (shows file list)
pnpm deploy:content:S3:win:verbose

# Deploy only (skip build, use existing build/client/)
pnpm copy:content:S3
pnpm copy:content:S3:win
pnpm copy:content:S3:win:verbose

# Generate manifests only (for testing)
pnpm postbuild:buildManifest
```

**Environment variables (.env.deploy):**

| Variable | Description | Example |
|----------|-------------|---------|
| `CONTENT_S3_ACCESS_KEY` | S3 access key ID | `YCAJ...` |
| `CONTENT_S3_SECRET_KEY` | S3 secret access key | `secret...` |
| `CONTENT_S3_REGION` | S3 region | `ru-central1` |
| `CONTENT_S3_BUCKET` | Bucket name | `rmaster35ru-content` |
| `CONTENT_S3_ENDPOINT` | S3 endpoint URL | `https://storage.yandexcloud.net` |

**Troubleshooting:**

| Issue | Solution |
|-------|----------|
| `FATAL: .env.deploy not found` | Ensure `.env.deploy` exists at project root with all `CONTENT_S3_*` variables |
| `AWS CLI not found` | Install AWS CLI v2: `aws --version` |
| `Unable to locate credentials` | Check `.env.deploy` has valid `CONTENT_S3_ACCESS_KEY` and `CONTENT_S3_SECRET_KEY` |
| `Failed to fetch remote manifest.json` | Verify S3 bucket exists and credentials have `s3:GetObject` permission |
| `Failed to upload` | Check S3 credentials have `s3:PutObject` permission; verify bucket name is correct |
| `Failed to delete` | Check S3 credentials have `s3:DeleteObject` permission |
| Deployment uploads all files every time | Check if source files are changing (global hash invalidation); verify incremental cache at `.ssg-cache/` |
| Paths in S3 have `%5C` or backslashes | Bug: manifest paths must use forward slashes; ensure `walkDirectory()` normalizes paths |
| Empty folder prefix in S3 keys | Bug: S3 URI should be `s3://bucket` not `s3://bucket/`; destination should be `"$S3Uri/$file"` |

---

## Technical Notes

- **Hashing:** SHA-256 for all file hashes
- **Sort order:** Stable alphabetical sort for manifest keys
- **Manifest paths in bucket:** `/buildMeta.json`, `/manifest.json`
- **AWS CLI commands:** `aws s3 cp`, `aws s3 rm`, `aws s3api head-object`

---

## Dependencies

- AWS CLI installed and configured
- S3-compatible storage bucket (Beget S3)
- Node.js 18+ (for manifest script)
- Existing infrastructure:
  - `scripts/s3Common.sh` / `s3Common.ps1` — credential setup
  - `.env.deploy` — S3 credentials (`CONTENT_S3_*` vars)

---

## Existing Infrastructure (Project Context)

### Current Deployment Scripts
| Script | Purpose |
|--------|---------|
| `scripts/copyContentToS3.sh` | Bash wrapper: `aws s3 sync --delete` |
| `scripts/copyContentToS3.ps1` | PowerShell wrapper: `aws s3 sync --delete` |
| `scripts/s3Common.sh` | Shared credential loading (bash) |
| `scripts/s3Common.ps1` | Shared credential loading (PowerShell) |
| `scripts/postbuildCache.ts` | Incremental SSG cache management |

### Current Build Flow
```json
"build": "tsc -b tsconfig.app.json && react-router build && pnpm postbuild"
"deploy:content:S3": "pnpm build && pnpm copy:content:S3"
```

### Environment Variables (.env.deploy)
```bash
CONTENT_S3_ACCESS_KEY=...
CONTENT_S3_SECRET_KEY=...
CONTENT_S3_REGION=...
CONTENT_S3_BUCKET=...
CONTENT_S3_ENDPOINT=...
```

---

## Optimization Notes (Post-Review)

### What's Already in Place ✅
- S3 credential management via `s3Common.*` scripts
- `.env.deploy` for secrets (not git-tracked)
- AWS CLI already used for deployments
- Existing `deploy:content:S3` pnpm command

### Changes Required
1. **`postBuildBuildManifest.ts`** — new script
2. **Refactor `copyContentToS3.*`** — add manifest-based selective sync
3. **Update `package.json`** — chain manifest script into build

### Build Command Update

```json
"postbuild:buildManifest": "vite-node scripts/postBuildBuildManifest.ts"
"postbuild": "pnpm postbuild:buildManifest && pnpm postbuild:seo && pnpm postbuild:cache && pnpm postbuild:sitemap && pnpm postbuild:robots"
"build": "tsc -b tsconfig.app.json && react-router build && pnpm postbuild"
```

**Standalone usage:**
```bash
pnpm postbuild:buildManifest  # Run manifest generation only
pnpm postbuild                # Run all post-build steps (manifest + SEO + cache + sitemap + robots)
```
