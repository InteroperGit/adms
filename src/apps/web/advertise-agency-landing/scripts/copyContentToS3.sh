#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=s3Common.sh
source "$SCRIPT_DIR/s3Common.sh" CONTENT

aws s3 sync "$SCRIPT_DIR/../build/client/" "s3://${CONTENT_S3_BUCKET}/" \
  --endpoint-url "${CONTENT_S3_ENDPOINT}" \
  --delete

echo 'Upload to Beget S3 complete.'
