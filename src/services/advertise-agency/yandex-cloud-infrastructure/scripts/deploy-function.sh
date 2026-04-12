#!/usr/bin/env bash
set -euo pipefail

FUNCTION_NAME="${1:?Usage: deploy-function.sh <function-name>}"
FUNCTION_DIR="src/${FUNCTION_NAME}"

if [ ! -d "${FUNCTION_DIR}" ]; then
  echo "Function '${FUNCTION_NAME}' not found at ${FUNCTION_DIR}"
  exit 1
fi

echo "Building ${FUNCTION_NAME}..."
cd "${FUNCTION_DIR}"
npm install
npm run build

echo "Packaging ${FUNCTION_NAME}..."
cd dist
zip -r ../index.zip index.js

echo "Deploying ${FUNCTION_NAME} to Yandex Cloud..."
yc serverless function deploy version \
  --function-name "${FUNCTION_NAME}" \
  --runtime nodejs22 \
  --entrypoint index.handler \
  --memory 128m \
  --execution-timeout 5s \
  --source-path ../index.zip

echo "Done: ${FUNCTION_NAME} deployed"
