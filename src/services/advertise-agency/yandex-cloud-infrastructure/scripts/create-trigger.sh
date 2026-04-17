#!/bin/bash
# Creates the dispatch-message-queue trigger via YC CLI.
# The Yandex Terraform provider does NOT support yandex_serverless_event_trigger.
#
# Usage: ./scripts/create-trigger.sh
# Requires: yc CLI authenticated, dispatch-message-queue function already deployed

set -e

FOLDER_ID="b1gci0tl0ol5bq3pn47g"
QUEUE_YRN="yrn:yc:ymq:ru-central1:${FOLDER_ID}:rmaster-message-queue"

# Get the current function ID
FUNCTION_ID=$(yc serverless function get dispatch-message-queue --format json | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -z "$FUNCTION_ID" ]; then
  echo "ERROR: dispatch-message-queue function not found. Deploy it first."
  exit 1
fi

# Get the service account ID
SA_ID=$(yc iam service-account get function-sa --format json | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -z "$SA_ID" ]; then
  echo "ERROR: function-sa service account not found."
  exit 1
fi

echo "Function ID: $FUNCTION_ID"
echo "Service Account ID: $SA_ID"

# Check if trigger already exists
EXISTING=$(yc serverless trigger get dispatch-message-queue-trigger --format json 2>/dev/null || echo "")

if [ -n "$EXISTING" ]; then
  EXISTING_ID=$(echo "$EXISTING" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")
  echo "Trigger already exists (id: $EXISTING_ID). Deleting and recreating..."
  yc serverless trigger delete "$EXISTING_ID" --async
  sleep 2
fi

# Create the trigger
yc serverless trigger create message-queue dispatch-message-queue-trigger \
  --queue "$QUEUE_YRN" \
  --queue-service-account-id "$SA_ID" \
  --invoke-function-id "$FUNCTION_ID" \
  --invoke-function-tag '$latest' \
  --invoke-function-service-account-id "$SA_ID" \
  --batch-size 10 \
  --batch-cutoff 10s \
  --description "Trigger dispatch-message-queue function when MessageQueue contains messages"

echo ""
echo "Trigger created successfully."
