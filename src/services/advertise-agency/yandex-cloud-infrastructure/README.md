# Yandex Cloud Infrastructure

Cloud functions and API Gateway for the advertise agency landing project.

## Structure

```
src/                    # Function source code
  shared/               # Common utilities (logger, types)
  order-form/           # Order form submission function
  captcha-verify/       # SmartCaptcha verification function
gateway/                # API Gateway OpenAPI spec
infra/terraform/        # Terraform IaC configs
scripts/                # Deploy helpers
```

## Local Development

```bash
cd src/order-form
npm install
npm run build
npm test
```

## Deploy

### Via Terraform (recommended)

```bash
cd infra/terraform
terraform init
terraform plan -var-file=../environments/dev.tfvars
terraform apply -var-file=../environments/dev.tfvars
```

### Via CLI scripts

```bash
# Deploy a single function
bash scripts/deploy-function.sh order-form

# Deploy API Gateway
bash scripts/deploy-gateway.sh
```

## Adding a New Function

1. Create `src/<function-name>/` with `src/`, `package.json`, `tsconfig.json`, `__tests__/`
2. Export `handler` from `src/index.ts` matching the `Handler` type from `shared/`
3. Add the function to `gateway/spec.yaml` and `infra/terraform/functions.tf`
4. Run `terraform apply`
