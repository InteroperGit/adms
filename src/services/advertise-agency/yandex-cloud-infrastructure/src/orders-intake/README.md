# orders-intake

API Gateway handler that receives order submissions, validates Yandex SmartCaptcha, and enqueues structured messages to an SQS queue.

## Role

**SQS Producer** — the entry point for all order data. Validates input, verifies captcha, then hands off to the queue for async processing.

## Architecture

```
[Browser] --POST {captchaToken, order}--> [API Gateway]
                                                    |
                                                    v
                                          orders-intake (handler)
                                          - parse & validate body
                                          - verify captcha via Yandex SmartCaptcha
                                          - build OrderMessage
                                          - send to SQS
                                          - return {messageId}
```

## Source files

| File | Purpose |
|---|---|
| `src/index.ts` | **Lambda handler** — validates request body, captcha token, order object; calls `checkCaptchaAsync`; builds `OrderMessage` via `buildOrderMessage`; sends to SQS; returns 200 with `{messageId}` or 400/500 on error |
| `src/messageQueue.ts` | SQS client wrapper — creates `SQSClient` from env vars, exports `sendMessageToQueueAsync(message)` and re-exports `buildOrderMessage` from shared types |
| `src/smartCaptcha.ts` | Yandex SmartCaptcha verification — POSTs `secret`, `token`, `ip` to `smartcaptcha.cloud.yandex.ru/validate` via `https` module; 5s timeout; resolves `true` only on `{status: "ok"}` |
| `src/utils.ts` | Helpers: `parseBody(event)`, `getCaptchaToken(body)`, `getClientIp(event)` (supports both REST `identity.sourceIp` and HTTP `http.sourceIp`), `getOrder(body)`, `getRequestId(event)` |

## Test files

| File | Tests |
|---|---|
| `src/index.test.ts` | 7 tests — handler validation: invalid JSON, missing captchaToken, missing order, non-object order, failed captcha, success flow, SQS error |
| `src/messageQueue.test.ts` | 4 tests — `sendMessageToQueueAsync` sends correct JSON; `buildOrderMessage` creates structured message with unique ID and ISO timestamp |
| `src/smartCaptcha.test.ts` | 6 tests — ok/fail status, non-200 response, invalid JSON, request error, timeout with destroy |
| `src/utils.test.ts` | 13 tests — parseBody (4), getCaptchaToken (2), getClientIp (4), getOrder (2), getRequestId (3) |

**Total: 30 tests across 4 files**

## Scripts

```bash
pnpm build       # tsc → dist/
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint src
pnpm test        # vitest run
pnpm format      # prettier --write src
```

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `AWS_REGION` | No | — | AWS region (e.g. `ru-central1`) |
| `AWS_ENDPOINT` | No | — | Custom SQS endpoint (for Yandex Cloud) |
| `AWS_ACCESS_KEY_ID` | Yes | — | IAM access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | — | IAM secret key |
| `QUEUE_URL` | Yes | — | SQS queue URL |
| `SMARTCAPTCHA_SERVER_KEY` | Yes | — | Yandex SmartCaptcha server secret |

## Message format

Orders are wrapped into `OrderMessage` (from `src/shared/types/orderMessage.ts`):

```json
{
  "type": "ORDER_SUBMITTED",
  "messageId": "<uuid>",
  "timestamp": "<ISO 8601>",
  "source": "orders-intake",
  "correlationId": "<requestId>",
  "version": "1.0",
  "payload": { "name": "John", "phone": "+79991234567" }
}
```

## Request format

**POST body:**
```json
{
  "captchaToken": "y0_...",
  "order": { "name": "John", "phone": "+79991234567", "message": "Hello" }
}
```

**Success response (200):**
```json
{ "messageId": "<uuid>" }
```

**Error responses (400/500):**
```json
{ "ok": false, "error": "..." }
```

## Validation flow

1. Parse `event.body` as JSON → 400 if invalid
2. Extract `captchaToken` → 400 if missing
3. Extract `order` → 400 if missing or not an object
4. Call `checkCaptchaAsync(token, clientIp)` → 400 if false
5. Build `OrderMessage(order, requestId)`
6. Send to SQS → 500 on error
7. Return 200 with `{messageId}`

## Dependencies

- `@aws-sdk/client-sqs` — SQS client
- Node 20 built-in `https`, `crypto`, `querystring` — no HTTP client dependency

## Shared imports

- `../../shared` — `logInfo`, `logWarn`, `logError`, `badRequest`, `serverError`, `jsonResponse`
- `../../shared/types` — `Message`, `OrderMessage`, `buildOrderMessage`
