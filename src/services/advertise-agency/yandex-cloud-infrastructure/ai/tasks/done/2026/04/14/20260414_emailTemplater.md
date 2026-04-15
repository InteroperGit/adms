# PDR — Email templater for dispatch-message-queue

Date: 2026-04-14
Status: complete
Scope: `src/dispatch-message-queue`

## Context

The `dispatch-message-queue` function currently sends order notification emails via `src/sendEmail.ts`. The HTML is built inline with string concatenation in `buildOrderEmailHtml()`, which hardcodes styles, layout, and content structure. As more message types are added (e.g. order confirmation to the customer, admin alerts, error notifications), this approach will become unmaintainable.

Goal: extract a reusable email templater that separates template definitions from the sending logic, supports multiple message types, and keeps HTML/CSS email-friendly (inline styles, table-based layout).

## Current findings

- `src/sendEmail.ts` exports `sendOrderEmail(message: OrderMessage)` which:
  - Reads SMTP config from env vars via `getConfig()`
  - Creates a nodemailer transporter and calls `verify()` + `sendMail()`
  - Builds HTML inline via `buildOrderEmailHtml()` — a single function that maps payload keys to table rows
- `src/sendEmail.test.ts` — 12 tests covering config validation, transport setup, error handling, and HTML rendering
- Only one message type exists today: `ORDER_SUBMITTED`
- Shared types in `src/shared/types/message.ts` define base `Message` interface
- `src/shared/types/orderMessage.ts` defines `OrderMessage` with typed payload

## Objectives

1. Extract email templates into a separate module so HTML structure is not embedded in the sender.
2. Support multiple message types with a type-to-template mapping.
3. Keep the existing `sendOrderEmail` public API intact.
4. Maintain email compatibility (inline styles, no external CSS, table layout).
5. Add tests for the templater module.

## Tasks

### T1. Create email templater module

- [x] Create `src/dispatch-message-queue/src/emailTemplater.ts`
- [x] Define a `Template` interface:
  ```ts
  interface Template {
    subject: (context: Record<string, string>) => string;
    html: (context: Record<string, string>) => string;
  }
  ```
- [x] Create a `TEMPLATES` registry keyed by message type (e.g. `ORDER_SUBMITTED`)
- [x] Move the current `buildOrderEmailHtml` logic into the `ORDER_SUBMITTED` template's `html` function
- [x] Move the subject line logic (`New order — ${correlationId}`) into the template's `subject` function
- [x] Export a `getTemplate(type: string): Template | undefined` function
- [x] Export a `registerTemplate(type: string, template: Template): void` function for extensibility

### T2. Refactor sendEmail.ts to use the templater

- [x] Update `sendOrderEmail()` to resolve the template via `getTemplate(message.type)`
- [x] Throw if no template is found for the given message type
- [x] Build subject and HTML from the template using message metadata + payload as context
- [x] Remove `buildOrderEmailHtml` from `sendEmail.ts`
- [x] Keep `getConfig()` and the nodemailer transport/send logic unchanged

### T3. Add tests for the templater

- [x] Create `src/dispatch-message-queue/src/emailTemplater.test.ts`
- [x] Test `getTemplate` returns the correct template for known types
- [x] Test `getTemplate` returns `undefined` for unknown types
- [x] Test `registerTemplate` adds a new template that `getTemplate` can retrieve
- [x] Test the `ORDER_SUBMITTED` template's `subject` function includes correlation ID
- [x] Test the `ORDER_SUBMITTED` template's `html` function renders payload fields as table rows
- [x] Test the `ORDER_SUBMITTED` template's `html` includes correlation ID and timestamp in footer
- [x] Test the `ORDER_SUBMITTED` template's `html` handles empty payload gracefully

### T4. Update existing sendEmail tests

- [x] Remove HTML rendering assertions from `sendEmail.test.ts` that duplicate templater tests
- [x] Keep transport/config/error tests in `sendEmail.test.ts`
- [x] Add a test in `sendEmail.test.ts` that verifies `sendOrderEmail` throws when no template exists for a message type
- [x] Run full suite: `pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build`

## Critical files

- `src/dispatch-message-queue/src/emailTemplater.ts` (new)
- `src/dispatch-message-queue/src/emailTemplater.test.ts` (new)
- `src/dispatch-message-queue/src/sendEmail.ts`
- `src/dispatch-message-queue/src/sendEmail.test.ts`
- `src/shared/types/orderMessage.ts`

## Verification

- [x] All existing tests still pass (37 tests in dispatch-message-queue: 10 templater + 9 sendEmail + 6 index + 5 messageQueue + 7 utils)
- [x] New templater tests pass
- [x] `pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build` all clean
- [x] `sendOrderEmail` still works end-to-end with the `ORDER_SUBMITTED` template
- [x] Unknown message types produce a clear error
