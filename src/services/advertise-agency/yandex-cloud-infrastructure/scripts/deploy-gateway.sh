#!/usr/bin/env bash
set -euo pipefail

GATEWAY_NAME="${1:-agency-api-gateway}"
SPEC_PATH="gateway/spec.yaml"

if [ ! -f "${SPEC_PATH}" ]; then
  echo "Spec file not found at ${SPEC_PATH}"
  exit 1
fi

echo "Checking if API Gateway '${GATEWAY_NAME}' exists..."
EXISTING=$(yc serverless api-gateway list --format json | jq -r ".[] | select(.name==\"${GATEWAY_NAME}\") | .id")

if [ -n "${EXISTING}" ]; then
  echo "Updating existing API Gateway '${GATEWAY_NAME}' (id: ${EXISTING})..."
  yc serverless api-gateway update "${GATEWAY_NAME}" \
    --spec "${SPEC_PATH}"
else
  echo "Creating new API Gateway '${GATEWAY_NAME}'..."
  yc serverless api-gateway create "${GATEWAY_NAME}" \
    --spec "${SPEC_PATH}"
fi

echo "Done: API Gateway '${GATEWAY_NAME}' deployed"
