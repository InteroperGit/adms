#!/usr/bin/env bash
set -euo pipefail

# copyContentToS3.sh — Selective S3 deployment with manifest-based diff
# Only uploads changed files, deletes removed files, updates manifests last

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BUILD_DIR="$ROOT_DIR/build/client"
# Convert to Windows path with forward slashes for Node.js
BUILD_DIR_NODE=$(cygpath -wm "$BUILD_DIR" 2>/dev/null || echo "$BUILD_DIR" | sed 's|^/d/|D:/|' | sed 's|\\|/|g')

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
DIM='\033[0;2m'
NC='\033[0m' # No Color

log() {
  echo -e "${CYAN}[deploy]${NC} $1"
}

log_success() {
  echo -e "${CYAN}[deploy]${NC} ${GREEN}✓${NC} $1"
}

log_warning() {
  echo -e "${CYAN}[deploy]${NC} ${YELLOW}⚠${NC} $1"
}

log_error() {
  echo -e "${CYAN}[deploy]${NC} ${RED}✗${NC} $1"
}

log_dim() {
  echo -e "${DIM}$1${NC}"
}

format_bytes() {
  local bytes=$1
  if (( bytes < 1024 )); then
    echo "${bytes} B"
  elif (( bytes < 1024 * 1024 )); then
    echo "$(awk "BEGIN {printf \"%.1f\", $bytes/1024}") KB"
  else
    echo "$(awk "BEGIN {printf \"%.2f\", $bytes/(1024*1024)}") MB"
  fi
}

# Source S3 credentials
# shellcheck source=s3Common.sh
source "$SCRIPT_DIR/s3Common.sh" CONTENT

S3_URI="s3://${CONTENT_S3_BUCKET}"

# Counters
FILES_ADDED=0
FILES_CHANGED=0
FILES_REMOVED=0
BYTES_UPLOADED=0

# S3 constants
MANIFEST_FILE="manifest.json"
BUILD_META_FILE="buildMeta.json"

log "Starting selective deployment to S3..."
log_dim "Endpoint: $CONTENT_S3_ENDPOINT"
log_dim "Bucket: $CONTENT_S3_BUCKET"

# Temp files for fetching remote manifests
TEMP_BUILD_META="/tmp/buildMeta.$$.json"
TEMP_MANIFEST="/tmp/manifest.$$.json"

# Cleanup function
cleanup() {
  rm -f "$TEMP_BUILD_META" "$TEMP_MANIFEST" 2>/dev/null
}
trap cleanup EXIT

# Fetch remote buildMeta.json using Node.js for reliable JSON parsing
log "Fetching remote buildMeta.json..."
REMOTE_BUILD_META=""
if aws s3 cp "$S3_URI/$BUILD_META_FILE" "$TEMP_BUILD_META" \
  --endpoint-url "$CONTENT_S3_ENDPOINT" \
  --quiet 2>/dev/null; then
  REMOTE_BUILD_META=$(cat "$TEMP_BUILD_META")
fi

# Fetch remote manifest.json
log "Fetching remote manifest.json..."
REMOTE_MANIFEST=""
if aws s3 cp "$S3_URI/$MANIFEST_FILE" "$TEMP_MANIFEST" \
  --endpoint-url "$CONTENT_S3_ENDPOINT" \
  --quiet 2>/dev/null; then
  REMOTE_MANIFEST=$(cat "$TEMP_MANIFEST")
fi

