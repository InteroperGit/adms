resource "yandex_storage_bucket" "content" {
  bucket     = var.storage_content_bucket_name
  max_size   = 53687091200

  anonymous_access_flags {
    read        = true
    list        = true
    config_read = false
  }

  website {
    index_document  = "index.html"
    error_document  = "error.html"
  }

  grant {
    id          = "aje69qneta7pic8eiocj"
    type        = "CanonicalUser"
    permissions = ["FULL_CONTROL"]
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "yandex_storage_bucket" "assets" {
  bucket     = var.storage_assets_bucket_name
  max_size   = 53687091200

  anonymous_access_flags {
    read        = false
    list        = false
    config_read = false
  }

  lifecycle {
    prevent_destroy = true
  }
}

resource "yandex_storage_bucket" "logs" {
  bucket     = var.storage_logs_bucket_name
  max_size   = 53687091200

  anonymous_access_flags {
    read        = false
    list        = false
    config_read = false
  }

  lifecycle {
    prevent_destroy = true
  }
}
