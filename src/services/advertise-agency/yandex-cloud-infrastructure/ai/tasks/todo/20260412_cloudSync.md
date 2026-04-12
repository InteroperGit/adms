# PDR — Cloud infrastructure synchronization

Date: 2026-04-12
Status: planned
Scope: `yandex-cloud-infrastructure`

## Context
This repository currently defines a small Yandex Cloud backend for the advertise-agency project: two Cloud Functions and one API Gateway. The repo is not yet fully synchronized with deployable infrastructure because the gateway spec contains unresolved placeholders, the custom domain is still a placeholder, the functions only receive `NODE_ENV`, and both handlers are still stubs.

Goal: make this folder the source of truth for the current Yandex Cloud setup so that Terraform state, gateway routing, function configuration, and runtime contracts all match.

## Current findings
- API Gateway routes exist in `gateway/spec.yaml`:
  - `POST /order-form`
  - `POST /captcha-verify`
- `gateway/spec.yaml` still uses placeholders for:
  - `ORDER_FORM_FUNCTION_ID`
  - `CAPTCHA_VERIFY_FUNCTION_ID`
  - `SERVICE_ACCOUNT_ID`
- `infra/terraform/gateway.tf` currently loads the spec via raw `file(...)`, so those placeholders are not synchronized automatically.
- `infra/terraform/functions.tf` defines two Yandex Cloud Functions:
  - `order-form-${var.environment}`
  - `captcha-verify-${var.environment}`
- Function runtime config is incomplete: only `NODE_ENV` is passed.
- `src/order-form/src/index.ts` and `src/captcha-verify/src/index.ts` are still stub implementations.
- `infra/environments/dev.tfvars` and `infra/environments/prod.tfvars` still contain placeholder `folder_id` values.
- `infra/terraform/outputs.tf` exposes the key deployed values:
  - `api_gateway_url`
  - `order_form_function_id`
  - `captcha_verify_function_id`

## Objectives
1. Make Terraform the single authoritative deployment path for this folder.
2. Synchronize API Gateway wiring with actual Terraform-managed resource IDs.
3. Make environment-specific infrastructure settings explicit and configurable.
4. Align runtime function configuration with real handler needs.
5. Align gateway contract and handler behavior.
6. Support adoption/import of already-existing Yandex Cloud resources.
7. Document a repeatable sync workflow.

## Tasks

### T1. Render API Gateway spec from Terraform
- [ ] Replace raw `file(...)` usage in `infra/terraform/gateway.tf` with a rendered/template-based approach.
- [ ] Inject actual Terraform-managed values into the gateway spec:
  - `yandex_function.order_form.id`
  - `yandex_function.captcha_verify.id`
  - `yandex_iam_service_account.function_sa.id`
- [ ] Keep `gateway/spec.yaml` as the API contract/template.

### T2. Make custom domain configurable
- [ ] Replace hardcoded `api.${var.environment}.example.com` in `infra/terraform/gateway.tf` with variable-driven config.
- [ ] Make custom domain optional so local/dev sync can work before DNS and certificates are finalized.

### T3. Expand Terraform variables
- [ ] Extend `infra/terraform/variables.tf` beyond `folder_id`, `zone`, and `environment`.
- [ ] Add app-facing settings that must remain synchronized, including:
  - [ ] API custom domain / FQDN
  - [ ] allowed origins if browser clients call the gateway directly
  - [ ] SmartCaptcha configuration
  - [ ] order-form downstream integration settings
  - [ ] optional log/debug settings
- [ ] Populate `infra/environments/dev.tfvars` and `infra/environments/prod.tfvars` with real values/placeholders that reflect the intended environment contract.

### T4. Synchronize function runtime config
- [ ] Extend `environment` blocks in `infra/terraform/functions.tf` so the functions receive the runtime config they actually need.
- [ ] Keep reusing existing shared helpers instead of introducing parallel patterns:
  - `src/shared/types.ts:17` — `Handler`
  - `src/shared/types.ts:22` — `jsonResponse(...)`
  - `src/shared/logger.ts:1` — `log(...)`

### T5. Align API contract with handlers
- [ ] Tighten `gateway/spec.yaml` to match the actual request/response contract used by the handlers.
- [ ] Mark required fields for `/order-form` explicitly.
- [ ] Keep `/captcha-verify` requiring `token`.
- [ ] Define consistent success/error response shapes.
- [ ] Decide whether captcha remains a separate endpoint or becomes part of the `order-form` flow; keep gateway and handlers aligned with that choice.

### T6. Replace handler stubs with deployable logic
- [ ] Update `src/order-form/src/index.ts` to validate payload and process submission workflow.
- [ ] Update `src/captcha-verify/src/index.ts` to validate token input and integrate with SmartCaptcha verification.
- [ ] Keep response format consistent with `jsonResponse(...)`.

### T7. Support synchronization with existing YC resources
- [ ] If live resources already exist, avoid blind recreation.
- [ ] Make Terraform config match the intended live resource shape first.
- [ ] Import existing resources into Terraform state:
  - [ ] service account
  - [ ] order-form function
  - [ ] captcha-verify function
  - [ ] API gateway
- [ ] Run `terraform plan` and reduce drift until only intentional changes remain.

### T8. Improve outputs and documentation
- [ ] Extend `infra/terraform/outputs.tf` so deployed values are easier to compare with actual YC state.
- [ ] Update `README.md` to describe two supported sync workflows:
  - [ ] adopt/import existing infrastructure
  - [ ] create/recreate infrastructure from this repo
- [ ] Document required build artifacts expected by Terraform:
  - `src/order-form/dist/index.js`
  - `src/order-form/dist/index.zip`
  - `src/captcha-verify/dist/index.js`
  - `src/captcha-verify/dist/index.zip`
- [ ] Clarify whether `scripts/deploy-function.sh` and `scripts/deploy-gateway.sh` are deprecated or must be realigned to Terraform-first workflow.

## Critical files
- `infra/terraform/gateway.tf`
- `gateway/spec.yaml`
- `infra/terraform/functions.tf`
- `infra/terraform/variables.tf`
- `infra/terraform/iam.tf`
- `infra/terraform/outputs.tf`
- `infra/environments/dev.tfvars`
- `infra/environments/prod.tfvars`
- `src/order-form/src/index.ts`
- `src/captcha-verify/src/index.ts`
- `README.md`

## Verification
- [ ] Build both functions so the artifacts referenced by Terraform exist.
- [ ] Run `terraform plan` for the target environment.
- [ ] Confirm the gateway uses resolved function/service-account IDs instead of raw placeholders.
- [ ] If synchronizing existing live infrastructure, import existing resources before apply.
- [ ] Run `terraform apply` for the target environment.
- [ ] Verify `infra/terraform/outputs.tf` values, especially gateway URL and function IDs.
- [ ] Smoke-test deployed endpoints:
  - [ ] `POST /captcha-verify` with missing/invalid/valid token cases
  - [ ] `POST /order-form` with invalid/valid payloads
- [ ] Run `terraform plan` again; synchronization is complete only when there is no unexpected drift.
