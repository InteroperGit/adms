resource "yandex_function" "order_form" {
  name            = "order-form-${var.environment}"
  runtime         = "nodejs22"
  entrypoint      = "index.handler"
  memory          = "128"
  execution_timeout = "5"
  service_account_id = yandex_iam_service_account.function_sa.id

  user_hash = filebase64sha256("${path.module}/../../src/order-form/dist/index.js")
  content {
    zip_filename = "${path.module}/../../src/order-form/dist/index.zip"
  }

  environment = {
    NODE_ENV = var.environment
  }
}

resource "yandex_function" "captcha_verify" {
  name            = "captcha-verify-${var.environment}"
  runtime         = "nodejs22"
  entrypoint      = "index.handler"
  memory          = "128"
  execution_timeout = "5"
  service_account_id = yandex_iam_service_account.function_sa.id

  user_hash = filebase64sha256("${path.module}/../../src/captcha-verify/dist/index.js")
  content {
    zip_filename = "${path.module}/../../src/captcha-verify/dist/index.zip"
  }

  environment = {
    NODE_ENV = var.environment
  }
}
