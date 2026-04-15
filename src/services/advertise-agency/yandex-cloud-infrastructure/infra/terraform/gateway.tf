locals {
  api_gateway_url = "https://${yandex_api_gateway.api_gateway.id}.apigw.yandexcloud.net"
}

resource "yandex_api_gateway" "api_gateway" {
  name        = "agency-api-gateway-${var.environment}"
  description = "API Gateway for advertise agency backend"

  spec = templatefile(
    "${path.module}/../../gateway/spec.yaml.tpl",
    {
      api_gateway_url            = local.api_gateway_url
      orders_intake_function_id  = yandex_function.orders_intake.id
      service_account_id         = yandex_iam_service_account.function_sa.id
    }
  )

  dynamic "custom_domains" {
    for_each = var.api_gateway_custom_domain != "" ? [1] : []
    content {
      fqdn = var.api_gateway_custom_domain
    }
  }
}
