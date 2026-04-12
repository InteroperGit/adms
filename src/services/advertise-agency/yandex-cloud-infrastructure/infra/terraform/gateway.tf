resource "yandex_api_gateway" "api_gateway" {
  name        = "agency-api-gateway-${var.environment}"
  description = "API Gateway for advertise agency backend"

  spec = file("${path.module}/../../gateway/spec.yaml")

  custom_domains {
    fqdn = "api.${var.environment}.example.com"
  }
}
