resource "yandex_api_gateway" "api_gateway" {
  name        = "rmaster-api-gateway"
  description = "API Gateway for Reklamaster backend"

  spec = templatefile(
    "${path.module}/../../gateway/spec.yaml.tpl",
    {
      orders_intake_function_id = yandex_function.orders_intake.id
      service_account_id        = yandex_iam_service_account.function_sa.id
    }
  )
}
