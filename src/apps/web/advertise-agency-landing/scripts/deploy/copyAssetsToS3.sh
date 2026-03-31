#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=s3Common.sh
source "$SCRIPT_DIR/s3Common.sh" ASSETS

aws s3 sync "$SCRIPT_DIR/../../data/content/" "s3://${ASSETS_S3_BUCKET}/data/content/" \
  --endpoint-url "${ASSETS_S3_ENDPOINT}" \
  --no-progress

aws s3 sync "$SCRIPT_DIR/../../public/" "s3://${ASSETS_S3_BUCKET}/public/" \
  --endpoint-url "${ASSETS_S3_ENDPOINT}" \
  --no-progress

echo 'Assets copied to S3.'
