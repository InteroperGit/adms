#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=s3Common.sh
source "$SCRIPT_DIR/s3Common.sh" ASSETS

aws s3 sync "$SCRIPT_DIR/../data/content/" "s3://${ASSETS_S3_BUCKET}/data/content/" \
  --endpoint-url "${ASSETS_S3_ENDPOINT}" \
  --no-checksum --no-progress

aws s3 sync "$SCRIPT_DIR/../public/images/" "s3://${ASSETS_S3_BUCKET}/public/images/" \
  --endpoint-url "${ASSETS_S3_ENDPOINT}" \
  --no-checksum --no-progress

echo 'Assets copied to Beget S3.'
