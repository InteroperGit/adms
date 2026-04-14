# dispatch-message-queue

SQS consumer that processes queued messages. Handles `ORDER_SUBMITTED` messages by sending email notifications via nodemailer and Telegram notifications via the Telegram Bot API, both using a templater system for extensibility.

## Role

**SQS Consumer** — triggered by SQS (or polled manually). Parses messages, dispatches by type, sends notifications (email + Telegram), then deletes processed messages from the queue.

## Architecture

```
[SQS Queue] --SQS trigger--> dispatch-message-queue (handler)
                              - parse message body JSON
                              - switch on message.type
                              - ORDER_SUBMITTED:
                                  → sendOrderEmail() via nodemailer
                                  → sendTelegramNotification() via Telegram Bot API
                                  → deleteMessageFromQueueAsync() (only if both succeed)
                              - unknown type: log warning, skip
                              - error: re-throw (triggers SQS retry)
                                                    |
                                        ┌───────────┴───────────┐
                                        v                       v
                                  [SMTP Server]          [Telegram Bot API]
```

## Source files

| File | Purpose |
|---|---|
| `src/handler/index.ts` | **Lambda handler** — receives `SQSEvent` with `Records[]`; parses each `record.body` as `Message`; dispatches by `message.type` via `dispatchMessage()`; `processOrderMessage()` calls `sendOrderEmail()` and `sendTelegramNotification()` in independent try/catch blocks; deletes message only if both succeed; re-throws on error for SQS retry |
| `src/queue/messageQueue.ts` | SQS client wrapper — creates `SQSClient` from env vars; exports `receiveMessagesFromQueueAsync(maxMessages)` (returns parsed `Message[]` with `_receiptHandle`) and `deleteMessageFromQueueAsync(receiptHandle)` |
| `src/senders/email/sendEmail.ts` | Email sender — reads SMTP config from env vars; creates nodemailer transporter; calls `verify()` + `sendMail()`; resolves subject/HTML from `emailTemplater` via `getTemplate()` + `buildTemplateContext()` |
| `src/senders/email/emailTemplater.ts` | Email template registry — `Template` interface (`subject`/`html` functions); `TEMPLATES` map keyed by message type; `ORDER_SUBMITTED` template renders HTML table with payload fields; reads strings from `templateConfig`; exports `getTemplate()`, `registerTemplate()`, `buildTemplateContext()` |
| `src/senders/telegram/sendTelegram.ts` | Telegram sender — reads `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` from env vars; uses built-in `fetch` to POST to Telegram Bot API `/sendMessage` with `MarkdownV2` to multiple chat IDs in parallel; resolves text from `telegramTemplater`; logs success/failure; throws only if all deliveries fail |
| `src/senders/telegram/telegramTemplater.ts` | Telegram template registry — `TelegramTemplate` interface (`text` function); `TELEGRAM_TEMPLATES` map keyed by message type; `ORDER_SUBMITTED` template produces MarkdownV2 text with bold header, escaped payload fields, monospace footer; reads strings from `templateConfig`; exports `escapeMarkdownV2()`, `getTelegramTemplate()`, `registerTelegramTemplate()`, `buildTelegramTemplateContext()` |
| `src/config/templateConfig.ts` | Centralized template string config — reads all user-facing strings from JSON config files; exports `getEmailTemplateConfig()` and `getTelegramTemplateConfig()` |

## Test files

| File | Tests |
|---|---|
| `src/index.test.ts` | 8 tests — empty records, valid ORDER_SUBMITTED (both email+Telegram), unknown type skip, invalid JSON skip, email fails/telegram succeeds, telegram fails/email succeeds, both fail, multiple records |
| `src/sendEmail.test.ts` | 9 tests — transport config, missing SMTP_USER/PASSWORD, custom env values, port 465 secure, verify failure, sendMail failure, unknown template type, EMAIL_FROM/TO overrides |
| `src/sendTelegram.test.ts` | 10 tests — missing TELEGRAM_BOT_TOKEN, missing TELEGRAM_CHAT_ID, correct API URL/body, ok:false response, network error, unknown template type, multiple chat IDs, partial success, all multiple fail, whitespace trimming |
| `src/emailTemplater.test.ts` | 10 tests — getTemplate for known/unknown types, registerTemplate add/override, buildTemplateContext, ORDER_SUBMITTED subject/html/footer/empty payload/many fields |
| `src/telegramTemplater.test.ts` | 13 tests — escapeMarkdownV2 (3), getTemplate (2), registerTelegramTemplate (2), buildTelegramTemplateContext (1), ORDER_SUBMITTED template (5) |
| `src/messageQueue.test.ts` | 5 tests — receiveMessagesFromQueueAsync (correct QueueUrl, parsed messages, invalid JSON fallback, empty response), deleteMessageFromQueueAsync (correct ReceiptHandle) |

