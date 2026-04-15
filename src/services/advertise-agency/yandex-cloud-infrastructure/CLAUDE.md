# CLAUDE.md

## Scope
- Work only in this folder
- Do not read, modify, or create files above this folder unless the user explicitly asks

## Infrastructure Build Rules
- See `ai/docs/build-rules.md` for per-project conventions (package.json, tsconfig, eslint, vitest, shared module rules)
- Each function in `src/` is an independent pnpm-managed project targeting Node 20

## Projects

### `src/shared/` — Shared types and utilities
- `logger.ts` — structured JSON logger (`logInfo`, `logWarn`, `logError`)
- `response.ts` — API Gateway response helpers (`badRequest`, `serverError`, `jsonResponse`)
- `types/message.ts` — base `Message` interface
- `types/orderMessage.ts` — `OrderMessage` type + `buildOrderMessage()`
- `types/apiGateway.ts` — API Gateway event/result types

### `src/orders-intake/` — Order submission handler (SQS producer)
- Receives POST with order data + captcha token, validates captcha, enqueues to SQS
- Scripts: `pnpm build` / `pnpm typecheck` / `pnpm lint` / `pnpm test`

### `src/dispatch-message-queue/` — Queue polling/dispatch handler (SQS consumer)
- Polls SQS queue for messages, supports delete-by-receipt-handle
- Scripts: `pnpm build` / `pnpm typecheck` / `pnpm lint` / `pnpm test`
