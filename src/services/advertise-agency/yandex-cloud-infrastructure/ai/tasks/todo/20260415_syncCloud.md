# PDR — Synchronize Terraform with existing Yandex Cloud account

Date: 2026-04-15
Status: in-progress
Scope: `yandex-cloud-infrastructure`

## Context

The Terraform configuration in this repository was written for a different set of functions (`order-form`, `captcha-verify`) that do not exist on disk. The actual implementations are `orders-intake` (SQS producer) and `dispatch-message-queue` (SQS consumer with email + Telegram notifications). The API Gateway spec (`gateway/spec.yaml`) contains hardcoded IDs from an existing Yandex Cloud account. The IAM setup is minimal — only a service account with `functions.functionInvoker`. There is no Terraform resource for the existing S3 bucket used for storage.

Goal: align Terraform with the real infrastructure in the Yandex Cloud account — remove phantom functions, declare current ones, expand IAM roles to cover SQS and storage, and import existing resources into Terraform state.

## Current findings

- **Phantom functions**: `infra/terraform/functions.tf` declares `order-form` and `captcha-verify` — neither directory exists
- **Real functions**:
  - `src/orders-intake/` — POST handler, validates SmartCaptcha, enqueues to SQS (30 tests)
  - `src/dispatch-message-queue/` — SQS consumer, sends email (nodemailer) + Telegram notifications (51 tests)
- **API Gateway**: `gateway/spec.yaml` has hardcoded `function_id: d4e3m3ni48sjdc2cp94a` and `service_account_id: ajereq47qpmlg7ejmbsc`
- **IAM**: only `functions.functionInvoker` role assigned; SQS and Object Storage roles are missing
- **S3 bucket**: exists in the YC account but is not declared in Terraform
- **Backend**: remote S3 backend is commented out; state is local
- **Variables**: `folder_id` is empty in both `dev.tfvars` and `prod.tfvars`

## Objectives

1. Remove Terraform resources for non-existent functions
2. Declare `orders-intake` and `dispatch-message-queue` as Terraform-managed functions
3. Expand IAM to cover SQS access and Object Storage permissions
4. Add existing S3 bucket as a Terraform data source or imported resource
5. Render API Gateway spec with real Terraform resource IDs (no hardcoded values)
6. Import existing YC resources into Terraform state
7. Document the sync workflow

## Tasks

### T1. Remove phantom function resources

- [x] Delete `yandex_function.order_form` and `yandex_function.captcha_verify` from `infra/terraform/functions.tf`
- [x] Remove corresponding outputs from `infra/terraform/outputs.tf`
- [x] Update `README.md` structure diagram to reflect actual function names

### T2. Declare current functions in Terraform

- [x] Add `yandex_function.orders_intake` resource:
  - Runtime: `nodejs22`, entrypoint: `index.handler`, memory: `128`, timeout: `5s`
  - Source: `src/orders-intake/dist/index.zip`
  - Environment vars: `NODE_ENV`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `QUEUE_URL`, `SMARTCAPTCHA_SERVER_KEY`
- [x] Add `yandex_function.dispatch_queue_messages` resource:
  - Runtime: `nodejs22`, entrypoint: `handler/index.handler`, memory: `128`, timeout: `5s`
  - Source: `src/dispatch-message-queue/dist/index.zip`
  - Environment vars: `NODE_ENV`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `QUEUE_URL`, `SMTP_USER`, `SMTP_PASSWORD`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- [x] Add variables for all required env vars in `infra/terraform/variables.tf` with sensible defaults and `sensitive = true` for secrets
- [x] Add outputs for both function IDs

### T3. Expand IAM roles

- [x] Keep existing `yandex_iam_service_account.function_sa` with `functions.functionInvoker`
- [x] Add `serverless.functions.admin` role for function deployment and management
- [x] Add `storage.admin` role for S3 bucket access
- [x] Add `message-queue.admin` role for SQS read/write access

### T4. Add S3 bucket resource

- [x] Add `yandex_storage_bucket` resource for the existing bucket (with `prevent_destroy = true`)
- [x] Do NOT modify or recreate the bucket — use `import` to bring it under Terraform management
- [x] Add bucket name as a variable in `variables.tf`

### T5. Render API Gateway spec from Terraform

- [x] Replace `file(...)` in `infra/terraform/gateway.tf` with `templatefile(...)`
- [x] Create `gateway/spec.yaml.tpl` template with placeholders for:
  - `${api_gateway_url}`
  - `${orders_intake_function_id}`
  - `${service_account_id}`
- [x] Update the spec to include the `/orders` route pointing to `orders_intake`
- [x] Remove the hardcoded `function_id` and `service_account_id` from `spec.yaml`
- [x] Make custom domain optional (variable with default empty)

### T6. Import existing resources into Terraform state

- [ ] Authenticate to YC (`yc init` or service account key)
- [ ] Run `terraform import` for each existing resource:
  - [ ] Service account
  - [ ] Orders-intake function (existing in YC)
  - [ ] Dispatch-queue-messages function (existing in YC)
  - [ ] API Gateway
  - [ ] S3 bucket
  - [ ] SQS queue (if managed via Terraform)
- [ ] Run `terraform plan` to identify drift
- [ ] Adjust Terraform config to match live state until plan shows no unexpected changes

### T7. Enable remote state backend

- [ ] Uncomment and configure the S3 backend in `infra/terraform/backend.tf`
- [ ] Use the existing S3 bucket for Terraform state storage
- [ ] Migrate local state to remote: `terraform init -migrate-state`

### T8. Populate environment variables

- [ ] Update `infra/environments/dev.tfvars` with real `folder_id` and all required variables
- [ ] Update `infra/environments/prod.tfvars` with real `folder_id` and all required variables
- [ ] Document which values must be provided by the user (secrets, IDs)

### T9. Update documentation

- [ ] Update `README.md` with:
  - Correct function names and descriptions
  - Sync workflow for existing infrastructure (import + plan + apply)
  - Required environment variables and their purpose
  - How to authenticate (`yc init` vs service account key)
- [ ] Mark CLI deploy scripts as deprecated or update them to match Terraform resources

## Critical files

- `infra/terraform/functions.tf` — rewrite with real functions
- `infra/terraform/iam.tf` — expand IAM roles
- `infra/terraform/gateway.tf` — template-based spec rendering
- `gateway/spec.yaml` — remove hardcoded IDs, convert to template
- `infra/terraform/variables.tf` — add all required variables
- `infra/terraform/outputs.tf` — update outputs
- `infra/terraform/backend.tf` — enable remote state
- `infra/environments/dev.tfvars` — populate real values
- `infra/environments/prod.tfvars` — populate real values
- `README.md` — update documentation

## Verification

- [ ] Run `terraform init` — providers initialize successfully
- [ ] Run `terraform plan -var-file=../environments/dev.tfvars` — no phantom resources, no unexpected drift
- [ ] Confirm all imported resources show as managed in `terraform state list`
- [ ] Verify API Gateway spec uses resolved IDs (no hardcoded values)
- [ ] Verify IAM roles cover all required permissions (functions, SQS, storage)
- [ ] Build both functions: `cd src/orders-intake && pnpm build`, `cd src/dispatch-message-queue && pnpm build`
- [ ] Run `terraform apply` — applies cleanly
- [ ] Smoke-test `/orders` endpoint via API Gateway URL
- [ ] Verify S3 bucket is accessible and unchanged
