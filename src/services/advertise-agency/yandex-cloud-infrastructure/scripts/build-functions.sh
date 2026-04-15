#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="${ROOT_DIR}/src"
SHARED_DIR="${SRC_DIR}/shared"

build_function() {
  local FUNC_NAME="$1"
  local FUNC_DIR="${SRC_DIR}/${FUNC_NAME}"
  local DIST_DIR="${FUNC_DIR}/dist"
  local STAGING_DIR="${DIST_DIR}/staging"

  echo "=== Building ${FUNC_NAME} ==="

  if [ ! -d "${FUNC_DIR}" ]; then
    echo "ERROR: Function directory not found at ${FUNC_DIR}"
    exit 1
  fi

  # Clean previous build
  find "${DIST_DIR}" -mindepth 1 -delete 2>/dev/null || rm -rf "${DIST_DIR:?}"/* 2>/dev/null || true
  mkdir -p "${DIST_DIR}"

  # Install deps
  cd "${FUNC_DIR}"
  npm install --no-audit --no-fund

  # Compile
  # Check if function uses @ path aliases (has baseUrl in tsconfig)
  if grep -q '"baseUrl"' "${FUNC_DIR}/tsconfig.json" 2>/dev/null; then
    # Use tsconfig with path aliases, override rootDir to include shared
    npx tsc \
      --project "${FUNC_DIR}/tsconfig.json" \
      --outDir "${DIST_DIR}" \
      --rootDir "${SRC_DIR}" \
      2>&1
  else
    # No path aliases: compile from command line with shared included
    # Collect source files recursively (exclude test files)
    local SRC_FILES=()
    while IFS= read -r -d '' f; do
      SRC_FILES+=("$f")
    done < <(find "${FUNC_DIR}/src" -name "*.ts" ! -name "*.test.ts" -print0)
    local SHARED_FILES=()
    while IFS= read -r -d '' f; do
      SHARED_FILES+=("$f")
    done < <(find "${SHARED_DIR}" -name "*.ts" ! -name "*.test.ts" -print0)

    npx tsc \
      --outDir "${DIST_DIR}" \
      --rootDir "${SRC_DIR}" \
      --module CommonJS \
      --moduleResolution node \
      --target ES2022 \
      --esModuleInterop \
      --skipLibCheck \
      --strict \
      "${SRC_FILES[@]}" \
      "${SHARED_FILES[@]}" \
      2>&1
  fi

  # Prepare staging directory for zip
  mkdir -p "${STAGING_DIR}"

  # Flatten compiled output into staging:
  # tsc with rootDir=src/ produces: dist/<func-name>/src/ + dist/shared/
  # We need: function files + shared/ at staging root
  FUNC_OUT="${DIST_DIR}/${FUNC_NAME}/src"
  if [ -d "${FUNC_OUT}" ]; then
    # Flat structure (orders-intake): copy all .js to staging root
    cp "${FUNC_OUT}"/*.js "${STAGING_DIR}/" 2>/dev/null || true
    # Nested structure (dispatch-message-queue): copy subdirectories
    find "${FUNC_OUT}" -mindepth 1 -type d -exec sh -c '
      for dir; do
        rel="${dir#'"${FUNC_OUT}"'/}"
        mkdir -p "'"${STAGING_DIR}"'/${rel}"
        cp "${dir}"/*.js "'"${STAGING_DIR}"'/${rel}/" 2>/dev/null || true
      done
    ' _ {} +
  fi

  # Copy shared/ into staging
  if [ -d "${DIST_DIR}/shared" ]; then
    cp -r "${DIST_DIR}/shared" "${STAGING_DIR}/shared"
  fi

  # Rewrite path aliases and fix directory index requires for YC runtime
  find "${STAGING_DIR}" -name "*.js" -exec sed -i \
    -e 's|require("@shared/types")|require("./shared/types/index.js")|g' \
    -e 's|require("@shared")|require("./shared/index.js")|g' \
    -e 's|require("@src/handler/index")|require("./handler/index.js")|g' \
    -e 's|require("@src/queue/messageQueue")|require("./queue/messageQueue.js")|g' \
    -e 's|require("@src/senders/email/sendEmail")|require("./senders/email/sendEmail.js")|g' \
    -e 's|require("@src/senders/email/emailTemplater")|require("./senders/email/emailTemplater.js")|g' \
    -e 's|require("@src/senders/telegram/sendTelegram")|require("./senders/telegram/sendTelegram.js")|g' \
    -e 's|require("@src/senders/telegram/telegramTemplater")|require("./senders/telegram/telegramTemplater.js")|g' \
    -e 's|require("@src/config/templateConfig")|require("./config/templateConfig.js")|g' \
    -e 's|require("@data/email-template-config.json")|require("./config/email-template-config.json")|g' \
    -e 's|require("@data/telegram-template-config.json")|require("./config/telegram-template-config.json")|g' \
    -e 's|require("../../shared/types")|require("./shared/types/index.js")|g' \
    -e 's|require("../../shared")|require("./shared/index.js")|g' \
    -e 's|require("../shared")|require("./shared/index.js")|g' \
    -e 's|require("./shared")|require("./shared/index.js")|g' \
    {} \;

  # Copy package.json and package-lock.json to staging root
  cp "${FUNC_DIR}/package.json" "${STAGING_DIR}/package.json"
  cp "${FUNC_DIR}/package-lock.json" "${STAGING_DIR}/package-lock.json" 2>/dev/null || true

  # Copy data config files for @data imports (dispatch-message-queue)
  if [ -d "${FUNC_DIR}/data/config" ]; then
    mkdir -p "${STAGING_DIR}/config"
    cp "${FUNC_DIR}/data/config/"*.json "${STAGING_DIR}/config/" 2>/dev/null || true
  fi

  # Create deployment zip (Python zipfile always uses forward slashes)
  local PY_STAGING
  PY_STAGING="$(cd "${STAGING_DIR}" && python -c "import os; print(os.getcwd())")"
  local PY_DIST
  PY_DIST="$(cd "${DIST_DIR}" && python -c "import os; print(os.getcwd())")"
  python -c "
import os, zipfile
staging = r'${PY_STAGING}'
dest = os.path.join(r'${PY_DIST}', 'index.zip')
with zipfile.ZipFile(dest, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(staging):
        for f in files:
            full = os.path.join(root, f)
            arcname = os.path.relpath(full, staging).replace(os.sep, '/')
            z.write(full, arcname)
"

  # Clean staging and temp output
  rm -rf "${STAGING_DIR}"
  rm -rf "${DIST_DIR}/${FUNC_NAME}"
  rm -rf "${DIST_DIR}/shared"

  echo "=== ${FUNC_NAME} built: ${DIST_DIR}/index.zip ==="
}

# Build all functions if no args, or specific function if arg provided
if [ $# -eq 0 ]; then
  for dir in "${SRC_DIR}"/*/; do
    if [ -f "${dir}package.json" ] && [ -f "${dir}tsconfig.json" ]; then
      func_name="$(basename "${dir}")"
      build_function "${func_name}"
    fi
  done
else
  build_function "$1"
fi
