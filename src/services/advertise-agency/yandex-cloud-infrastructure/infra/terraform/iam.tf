resource "yandex_iam_service_account" "function_sa" {
  name        = "function-sa"
  description = "Service account for cloud functions"
}

# Allow API Gateway to invoke functions
resource "yandex_resourcemanager_folder_iam_member" "function_sa_invoker" {
  folder_id = var.folder_id
  role      = "functions.functionInvoker"
  member    = "serviceAccount:${yandex_iam_service_account.function_sa.id}"
}

# Allow service account to manage functions (deploy versions, update config)
resource "yandex_resourcemanager_folder_iam_member" "function_sa_admin" {
  folder_id = var.folder_id
  role      = "serverless.functions.admin"
  member    = "serviceAccount:${yandex_iam_service_account.function_sa.id}"
}

# Allow service account to manage Object Storage (S3) buckets
resource "yandex_resourcemanager_folder_iam_member" "function_sa_storage" {
  folder_id = var.folder_id
  role      = "storage.admin"
  member    = "serviceAccount:${yandex_iam_service_account.function_sa.id}"
}

# Allow service account to manage Message Queue (SQS)
resource "yandex_resourcemanager_folder_iam_member" "function_sa_mq" {
  folder_id = var.folder_id
  role      = "ymq.admin"
  member    = "serviceAccount:${yandex_iam_service_account.function_sa.id}"
}