**Total: 51 tests across 6 files**

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
| `AWS_REGION` | No | `ru-central1` | AWS region |
| `AWS_ENDPOINT` | No | — | Custom SQS endpoint |
| `AWS_ACCESS_KEY_ID` | Yes | — | IAM access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | — | IAM secret key |
| `QUEUE_URL` | Yes | — | SQS queue URL |
| `SMTP_HOST` | No | `smtp.yandex.ru` | SMTP server host |
| `SMTP_PORT` | No | `465` | SMTP port (465 = secure) |
| `SMTP_USER` | Yes | — | SMTP username |
| `SMTP_PASSWORD` | Yes | — | SMTP password |
| `EMAIL_FROM` | No | `SMTP_USER` | Sender email |
| `EMAIL_TO` | No | `SMTP_USER` | Recipient email |
| `EMAIL_ENABLED` | No | `true` | Set to `false` to disable email notifications |
| `TELEGRAM_BOT_TOKEN` | Yes | — | Telegram bot token (from @BotFather) |
| `TELEGRAM_CHAT_ID` | Yes | — | Target chat/channel ID |
| `TELEGRAM_ENABLED` | No | `true` | Set to `false` to disable telegram notifications |

### Template configuration

Template defaults live in JSON config files. All values can be overridden via env vars at runtime (env takes precedence).

**Config files:**
- `src/email-template-config.json` — email subject, labels, and inline styles
- `src/telegram-template-config.json` — telegram header text and footer separator

**Env var override pattern:** `PREFIX_KEY` where `PREFIX` is `EMAIL` or `TELEGRAM` and `KEY` is the camelCase config key uppercased (e.g. `wrapperStyle` → `EMAIL_WRAPPER_STYLE`).

| Env var | Default (from JSON) | Description |
|---|---|---|
| `EMAIL_SUBJECT` | `New order — {correlationId}` | Email subject line |
| `EMAIL_HEADER` | `New order received` | Email `<h2>` text |
| `EMAIL_FOOTER_CORRELATION_LABEL` | `Correlation ID` | Footer label for correlation ID |
| `EMAIL_FOOTER_TIMESTAMP_LABEL` | `Received at` | Footer label for timestamp |
| `EMAIL_WRAPPER_STYLE` | `font-family: sans-serif; max-width: 600px; color: #222;` | Outer `<div>` styles |
| `EMAIL_HEADER_STYLE` | `margin: 0 0 16px; font-size: 20px;` | `<h2>` styles |
| `EMAIL_TABLE_STYLE` | `border-collapse: collapse; width: 100%;` | `<table>` styles |
| `EMAIL_KEY_CELL_STYLE` | `padding: 6px 12px 6px 0; font-weight: 600; color: #555; ...` | Key `<td>` styles |
| `EMAIL_VALUE_CELL_STYLE` | `padding: 6px 0; color: #222; vertical-align: top;` | Value `<td>` styles |
| `EMAIL_DIVIDER_STYLE` | `border: none; border-top: 1px solid #eee; margin: 20px 0;` | `<hr>` styles |
| `EMAIL_FOOTER_STYLE` | `margin: 0; font-size: 12px; color: #999;` | Footer `<p>` styles |
| `TELEGRAM_HEADER` | `New order received` | Telegram message header |
| `TELEGRAM_FOOTER_SEPARATOR` | ` \| ` | Footer separator |

## Message format

Consumes `Message` from SQS (base interface from `src/shared/types/message.ts`):

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

## Template systems

### Email templates

Email templates are registered in `emailTemplater.ts` via a `Map<string, Template>`:

```ts
interface Template {
  subject: (context: TemplateContext) => string;
  html: (context: TemplateContext) => string;
}

interface TemplateContext {
  correlationId: string;
  timestamp: string;
  payload: Record<string, string>;
}
```

Currently registered templates:
- `ORDER_SUBMITTED` — subject: `New order — {correlationId}`, HTML: table with payload fields + footer

Extensibility: call `registerTemplate(type, template)` to add new message types.

### Telegram templates

Telegram templates are registered in `telegramTemplater.ts` via a `Map<string, TelegramTemplate>`:

```ts
interface TelegramTemplate {
  text: (context: TelegramTemplateContext) => string;
}
```

Currently registered templates:
- `ORDER_SUBMITTED` — MarkdownV2 text with bold header, escaped payload fields, monospace correlation ID + timestamp footer

Extensibility: call `registerTelegramTemplate(type, template)` to add new message types.

The `escapeMarkdownV2(text)` helper escapes all reserved Telegram MarkdownV2 characters: `_`, `*`, `[`, `]`, `(`, `)`, `~`, `` ` ``, `>`, `#`, `+`, `-`, `=`, `|`, `{`, `}`, `.`, `!`.

## Processing flow

1. Receive `SQSEvent` with `Records[]`
2. For each record:
   a. Parse `record.body` as JSON → skip with warning if invalid
   b. Call `dispatchMessage(message, receiptHandle)`:
      - `ORDER_SUBMITTED` → `processOrderMessage()`:
        1. `sendOrderEmail()` — try/catch, log error on failure
        2. `sendTelegramNotification()` — try/catch, log error on failure
        3. If either failed → throw (SQS redelivers, message NOT deleted)
        4. If both succeeded → `deleteMessageFromQueueAsync()`
      - Unknown type → log warning, skip (message NOT deleted, will retry)
   c. On error → re-throw (SQS redelivers)

## Dependencies

- `@aws-sdk/client-sqs` — SQS client
- `nodemailer` — email transport
- Node 20 built-in `fetch` — Telegram API calls (no extra dependency)

## Shared imports

- `../../shared` — `logInfo`, `logWarn`, `logError`
- `../../shared/types` — `Message`, `OrderMessage`
