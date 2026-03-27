#!/usr/bin/env bash
# s3-common.sh — shared S3 setup. Source with a prefix: source scripts/s3-common.sh ASSETS
# Sets AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION from <PREFIX>_S3_* vars.
set -euo pipefail

S3_PREFIX="${1:?Usage: source s3-common.sh <PREFIX>  (e.g. ASSETS or CONTENT)}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env.deploy"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "FATAL: .env.deploy not found at $ENV_FILE" >&2
  exit 1
fi

set -o allexport
# shellcheck source=/dev/null
source "$ENV_FILE"
set +o allexport

ACCESS_KEY_VAR="${S3_PREFIX}_S3_ACCESS_KEY"
SECRET_KEY_VAR="${S3_PREFIX}_S3_SECRET_KEY"
REGION_VAR="${S3_PREFIX}_S3_REGION"

export AWS_ACCESS_KEY_ID="${!ACCESS_KEY_VAR}"
export AWS_SECRET_ACCESS_KEY="${!SECRET_KEY_VAR}"
export AWS_DEFAULT_REGION="${!REGION_VAR}"
