terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.130.0"
    }
  }
}

provider "yandex" {
  zone     = var.zone
  folder_id = var.folder_id
}
