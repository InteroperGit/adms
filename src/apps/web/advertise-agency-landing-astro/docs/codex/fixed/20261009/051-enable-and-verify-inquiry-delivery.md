# Enable and verify live inquiry delivery

**Status:** Archived at user request; live integration and receipt pending

**Priority:** Priority 1

**Created:** 2026-10-09

**Archived:** 2026-10-09, at the user's request

**Plan:** [Sales and SEO improvement plan](../../plan/sales-and-seo-plan.md).

**Depends on:** Task 050; archived tasks 022 and 036b.

**Input handoff:** [Production input register](../../../site/production-inputs.md)
records the existing two-form transport interface and explicitly missing
recipient, host/provider, retention, and consent decisions. It is not an
agency-approved delivery contract; delivery remains disabled.

## Goal

Let visitors submit inquiries and verify that the agency receives them.

## Scope

- Reuse both existing inquiry UIs and their shared transport. Implement the
  agreed backend/provider for the static site's deployment environment.
- Validate fields on the server, protect against abuse, keep credentials
  server-side, and implement the expected acceptance and retry contract.
- Enable delivery only with approved consent and real configuration; preserve
  direct-contact fallback and input on failure.
- Exercise valid/invalid input, rejection, offline/timeout, repeated clicks,
  retries, accessible feedback, and no-JavaScript behavior.
- Arrange authorized controlled delivery tests for both forms and confirm
  receipt, including case/service context, with the receiving agency.

## Acceptance

- A real inquiry from each form reaches the agreed recipient; record evidence
  without exposing personal data. Mock responses do not establish receipt.
- Failures never report success or discard input; setup and rollback are
  documented, and delivery remains disabled if required inputs are missing.

## Execution notes

Read project instructions, task-management guidance, and applicable rules
before implementation. Record missing agency inputs or external access as
dependencies. This task file authorizes no external publication or messages.
Archived at explicit user request despite outstanding delivery acceptance.

## Implementation progress - 2026-10-09

Implemented [server payload validation](../../../../src/server/inquiry-payload.ts)
for the existing homepage and lettering contracts, with trusted project
allowlists supplied by the future adapter. Added synthetic positive and
negative tests in [the verification script][validation-tests]; all five pass.
`pnpm check` passes with zero errors/warnings and one existing hint in ignored
task-018 evidence. This is a backend prerequisite, not a deployed endpoint.

[The inquiry guide][inquiry-guide] records incompatible existing monorepo
service contracts, required durable UUID deduplication/receipt changes,
activation prerequisites and rollback. Delivery and consent flags remain
disabled. No external submission or real receipt test has been performed.

Remaining dependencies: approved recipient, hosting/runtime and provider,
consent/data-processing decisions, runtime integration and abuse controls,
durable retry storage and authorized controlled receipt verification for
both forms. Archiving does not establish real-delivery acceptance.

[validation-tests]: ../../../../scripts/test-inquiry-payload.mjs
[inquiry-guide]: ../../../site/order-inquiry.md
## Independent review and final checks - 2026-10-09

Separate implementation and review subagents completed one fix/review cycle.
Review found email domain-label length and native numeric syntax parity gaps;
both were fixed with regression cases. Re-review found no actionable defects
in the scoped validator and integration documentation. All five synthetic
test groups, code-style checks, type checks and production build pass.
The build generates 11 pages and preserves disabled inquiry delivery.

No backend was selected/deployed, no live inquiries were sent, and no receipt
was verified. This is partial task progress; production acceptance remains
open pending the named agency/infrastructure inputs and runtime integration.