# Compute diff and extract all data in a single Node.js invocation
DIFF_DATA=$(node -e "
const fs = require('fs');

// Parse local manifest
let localManifest;
try {
  localManifest = JSON.parse(fs.readFileSync('$BUILD_DIR_NODE/manifest.json', 'utf8'));
} catch (e) {
  console.error('Failed to parse local manifest');
  process.exit(1);
}

// Parse remote manifest (may be empty)
let remoteFiles = {};
const remoteStr = \`$REMOTE_MANIFEST\`.trim();
if (remoteStr !== '') {
  try {
    const remoteManifest = JSON.parse(remoteStr);
    remoteFiles = remoteManifest.files || {};
  } catch (e) {
    // Remote manifest invalid, treat as empty
  }
}

const localFiles = localManifest.files || {};
const added = [], changed = [], removed = [], unchanged = [];
let bytesToUpload = 0;

// Check local files against remote
for (const [path, entry] of Object.entries(localFiles)) {
  const remoteEntry = remoteFiles[path];
  if (!remoteEntry) {
    added.push(path);
    bytesToUpload += entry.size;
  } else if (remoteEntry.sha256 !== entry.sha256) {
    changed.push(path);
    bytesToUpload += entry.size;
  } else {
    unchanged.push(path);
  }
}

// Check for removed files
for (const path of Object.keys(remoteFiles)) {
  if (!localFiles[path]) {
    removed.push(path);
  }
}

// Output all data as JSON
console.log(JSON.stringify({
  added,
  changed,
  removed,
  unchangedCount: unchanged.length,
  bytesToUpload,
  localFiles
}));
") || {
  log_error "Failed to compute file diff"
  exit 1
}

# Parse diff result - get counts directly from Node.js (more reliable than counting lines)
ADDED_COUNT=$(echo "$DIFF_DATA" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.added.length)")
CHANGED_COUNT=$(echo "$DIFF_DATA" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.changed.length)")
REMOVED_COUNT=$(echo "$DIFF_DATA" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.removed.length)")
UNCHANGED_COUNT=$(echo "$DIFF_DATA" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.unchangedCount)")
BYTES_TO_UPLOAD=$(echo "$DIFF_DATA" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.bytesToUpload)")

# Get file lists as newline-separated strings
ADDED_FILES=$(echo "$DIFF_DATA" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.added.join('\n'))")
CHANGED_FILES=$(echo "$DIFF_DATA" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.changed.join('\n'))")
REMOVED_FILES=$(echo "$DIFF_DATA" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(d.removed.join('\n'))")

# Get localFiles for cache-control lookup (single parse)
LOCAL_FILES_JSON=$(echo "$DIFF_DATA" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); console.log(JSON.stringify(d.localFiles))")

log "Files to add: $ADDED_COUNT"
log "Files to change: $CHANGED_COUNT"
log "Files to remove: $REMOVED_COUNT"
log "Files unchanged: $UNCHANGED_COUNT"

if [[ $ADDED_COUNT -eq 0 && $CHANGED_COUNT -eq 0 && $REMOVED_COUNT -eq 0 ]]; then
  log_warning "No files to sync despite hash mismatch"
  exit 0
fi

# Upload added and changed files
echo ""
log "Uploading files..."

upload_file() {
  local file="$1"
  local cache_control="$2"
  local src="$BUILD_DIR/$file"
  local dest="$S3_URI/$file"

  if aws s3 cp "$src" "$dest" \
    --endpoint-url "$CONTENT_S3_ENDPOINT" \
    --cache-control "$cache_control" \
    --quiet; then
    return 0
  else
    return 1
  fi
}

# Get all cache-control values in a single Node.js call
declare -A CACHE_CONTROL_MAP
while IFS='=' read -r file cc; do
  CACHE_CONTROL_MAP["$file"]="$cc"
done < <(echo "$LOCAL_FILES_JSON" | node -e "
const j=JSON.parse(require('fs').readFileSync(0,'utf8'));
for (const [path, entry] of Object.entries(j)) {
  console.log(path + '=' + (entry.cacheControl || 'public,max-age=3600'));
}
")

# Upload added files
if [[ -n "$ADDED_FILES" ]]; then
  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    cache_control="${CACHE_CONTROL_MAP[$file]:-public,max-age=3600}"
    if upload_file "$file" "$cache_control"; then
      ((FILES_ADDED++)) || true
    else
      log_error "Failed to upload: $file"
    fi
  done <<< "$ADDED_FILES"
fi

# Upload changed files
if [[ -n "$CHANGED_FILES" ]]; then
  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    cache_control="${CACHE_CONTROL_MAP[$file]:-public,max-age=3600}"
    if upload_file "$file" "$cache_control"; then
      ((FILES_CHANGED++)) || true
    else
      log_error "Failed to upload: $file"
    fi
  done <<< "$CHANGED_FILES"
fi

# Delete removed files
if [[ -n "$REMOVED_FILES" ]]; then
  echo ""
  log "Deleting removed files..."
  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    local dest="$S3_URI/$file"
    if aws s3 rm "$dest" \
      --endpoint-url "$CONTENT_S3_ENDPOINT" \
      --quiet; then
      ((FILES_REMOVED++)) || true
    else
      log_error "Failed to delete: $file"
    fi
  done <<< "$REMOVED_FILES"
fi

# Upload manifests LAST (critical for atomic state)
echo ""
log "Updating remote manifests..."

if ! aws s3 cp "$BUILD_DIR/manifest.json" "$S3_URI/manifest.json" \
  --endpoint-url "$CONTENT_S3_ENDPOINT" \
  --cache-control "no-cache" \
  --quiet; then
  log_error "Failed to upload manifest.json"
  exit 1
fi

if ! aws s3 cp "$BUILD_DIR/buildMeta.json" "$S3_URI/buildMeta.json" \
  --endpoint-url "$CONTENT_S3_ENDPOINT" \
  --cache-control "no-cache" \
  --quiet; then
  log_error "Failed to upload buildMeta.json"
  exit 1
fi

# Print summary
echo ""
log_success "Deployment complete"
echo ""
log_dim "=== Deployment Summary ==="
log_dim "Status: COMPLETED"
log_dim "────────────────────────────────"
log_dim "Files added:     $FILES_ADDED"
log_dim "Files changed:   $FILES_CHANGED"
log_dim "Files removed:   $FILES_REMOVED"
log_dim "Files unchanged: $UNCHANGED_COUNT"
log_dim "────────────────────────────────"
log_dim "Total uploaded:  $(format_bytes $BYTES_TO_UPLOAD)"
