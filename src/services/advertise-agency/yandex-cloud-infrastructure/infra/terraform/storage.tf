resource "yandex_storage_bucket" "main" {
  bucket = var.storage_bucket_name

  # Do NOT manage ACL — bucket already exists with its own ACL.
  # Import existing bucket before first apply:
  #   terraform import yandex_storage_bucket.main <bucket-name>

  lifecycle {
    prevent_destroy = true
  }
}
