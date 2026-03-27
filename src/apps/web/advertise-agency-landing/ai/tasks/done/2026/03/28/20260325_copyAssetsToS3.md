# PDR: Copy data/content and public/images to Beget S3

## Status
TODO

## Summary
Upload the gitignored asset directories (`data/content/` and `public/images/`) to a dedicated Beget S3 bucket so they are available to the GitHub Actions CI runner at build time.

## Context
- `data/content/` — CMS content JSON files, read at build time. Gitignored.
- `public/images/` — Static image assets served directly. Gitignored.
- Target storage: **Beget.ru S3** (S3-compatible API, endpoint `https://s3.beget.com`)
- No GitHub Actions CI yet — initial upload runs **manually** from a local machine.
- Each Beget storage has its own access/secret key pair — credentials are passed via env vars, not via a shared AWS CLI profile.

## Motivation
Without these directories present in the CI environment, `pnpm build` fails. Storing them in S3 lets CI pull them before building, without committing large or private files to git.

## Approach

### One-time initial upload (local)
Run once to seed the S3 bucket from the local machine:

```bash
AWS_ACCESS_KEY_ID=$ASSETS_S3_ACCESS_KEY \
AWS_SECRET_ACCESS_KEY=$ASSETS_S3_SECRET_KEY \
AWS_DEFAULT_REGION=ru-1 \
aws s3 sync ./data/content/ s3://<ASSETS_S3_BUCKET>/data/content/ \
  --endpoint-url https://s3.beget.com

AWS_ACCESS_KEY_ID=$ASSETS_S3_ACCESS_KEY \
AWS_SECRET_ACCESS_KEY=$ASSETS_S3_SECRET_KEY \
AWS_DEFAULT_REGION=ru-1 \
aws s3 sync ./public/images/ s3://<ASSETS_S3_BUCKET>/public/images/ \
  --endpoint-url https://s3.beget.com
```

### Ongoing sync (local, after content changes)
Re-run the same commands whenever `data/content/` or `public/images/` change locally.
Add an npm script for convenience:

```json
{
  "scripts": {
    "copy:assets:S3": "bash scripts/copyAssetsToS3.sh"
  }
}
```

**`scripts/copyAssetsToS3.sh`:**
```bash
#!/usr/bin/env bash
set -euo pipefail
source .env.deploy  # contains ASSETS_S3_BUCKET, ASSETS_S3_ACCESS_KEY, ASSETS_S3_SECRET_KEY

export AWS_ACCESS_KEY_ID="${ASSETS_S3_ACCESS_KEY}"
export AWS_SECRET_ACCESS_KEY="${ASSETS_S3_SECRET_KEY}"
export AWS_DEFAULT_REGION="ru-1"

aws s3 sync ./data/content/ "s3://${ASSETS_S3_BUCKET}/data/content/" \
  --endpoint-url https://s3.beget.com

aws s3 sync ./public/images/ "s3://${ASSETS_S3_BUCKET}/public/images/" \
  --endpoint-url https://s3.beget.com

echo "Assets copied to Beget S3."
```

### CI pull step (future GitHub Actions)
When CI is set up, add a step before `pnpm build` to pull assets:

```yaml
- name: Pull assets from Beget S3
  run: |
    aws s3 sync s3://${{ secrets.ASSETS_S3_BUCKET }}/data/content/ ./data/content/ \
      --endpoint-url https://s3.beget.com
    aws s3 sync s3://${{ secrets.ASSETS_S3_BUCKET }}/public/images/ ./public/images/ \
      --endpoint-url https://s3.beget.com
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.ASSETS_S3_ACCESS_KEY }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.ASSETS_S3_SECRET_KEY }}
    AWS_DEFAULT_REGION: ru-1
    ASSETS_S3_BUCKET: ${{ secrets.ASSETS_S3_BUCKET }}
```

## Implementation Steps

1. Create a dedicated bucket (e.g. `adms-assets`) in the Beget S3 panel.
2. Add the following to `.env.deploy` (gitignored):
   ```
   ASSETS_S3_BUCKET=adms-assets
   ASSETS_S3_ACCESS_KEY=<beget-assets-access-key>
   ASSETS_S3_SECRET_KEY=<beget-assets-secret-key>
   ```
3. Create `scripts/copyAssetsToS3.sh` as shown above.
4. Run `pnpm copy:assets:S3` to seed the bucket.
5. Verify bucket contents in the Beget S3 panel.
6. When CI is configured, add the pull step from the YAML above and store Beget credentials as GitHub Actions secrets (`ASSETS_S3_ACCESS_KEY`, `ASSETS_S3_SECRET_KEY`, `ASSETS_S3_BUCKET`).

## `.env.deploy` template (gitignored)
```
ASSETS_S3_BUCKET=adms-assets
ASSETS_S3_ACCESS_KEY=<beget-assets-access-key>
ASSETS_S3_SECRET_KEY=<beget-assets-secret-key>
```

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Credentials in source control | `.env.deploy` is gitignored; never hardcode keys |
| Stale assets in bucket | Always sync from source of truth (local); `--delete` flag optional for assets |
| Large image upload time | `s3 sync` skips unchanged files on re-runs |
| Bucket accidentally public | Set bucket to private; serve images via app or signed URLs |
| Wrong credentials used | Each storage has its own key vars; no shared profile ambiguity |

## Out of Scope
- GitHub Actions CI full workflow (separate PDR)
- CDN / cache for images
- Automated sync trigger on file change
