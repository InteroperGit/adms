# PDR: Copy Build Client Content to S3

## Status
TODO

## Summary
Copy the contents of `./build/client` to a **Beget.ru S3** bucket as part of the deployment pipeline.

## Context
- Target storage: **Beget.ru S3** (S3-compatible API)
- No GitHub Actions CI is in place yet — deployment is run **manually** from a local machine or server.

## Motivation
The static build output in `./build/client` needs to be uploaded to S3 so it can be served from the Beget.ru object storage.

## Approach

### Option A: AWS CLI with custom endpoint (Recommended)
Beget.ru S3 is S3-compatible, so the AWS CLI works with a custom `--endpoint-url`.

```bash
aws s3 sync ./build/client s3://<BUCKET_NAME>/ \
  --endpoint-url https://s3.beget.com \
  --delete
```

**Pros:**
- Incremental sync (only uploads changed files)
- `--delete` removes stale files from the bucket
- No extra dependencies beyond the AWS CLI

**Cons:**
- Requires AWS CLI installed locally with Beget credentials configured

### Option B: Node.js Script (`@aws-sdk/client-s3`)
Use the AWS SDK v3 with a custom `endpoint` pointing to Beget.ru.

**Pros:**
- Integrates directly into the npm build pipeline
- Cross-platform, no CLI binary required

**Cons:**
- More boilerplate; must handle recursive directory traversal and MIME types manually

## Decision
Use **Option A** (AWS CLI `s3 sync` with Beget endpoint). Run manually via an npm script until CI is set up.

## Implementation Steps

1. **Configure Beget S3 credentials** locally:
   ```bash
   aws configure --profile beget
   # AWS Access Key ID: <beget-access-key>
   # AWS Secret Access Key: <beget-secret-key>
   # Default region name: ru-1  (or as shown in Beget panel)
   # Default output format: json
   ```

2. **Add S3 bucket name** to a local `.env.deploy` (gitignored):
   ```
   CONTENT_S3_BUCKET=my-beget-bucket
   ```

3. **Create `scripts/copyContentToS3.sh`**:
   ```bash
   #!/usr/bin/env bash
   set -euo pipefail
   source .env.deploy
   aws s3 sync ./build/client "s3://${CONTENT_S3_BUCKET}/" \
     --endpoint-url https://s3.beget.com \
     --profile beget \
     --delete
   echo "Upload to Beget S3 complete."
   ```

4. **Add npm script** in `package.json`:
   ```json
   {
     "scripts": {
       "copy:content:s3": "bash scripts/copyContentToS3.sh"
     }
   }
   ```

5. **Run manually after build**:
   ```bash
   pnpm build && pnpm copy:content:s3
   ```

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Accidental deletion of bucket objects | Test with `--dryrun` flag before enabling `--delete` |
| Credentials in source control | Add `.env.deploy` to `.gitignore`; never hardcode keys |
| MIME type issues for assets | AWS CLI infers MIME types automatically |
| Beget endpoint URL changes | Keep endpoint in a variable, check Beget docs for current URL |

## Blockers for GitHub Actions CI

The following directories are **gitignored** and therefore not available in a CI runner clone:

| Path | What it contains |
|------|------------------|
| `data/content/` | CMS content JSON files read at build time |
| `public/images/` | Static image assets served directly |

### Resolution options

**Option 1 — Beget S3 as asset source (Recommended)**
Store `data/content/` and `public/images/` in a dedicated Beget S3 bucket (e.g. `assets-bucket`). Add a CI step that downloads them before `pnpm build`:
```bash
aws s3 sync s3://assets-bucket/data/content/ ./data/content/ --endpoint-url https://s3.beget.com
aws s3 sync s3://assets-bucket/public/images/ ./public/images/ --endpoint-url https://s3.beget.com
```

**Option 2 — GitHub Actions secret / artifact**
For small content volumes, zip and store as a GitHub Actions artifact or encrypted secret, then unzip in CI. Not practical for large image sets.

**Option 3 — Private git submodule**
Move assets into a private repo and add as a git submodule. CI checks out with `submodules: true`.

### Recommended next step
Set up a separate `assets` bucket on Beget S3, upload current `data/content/` and `public/images/` there once, then keep them in sync on each content change. The CI workflow pulls from that bucket before building.

## Out of Scope
- CDN / cache invalidation
- Setting bucket policy / ACLs

## References
- [Beget S3 documentation](https://beget.com/ru/kb/s3)
- [AWS CLI s3 sync docs](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/sync.html)
