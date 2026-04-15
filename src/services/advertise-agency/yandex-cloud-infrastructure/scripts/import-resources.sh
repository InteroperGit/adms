#!/usr/bin/env bash
# Import existing Yandex Cloud resources into Terraform state.
# Prerequisites:
#   - yc CLI authenticated (yc init)
#   - terraform CLI installed
#   - Both functions built (pnpm build in each function dir)
#   - Zip files created in dist/ directories
#
# Usage:
#   cd infra/terraform
#   bash ../../scripts/import-resources.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TF_DIR="$(cd "$SCRIPT_DIR/../infra/terraform" && pwd)"
ENV_FILE="$SCRIPT_DIR/../infra/environments/prod.tfvars"

# Get fresh IAM token
YC_TOKEN=$(yc iam create-token 2>/dev/null)
export TF_VAR_yc_token="$YC_TOKEN"

cd "$TF_DIR"

echo "=== Initializing Terraform ==="
terraform init

echo ""
echo "=== Importing resources into state ==="

echo "  -> yandex_function.orders_intake (d4e3m3ni48sjdc2cp94a)"
terraform import -var-file="$ENV_FILE" yandex_function.orders_intake d4e3m3ni48sjdc2cp94a

echo "  -> yandex_iam_service_account.function_sa (ajereq47qpmlg7ejmbsc)"
terraform import -var-file="$ENV_FILE" yandex_iam_service_account.function_sa ajereq47qpmlg7ejmbsc

echo "  -> yandex_storage_bucket.content (rmaster35ru-content)"
terraform import -var-file="$ENV_FILE" yandex_storage_bucket.content rmaster35ru-content

echo "  -> yandex_storage_bucket.assets (rmaster35ru-assets)"
terraform import -var-file="$ENV_FILE" yandex_storage_bucket.assets rmaster35ru-assets

echo "  -> yandex_storage_bucket.logs (rmaster35ru-logs)"
terraform import -var-file="$ENV_FILE" yandex_storage_bucket.logs rmaster35ru-logs

echo ""
echo "=== Verifying imported state ==="
terraform state list

echo ""
echo "=== Running plan to check for drift ==="
terraform plan -var-file="$ENV_FILE" -detailed-exitcode || {
  exit_code=$?
  if [ $exit_code -eq 2 ]; then
    echo ""
    echo "Drift detected! Review the plan output above and adjust the"
    echo "Terraform configuration to match live state before applying."
    exit 0
  fi
  exit $exit_code
}

echo ""
echo "=== Import complete ==="
echo "Review the plan output. If everything looks correct, run:"
echo "  terraform apply -var-file=$ENV_FILE"
