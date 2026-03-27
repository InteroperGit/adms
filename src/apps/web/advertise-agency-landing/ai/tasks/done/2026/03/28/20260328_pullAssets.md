# 20260328 — Pull Assets from S3 PDR

## Status: pending

## Goal

Create cross-platform scripts to pull production assets from S3 into the local working tree. Assets are split across two directories (`public/images/` and `data/content/*`) that are gitignored and must be fetched manually before local dev or build.

Both scripts mirror the pattern of the existing `copyAssetsToS3.sh` / `copyAssetsToS3.ps1` scripts — they delegate credential/env loading to `scripts/s3Common.sh` (bash) and `scripts/s3Common.ps1` (PowerShell) using the `ASSETS` prefix. All required vars (`ASSETS_S3_ACCESS_KEY`, `ASSETS_S3_SECRET_KEY`, `ASSETS_S3_REGION`, `ASSETS_S3_BUCKET`, `ASSETS_S3_ENDPOINT`) are read from `.env.deploy` by the common scripts.

---

## Reference: existing copy scripts

The pull scripts are the reverse of these and must stay in sync with them:

| Copy (upload) | Pull (download) |
|---|---|
| `scripts/copyAssetsToS3.sh` | `scripts/pullAssetsFromD3.sh` |
| `scripts/copyAssetsToS3.ps1` | `scripts/pullAssetsFromD3.ps1` |

The copy scripts sync `data/content/` and `public/images/` **to** S3. The pull scripts sync the same paths **from** S3.

---

## Tasks

### T1 · Shell script: `scripts/pullAssetsFromD3.sh`

**Priority:** high · **Scope:** scripts + tooling

Create `scripts/pullAssetsFromD3.sh` for macOS / Linux / WSL developers.

**Requirements:**
- `#!/usr/bin/env bash` shebang; `set -euo pipefail`
- Source `"$SCRIPT_DIR/s3Common.sh" ASSETS` to load `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `ASSETS_S3_BUCKET`, `ASSETS_S3_ENDPOINT` into the process environment
- Sync `s3://${ASSETS_S3_BUCKET}/data/content/` → `$SCRIPT_DIR/../data/content/` with `--endpoint-url`, `--no-checksum`, `--no-progress`
- Sync `s3://${ASSETS_S3_BUCKET}/public/` → `$SCRIPT_DIR/../public/` with the same flags (entire `public/` directory, not just `public/images/`)
- Use `--delete` so local files removed from S3 are cleaned up
- Fail fast: check `$?` / rely on `set -e`; print a clear error message on failure
- Print `'Assets pulled from S3.'` on success
- Mark executable in git after creation: `git update-index --chmod=+x scripts/pullAssetsFromD3.sh`

**Skeleton (follow `copyAssetsToS3.sh` style exactly):**
```bash
#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=s3Common.sh
source "$SCRIPT_DIR/s3Common.sh" ASSETS

aws s3 sync "s3://${ASSETS_S3_BUCKET}/data/content/" "$SCRIPT_DIR/../data/content/" \
  --endpoint-url "${ASSETS_S3_ENDPOINT}" \
  --delete --no-checksum --no-progress

aws s3 sync "s3://${ASSETS_S3_BUCKET}/public/" "$SCRIPT_DIR/../public/" \
  --endpoint-url "${ASSETS_S3_ENDPOINT}" \
  --delete --no-checksum --no-progress

echo 'Assets pulled from S3.'
```

**Usage:**
```bash
bash scripts/pullAssetsFromD3.sh
pnpm pull:assets:S3
```

**Files:**
- `scripts/pullAssetsFromD3.sh` — new

---

### T2 · PowerShell script: `scripts/pullAssetsFromD3.ps1`

**Priority:** high · **Scope:** scripts + tooling

Create `scripts/pullAssetsFromD3.ps1` for Windows developers.

**Requirements:**
- `Set-StrictMode -Version Latest`; `$ErrorActionPreference = 'Stop'`
- Dot-source `"$PSScriptRoot\s3Common.ps1" -Prefix ASSETS` (note: backslash path, matching existing scripts)
- Resolve repo root via `Resolve-Path (Join-Path $PSScriptRoot '..')`
- Sync `s3://$($env:ASSETS_S3_BUCKET)/data/content/` → `$root\data\content\` using `--endpoint-url $env:ASSETS_S3_ENDPOINT`
- Sync `s3://$($env:ASSETS_S3_BUCKET)/public/` → `$root\public\` using the same endpoint (entire `public/` directory)
- Add `--delete` flag so local files removed from S3 are cleaned up
- Check `$LASTEXITCODE -ne 0` after each `aws` call and throw a descriptive error
- Print `'Assets pulled from S3.'` on success

**Skeleton (follow `copyAssetsToS3.ps1` style exactly):**
```powershell
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

. "$PSScriptRoot\s3Common.ps1" -Prefix ASSETS

$root         = Resolve-Path (Join-Path $PSScriptRoot '..')
$endpointArgs = @('--endpoint-url', $env:ASSETS_S3_ENDPOINT)

aws s3 sync "s3://$($env:ASSETS_S3_BUCKET)/data/content/" "$root\data\content\" @endpointArgs --delete
if ($LASTEXITCODE -ne 0) { throw "aws s3 sync (data/content) exited with code $LASTEXITCODE" }

aws s3 sync "s3://$($env:ASSETS_S3_BUCKET)/public/" "$root\public\" @endpointArgs --delete
if ($LASTEXITCODE -ne 0) { throw "aws s3 sync (public) exited with code $LASTEXITCODE" }

Write-Host 'Assets pulled from S3.'
```

**Usage:**
```powershell
.\scripts\pullAssetsFromD3.ps1
pnpm pull:assets:S3:win
```

**Files:**
- `scripts/pullAssetsFromD3.ps1` — new

---

### T3 · Package.json scripts

**Priority:** medium · **Scope:** tooling

Add two `pnpm` scripts following the existing `copy:assets:S3` / `copy:assets:S3:win` naming convention, placed adjacent to them in `package.json`:

```json
"pull:assets:S3":     "bash scripts/pullAssetsFromD3.sh",
"pull:assets:S3:win": "powershell -ExecutionPolicy Bypass -File scripts/pullAssetsFromD3.ps1"
```

**Files:**
- `package.json` — add `pull:assets:S3` and `pull:assets:S3:win` scripts

---

## Priority Summary

| # | Task | Priority | Effort | Dependencies |
|---|------|----------|--------|--------------|
| T1 | Shell script `pullAssetsFromD3.sh` | high | small | `scripts/s3Common.sh` (exists) |
| T2 | PowerShell script `pullAssetsFromD3.ps1` | high | small | `scripts/s3Common.ps1` (exists) |
# repaired truncated tail
