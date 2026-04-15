output "api_gateway_url" {
  description = "API Gateway endpoint URL"
  value       = yandex_api_gateway.api_gateway.url
}

output "orders_intake_function_id" {
  description = "Orders intake cloud function ID"
  value       = yandex_function.orders_intake.id
}

output "dispatch_queue_messages_function_id" {
  description = "Dispatch queue messages cloud function ID"
  value       = yandex_function.dispatch_queue_messages.id
}
