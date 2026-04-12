#!/usr/bin/env bash
set -euo pipefail

GATEWAY_NAME="${1:-agency-api-gateway}"
SPEC_PATH="gateway/spec.yaml"

if [ ! -f "${SPEC_PATH}" ]; then
  echo "Spec file not found at ${SPEC_PATH}"
  exit 1
fi

echo "Deploying API Gateway '${GATEWAY_NAME}'..."
yc serverless api-gateway create "${GATEWAY_NAME}" \
  --spec "${SPEC_PATH}"

echo "Done: API Gateway '${GATEWAY_NAME}' deployed"
