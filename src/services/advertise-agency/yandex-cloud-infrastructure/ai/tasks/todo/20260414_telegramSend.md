# PDR — Send order notifications to Telegram

Date: 2026-04-14
Status: complete
Scope: `src/dispatch-message-queue`

## Context

The `dispatch-message-queue` function currently processes `ORDER_SUBMITTED` messages by sending an email notification via `sendEmail.ts` (nodemailer). The business requirement is to also deliver order notifications to a Telegram chat (e.g. a team operations channel) so that orders are visible in real-time on mobile devices.

The dispatch handler (`src/index.ts`) already has a clean architecture: `processOrderMessage()` calls `sendOrderEmail()` then deletes the SQS message. Adding Telegram delivery should follow the same pattern — a separate module with its own config, templating, and error handling — without modifying the existing email flow.

## Current findings

- `src/index.ts` — SQS trigger handler; `processOrderMessage()` calls `sendOrderEmail()` then `deleteMessageFromQueueAsync()`
- `src/sendEmail.ts` — reads SMTP config from env vars, uses nodemailer transporter, calls `sendMail()` with subject/html from the templater
- `src/emailTemplater.ts` — `Template` interface with `subject`/`html` functions; `TEMPLATES` map keyed by message type; `buildTemplateContext()` extracts correlationId, timestamp, payload from `OrderMessage`
- `src/messageQueue.ts` — SQS client wrapper (`receiveMessagesFromQueueAsync`, `deleteMessageFromQueueAsync`)
- Only one message type exists: `ORDER_SUBMITTED`
- No Telegram integration exists anywhere in the repository
- Each function is an independent pnpm-managed project targeting Node 20

## Objectives

1. Add a `sendTelegramNotification()` module that sends a formatted message to a Telegram chat via the Telegram Bot API (`POST https://api.telegram.org/bot<token>/sendMessage`).
2. Create a Telegram message templater (separate from email templater) that formats order data into a Telegram MarkdownV2 message.
3. Wire `sendTelegramNotification()` into `processOrderMessage()` alongside `sendOrderEmail()`.
4. Make Telegram delivery non-blocking for email delivery — if Telegram fails, log the error but still proceed to delete the SQS message (and vice versa).
5. Add tests for the new modules.

## Tasks

### T1. Add `node-fetch` dependency (or use built-in `https`)

- [x] Decided on HTTP client: use Node 20 built-in `fetch` (no extra dependency)
- [x] No new `package.json` dependency needed

### T2. Create Telegram sender module

- [x] Created `src/dispatch-message-queue/src/sendTelegram.ts`
- [x] Exported `sendTelegramNotification(message: OrderMessage): Promise<void>`
- [x] Reads config from env vars: `TELEGRAM_BOT_TOKEN` (required), `TELEGRAM_CHAT_ID` (required) — read inside function for test isolation
- [x] Throws if either env var is missing
- [x] Uses built-in `fetch` to call `POST https://api.telegram.org/bot${token}/sendMessage`
- [x] Request body: `{ chat_id, text, parse_mode: 'MarkdownV2' }`
- [x] Logs success/failure with structured logger (`logInfo`/`logError`)
- [x] Re-throws on failure so the caller can decide how to handle it

### T3. Create Telegram message templater

- [x] Created `src/dispatch-message-queue/src/telegramTemplater.ts`
- [x] Defined `TelegramTemplate` interface with `text` function
- [x] Created `TELEGRAM_TEMPLATES` map keyed by message type
- [x] Implemented `ORDER_SUBMITTED` template producing MarkdownV2-formatted text:
  - Header: `\*New order received\*`
  - Payload fields as `\*field:\* value` lines with escaped special characters
  - Footer: monospace correlation ID and escaped timestamp
- [x] Implemented `escapeMarkdownV2(text: string)` helper escaping all reserved characters
- [x] Exported `getTelegramTemplate()`, `registerTelegramTemplate()`, `buildTelegramTemplateContext()`

### T4. Wire Telegram into the dispatch handler

- [x] Updated `src/dispatch-message-queue/src/index.ts`:
  - Imported `sendTelegramNotification` from `./sendTelegram`
  - In `processOrderMessage()`, both `sendOrderEmail()` and `sendTelegramNotification()` are called in independent try/catch blocks
  - Each failure is logged via `logError` with messageId and correlationId
  - If either delivery fails, throws `'One or more notification deliveries failed'` — SQS message is NOT deleted, triggering retry
  - Message is only deleted when both deliveries succeed

### T5. Add tests for sendTelegram

- [x] Created `src/dispatch-message-queue/src/sendTelegram.test.ts`
- [x] Mocks `globalThis.fetch` via `vi.spyOn(globalThis, 'fetch')`
- [x] Test: throws when `TELEGRAM_BOT_TOKEN` is missing
- [x] Test: throws when `TELEGRAM_CHAT_ID` is missing
- [x] Test: calls correct Telegram API URL with correct body
- [x] Test: logs success on `ok: true` response
- [x] Test: throws on `ok: false` response from Telegram API
- [x] Test: throws on network error (fetch rejection)
- [x] Test: throws when no template exists for message type

### T6. Add tests for telegramTemplater

- [x] Created `src/dispatch-message-queue/src/telegramTemplater.test.ts`
- [x] Test `getTelegramTemplate` returns template for `ORDER_SUBMITTED`
- [x] Test `getTelegramTemplate` returns `undefined` for unknown types
- [x] Test `registerTelegramTemplate` adds retrievable template
- [x] Test `escapeMarkdownV2` escapes all reserved characters (3 sub-tests)
- [x] Test `ORDER_SUBMITTED` template text includes header, payload fields, and footer
- [x] Test template handles empty payload gracefully
- [x] Test `buildTelegramTemplateContext` maps message fields correctly
- [x] Test template escapes special characters in payload values

### T7. Update index handler tests

- [x] Updated `src/dispatch-message-queue/src/index.test.ts`
- [x] Added mock for `sendTelegramNotification` alongside existing `sendOrderEmail` mock
- [x] Test that both notifications are called for `ORDER_SUBMITTED` message
- [x] Test: throws when email fails but telegram succeeds
- [x] Test: throws when telegram fails but email succeeds
- [x] Test: throws when both email and telegram fail
- [x] Updated multiple records test to verify both notifications called per record
- [x] Full suite: `pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build` — all clean

## Critical files

- `src/dispatch-message-queue/src/sendTelegram.ts` (new)
- `src/dispatch-message-queue/src/sendTelegram.test.ts` (new)
- `src/dispatch-message-queue/src/telegramTemplater.ts` (new)
- `src/dispatch-message-queue/src/telegramTemplater.test.ts` (new)
- `src/dispatch-message-queue/src/index.ts` (modify — wire in Telegram)
- `src/dispatch-message-queue/src/index.test.ts` (modify — add Telegram mocks)
- `src/shared/types/orderMessage.ts` (reference — no changes expected)

## Verification

- [x] All existing tests still pass (58 tests total: 13 templater + 10 email templater + 9 sendEmail + 8 index + 6 sendTelegram + 5 messageQueue + 7 utils)
- [x] New sendTelegram tests pass (6 tests)
- [x] New telegramTemplater tests pass (13 tests)
- [x] Updated index handler tests pass (8 tests, up from 6)
- [x] `pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build` all clean
- [x] `sendTelegramNotification` correctly calls Telegram Bot API with MarkdownV2 formatting
- [x] `escapeMarkdownV2` handles all reserved characters
- [x] Failure in one notification channel does not silently swallow errors — throws for SQS retry
- [x] SQS message is only deleted when both deliveries succeed
