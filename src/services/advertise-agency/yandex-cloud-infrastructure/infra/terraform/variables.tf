variable "folder_id" {
  description = "Yandex Cloud folder ID"
  type        = string
}

variable "zone" {
  description = "Yandex Cloud zone"
  type        = string
  default     = "ru-central1-a"
}

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
  default     = "dev"
}

# --- Shared function settings ---

variable "function_runtime" {
  description = "Node.js runtime version for cloud functions"
  type        = string
  default     = "nodejs22"
}

variable "function_memory" {
  description = "Memory allocation for cloud functions (MB)"
  type        = number
  default     = 128
}

variable "function_timeout" {
  description = "Execution timeout for cloud functions (seconds)"
  type        = number
  default     = 5
}

# --- AWS / SQS credentials ---

variable "aws_access_key_id" {
  description = "AWS access key ID for Yandex Message Queue"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS secret access key for Yandex Message Queue"
  type        = string
  sensitive   = true
}

variable "queue_url" {
  description = "Yandex Message Queue URL"
  type        = string
}

# --- SmartCaptcha ---

variable "smartcaptcha_server_key" {
  description = "Yandex SmartCaptcha server key"
  type        = string
  sensitive   = true
}

# --- Email (dispatch-message-queue) ---

variable "smtp_user" {
  description = "SMTP username for email notifications"
  type        = string
  sensitive   = true
}

variable "smtp_password" {
  description = "SMTP password for email notifications"
  type        = string
  sensitive   = true
}

# --- Telegram (dispatch-message-queue) ---

variable "telegram_bot_token" {
  description = "Telegram Bot API token"
  type        = string
  sensitive   = true
}

variable "telegram_chat_id" {
  description = "Telegram chat ID for notifications (comma-separated for multiple)"
  type        = string
  sensitive   = true
}
