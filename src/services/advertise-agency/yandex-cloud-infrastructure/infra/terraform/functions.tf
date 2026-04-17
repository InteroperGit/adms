resource "yandex_function" "orders_intake" {
  name               = "orders-intake"
  description        = "Прием и обработка данных с форм заказов с сайта"
  runtime            = var.function_runtime
  entrypoint         = "index.handler"
  memory             = var.function_memory
  execution_timeout  = var.function_timeout
  service_account_id = yandex_iam_service_account.function_sa.id

  user_hash = filebase64sha256("${path.module}/../../src/orders-intake/dist/index.zip")
  content {
    zip_filename = "${path.module}/../../src/orders-intake/dist/index.zip"
  }

  environment = {
    NODE_ENV                = var.environment
    AWS_ACCESS_KEY_ID       = var.aws_access_key_id
    AWS_SECRET_ACCESS_KEY   = var.aws_secret_access_key
    QUEUE_URL               = var.queue_url
    SMARTCAPTCHA_SERVER_KEY = var.smartcaptcha_server_key
  }
}

resource "yandex_function" "dispatch_message_queue" {
  name               = "dispatch-message-queue"
  description        = "Обработка очереди сообщений: отправка уведомлений по email и в Telegram"
  runtime            = var.function_runtime
  entrypoint         = "dispatch-message-queue/src/handler/index.handler"
  memory             = var.function_memory
  execution_timeout  = var.function_timeout
  service_account_id = yandex_iam_service_account.function_sa.id

  user_hash = filebase64sha256("${path.module}/../../src/dispatch-message-queue/dist/index.zip")
  content {
    zip_filename = "${path.module}/../../src/dispatch-message-queue/dist/index.zip"
  }

  environment = {
    NODE_ENV              = var.environment
    AWS_ACCESS_KEY_ID     = var.aws_access_key_id
    AWS_SECRET_ACCESS_KEY = var.aws_secret_access_key
    QUEUE_URL             = var.queue_url
    SMTP_USER             = var.smtp_user
    SMTP_PASSWORD         = var.smtp_password
    TELEGRAM_BOT_TOKEN    = var.telegram_bot_token
    TELEGRAM_CHAT_ID      = var.telegram_chat_id
  }
}

# NOTE: yandex_serverless_event_trigger is NOT supported by the Terraform provider.
# The trigger is created via YC CLI. See scripts/create-trigger.sh
