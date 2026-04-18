# PDR — Update OrderMessage with consent record and structured payload

Date: 2026-04-18
Status: done
Scope: `src/shared`, `src/orders-intake`, `src/dispatch-message-queue`, `gateway/`

## Context

The landing app now collects a structured consent record alongside every order submission. The current cloud infrastructure accepts a flat `{ order, captchaToken }` request body, puts `order` directly into `Message.payload`, and forwards it through SQS to the dispatch function. The new contract from the landing app sends:

```ts
{
  order: Record<string, string | boolean> & { productType: string },
  consent: OrderConsentRecord,
  captchaToken: string,
}
```

The consent record captures GDPR-style proof of acceptance (timestamp, document links with versions, user agent, screen resolution, etc.). This data must flow through the entire pipeline — from API Gateway validation → orders-intake → SQS → dispatch — so that notification templates can include `productType` and consent metadata is stored with the message.

## Current findings

- `Message` interface has `payload: Record<string, unknown>` — generic bag
- `OrderMessage` extends `Message` with `type: 'ORDER_SUBMITTED'`, no consent field
- `buildOrderMessage(order, correlationId)` puts `order` directly into `payload`
- `orders-intake/src/index.ts` validates: JSON body parse, `captchaToken` exists, `order` exists and is object — no consent validation
- `orders-intake/src/utils.ts` has `getOrder(body)` and `getCaptchaToken(body)` extractors — no consent extractor
- API Gateway spec (`gateway/spec.yaml`) schema `OrderRequest` requires `order` (object) + `captchaToken` (string), `additionalProperties: false` — consent would be rejected
- Email/Telegram templaters cast `message.payload as Record<string, string>` and iterate `Object.entries()` for rendering — they assume flat key-value payload
- `MESSAGE_VERSION` is `'1.0'`
- `processOrderMessage.ts` passes the full `OrderMessage` to senders, which extract payload internally

## Objectives

1. Add `OrderConsentLink`, `OrderConsentRecord`, and `OrderSubmissionPayload` interfaces to shared types so both cloud functions share the contract.
2. Add a `consent` field to `OrderMessage` so consent data travels through SQS alongside the order payload.
3. Update `buildOrderMessage` to accept consent and include it in the message.
4. Update orders-intake validation to require and validate the `consent` object.
5. Update the API Gateway OpenAPI spec to accept the new `consent` object in the request schema.
6. Update dispatch-side templaters to handle `productType` (and optionally render consent metadata).
7. Bump `MESSAGE_VERSION` to `'2.0'`.
8. Update all tests to cover the new structure.

## Tasks

### T1. Add consent types to shared

- [x] Add to `src/shared/src/types/orderMessage.ts`:
  - `OrderConsentLink` interface: `label: string`, `href: string`, `version?: string`, `effectiveDate?: string`
  - `OrderConsentRecord` interface: `acceptedAt: string`, `text: string`, `links: OrderConsentLink[]`, `userAgent: string`, `language: string`, `timezone: string`, `screenResolution: string`, `referrer: string | null`
  - `OrderSubmissionPayload` interface: `order: Record<string, string | boolean> & { productType: string }`, `consent: OrderConsentRecord`, `captchaToken: string`
- [x] Add `consent: OrderConsentRecord` field to `OrderMessage` interface
- [x] Update `buildOrderMessage` signature to `(order: Record<string, unknown>, consent: OrderConsentRecord, correlationId: string)`
- [x] Set `consent` on the returned message object
- [x] Bump `MESSAGE_VERSION` from `'1.0'` to `'2.0'`
- [x] Re-export new types from `src/shared/src/types/index.ts`
- [x] Run `npm run build` in `src/shared/` to verify

### T2. Update API Gateway spec

- [x] Update `gateway/spec.yaml` `OrderRequest` schema:
  - Add `consent` to `required` array (now: `order`, `captchaToken`, `consent`)
  - Add `consent` property as object with required fields matching `OrderConsentRecord`
  - Add nested `links` as array of objects matching `OrderConsentLink`
  - Keep `additionalProperties: false` on `OrderRequest`
  - Use `additionalProperties: true` on `consent` and `order` for forward compat
