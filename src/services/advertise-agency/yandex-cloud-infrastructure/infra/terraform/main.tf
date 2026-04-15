terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.130.0"
    }
  }
}

# Authentication priority:
# 1. yc_service_account_key_file (service account key JSON)
# 2. yc_token (OAuth/IAM token)
# 3. yc CLI profile (default — requires `yc init`)
provider "yandex" {
  cloud_id  = var.cloud_id
  zone      = var.zone
  folder_id = var.folder_id
  token     = var.yc_token
}
