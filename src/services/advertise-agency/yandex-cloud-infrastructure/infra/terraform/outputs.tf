output "api_gateway_url" {
  description = "API Gateway endpoint URL"
  value       = yandex_api_gateway.api_gateway.url
}

output "order_form_function_id" {
  description = "Order form cloud function ID"
  value       = yandex_function.order_form.id
}

output "captcha_verify_function_id" {
  description = "Captcha verify cloud function ID"
  value       = yandex_function.captcha_verify.id
}
