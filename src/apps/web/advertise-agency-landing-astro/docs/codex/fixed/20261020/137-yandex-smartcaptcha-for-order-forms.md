# Connect Yandex SmartCaptcha to order forms

**Status:** Implemented; production activation pending approved integration inputs

**Priority:** High

**Created:** 2026-10-20

**Depends on:** Task 051 backend delivery integration and an approved
Yandex SmartCaptcha site key, server key, domain configuration, and runtime
secret storage.

**Related:** [Order inquiry guide](../../../site/order-inquiry.md),
[order inquiry API specification](../../../development/order-inquiry-api.md),
[task 051](../20261009/051-enable-and-verify-inquiry-delivery.md).

## Goal

Protect both the homepage inquiry form and the LED-lettering order form with
Yandex SmartCaptcha. Require the backend to verify each challenge token before
accepting an inquiry.

## Scope

- Confirm the current Yandex SmartCaptcha client and server verification
  requirements from official documentation before implementation.
- Add the widget to both forms using the approved site key and configured
  domain. Keep labels, errors, focus behavior, loading states, and themes
  accessible.
- Include the challenge token in each form's request without changing the
  existing inquiry fields, consent, or retry identity contract.
- Verify tokens on the server with the secret key held only in runtime
  configuration. Reject missing, invalid, expired, reused, or unverifiable
  tokens before queueing or acknowledging an inquiry.
- Handle widget load failure, challenge failure, backend rejection, and retry
  without reporting success or discarding customer input.
- Keep delivery disabled until the backend, keys, domain, and production
  configuration are approved and verified. Do not place secrets in content,
  source control, or browser code.
- Document local/staging setup, production configuration, failure behavior,
  and rollback in the inquiry integration guide.

## Acceptance

- Both forms render and complete Yandex SmartCaptcha on supported viewports
  and keyboard flows.
- Requests carry a challenge token; the backend verifies it with Yandex
  before durable acceptance and never trusts browser-side completion alone.
- Missing, invalid, expired, replayed, and verification-service-error cases
  are rejected safely; valid tokens permit the existing receipt and
  idempotency behavior.
- CAPTCHA and delivery failures preserve form values and provide accessible
  recovery feedback. Repeated submissions do not create duplicate inquiries.
- Site and server keys stay in their intended client/runtime configuration;
  the server secret is absent from generated pages and browser bundles.
- Both forms are covered by focused automated checks, and setup, activation,
  and rollback are documented. Production delivery remains disabled if any
  required agency or infrastructure input is missing.

## Execution notes

Read [project instructions](../../../../AGENTS.md),
[task management](../../../development/task-management.md), and applicable
development rules
before implementation. Apply `astro-best-practices` when changing Astro files.
The current site has no approved production endpoint or SmartCaptcha keys, so
use synthetic tokens and a controlled verifier in local tests; do not submit
real customer data or claim production protection until server verification
is deployed and confirmed.

## Verification

- Added the SmartCaptcha widget to both order forms. The browser requires a
  token, clears one-time tokens after each submission, and keeps request
  identity stable across retry. Missing configuration and widget failures
  fail closed with accessible feedback.
- Added a local Playwright widget stub and verified token delivery from both
  forms without calling Yandex during tests.
- `pnpm test`: 746 unit/component tests passed.
- `pnpm test:e2e`: all 234 scenarios passed in Chromium, Firefox and WebKit.
- `pnpm check`: passed for 340 files; one pre-existing Zod deprecation hint
  remains in `src/validation/content-blocks.ts`.
- `pnpm exec eslint . --max-warnings 0` and `pnpm build` passed. The build
  generated 39 pages and reported the existing large-bundle advisory.
- Existing server-side verifier tests in the Yandex intake service passed:
  34 tests. Its request contract currently differs from this site's inquiry
  API; no production endpoint, keys, domain or runtime secret are approved.

The task is archived after source and test verification. Production activation
remains pending a compatible backend adapter and approved Yandex configuration.
