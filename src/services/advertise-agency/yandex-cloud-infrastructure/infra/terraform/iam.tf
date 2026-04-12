resource "yandex_iam_service_account" "function_sa" {
  name        = "function-sa-${var.environment}"
  description = "Service account for cloud functions"
}

resource "yandex_resourcemanager_folder_iam_member" "function_sa_invoker" {
  folder_id = var.folder_id
  role      = "functions.functionInvoker"
  member    = "serviceAccount:${yandex_iam_service_account.function_sa.id}"
}