- [x] Update `order` property to note `productType` is required:
  - Add `required: [productType]` to the order schema
  - Add `productType: { type: string }` as an explicit property

### T3. Update orders-intake validation

- [x] Add `getConsent(body)` extractor to `src/orders-intake/src/utils.ts`
- [x] Update `src/orders-intake/src/index.ts`:
  - Extract consent from body via `getConsent(body)`
  - Validate consent exists and is an object (return 400 if missing)
  - Pass consent to `buildOrderMessage(order, consent, requestId)`
- [x] Run `npm run format && npm run lint && npm run typecheck && npm run build` in `src/orders-intake/`

### T4. Update orders-intake tests

- [x] Update `src/orders-intake/src/index.test.ts`:
  - Update all test payloads to include `consent` object
  - Add test: returns 400 when `consent` is missing
  - Add test: returns 400 when `consent` is not an object
  - Update success test to verify `consent` is included in the message sent to SQS
- [x] Run `npm run test` in `src/orders-intake/`

### T5. Update dispatch-side templaters

- [x] Update `emailTemplater.ts` `TemplateContext` — add `productType: string` or restructure to handle nested payload
- [x] Update `buildTemplateContext()` to extract `productType` from payload and pass consent-relevant fields
- [x] Update `buildOrderEmailHtml()` to render `productType` prominently (e.g. as a header subtitle)
- [x] Update `telegramTemplater.ts` similarly — add `productType` to context, render in template header
- [x] Both templaters should continue rendering order fields as key-value rows but filter out `productType` from the table (already shown in header) and filter out boolean values or render them as Yes/No
- [x] Run `npm run format && npm run lint && npm run typecheck` in `src/dispatch-message-queue/`

### T6. Update dispatch-side tests

- [x] Update `emailTemplater.test.ts` — test with payloads containing `productType` and boolean values
- [x] Update `telegramTemplater.test.ts` — same
- [x] Update `handler/index.test.ts` — ensure `processOrderMessage` test fixtures include `consent` field on the `OrderMessage`
- [x] Run `npm run test && npm run build` in `src/dispatch-message-queue/`

### T7. Full validation

- [x] `cd src/shared && npm run build`
- [x] `cd src/orders-intake && npm run format && npm run lint && npm run typecheck && npm run test && npm run build`
- [x] `cd src/dispatch-message-queue && npm run format && npm run lint && npm run typecheck && npm run test && npm run build`

## Critical files

- `src/shared/src/types/orderMessage.ts` (modify — add consent types, update builder)
- `src/shared/src/types/index.ts` (modify — re-export new types)
- `gateway/spec.yaml` (modify — add consent to request schema)
- `src/orders-intake/src/utils.ts` (modify — add consent extractor)
- `src/orders-intake/src/index.ts` (modify — validate consent, pass to builder)
- `src/orders-intake/src/index.test.ts` (modify — update fixtures, add consent tests)
- `src/dispatch-message-queue/src/senders/email/emailTemplater.ts` (modify — handle productType)
- `src/dispatch-message-queue/src/senders/telegram/telegramTemplater.ts` (modify — handle productType)
- `src/dispatch-message-queue/src/senders/email/emailTemplater.test.ts` (modify)
- `src/dispatch-message-queue/src/senders/telegram/telegramTemplater.test.ts` (modify)
- `src/dispatch-message-queue/src/handler/index.test.ts` (modify — consent in fixtures)

## Verification

- [ ] All shared types compile and are re-exported
- [ ] API Gateway spec validates (well-formed OpenAPI 3.0)
- [ ] orders-intake rejects requests without `consent` (400)
- [ ] orders-intake accepts valid `{ order, consent, captchaToken }` and includes consent in SQS message
- [ ] Dispatch templaters render `productType` in email/Telegram notifications
- [ ] Boolean order values render as human-readable text in templates
- [ ] All existing tests updated and passing
- [ ] `npm run format && npm run lint && npm run typecheck && npm run test && npm run build` clean in all three projects
