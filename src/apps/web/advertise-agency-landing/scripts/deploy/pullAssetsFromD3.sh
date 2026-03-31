#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=s3Common.sh
source "$SCRIPT_DIR/s3Common.sh" ASSETS

aws s3 sync "s3://${ASSETS_S3_BUCKET}/data/content/" "$SCRIPT_DIR/../../data/content/" \
  --endpoint-url "${ASSETS_S3_ENDPOINT}" \
  --delete --no-progress

aws s3 sync "s3://${ASSETS_S3_BUCKET}/public/" "$SCRIPT_DIR/../../public/" \
  --endpoint-url "${ASSETS_S3_ENDPOINT}" \
  --delete --no-progress

echo 'Assets pulled from S3.'
