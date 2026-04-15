output "api_gateway_url" {
  description = "API Gateway endpoint URL"
  value       = "https://${yandex_api_gateway.api_gateway.domain}"
}

output "orders_intake_function_id" {
  description = "Orders intake cloud function ID"
  value       = yandex_function.orders_intake.id
}

output "dispatch_message_queue_function_id" {
  description = "Dispatch message queue cloud function ID"
  value       = yandex_function.dispatch_message_queue.id
}
