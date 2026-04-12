# Uncomment to use remote state in Yandex Object Storage (S3-compatible)
# terraform {
#   backend "s3" {
#     endpoint   = "storage.yandexcloud.net"
#     bucket     = "terraform-state-bucket"
#     key        = "advertise-agency/terraform.tfstate"
#     region     = "ru-central1"
#     skip_region_validation      = true
#     skip_credentials_validation = true
#     skip_metadata_api_check     = true
#   }
# }
