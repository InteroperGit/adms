# Order inquiry form section

**Status:** UI and client transport implemented; delivery dependency unresolved

**Priority:** High

**Created:** 2026-10-06

**Archived:** 2026-10-06, at the user's request

## Goal

Add a homepage section where visitors can describe the advertising product
they need and send the agency a message to discuss an order.

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable development rules.
Apply frontend-design and astro-best-practices when implementing the section.

## Scope

- Create `src/components/sections/OrderInquiry.astro` and place it immediately
  after Contacts on the homepage, with the anchor `order-inquiry`.
- Use the existing section component, design tokens, and light/dark themes.
  Provide Russian copy, for example «Обсудим ваш заказ» and
  «Расскажите, какая реклама вам нужна».
- Include name, reply email, optional phone, and a required message describing
  the order. Mark required fields clearly; use visible labels, suitable input
  types, autocomplete, and reasonable length limits.
- Add an «Отправить заявку» submit button and a clear link to the existing
  privacy policy. Confirm any required consent wording against agency content
  before publishing it.
- Keep editable labels, explanatory copy, and submission configuration in the
  existing content system, with appropriate types and validation.
- Connect submission to an agreed delivery service or backend. The site is
  currently static: determine the supported submission mechanism before
  implementing delivery. Keep service credentials on the server and validate
  submitted fields there; include suitable abuse protection.
- Show validation, sending, success, and failure states. Announce feedback
  accessibly, prevent duplicate submissions while sending, preserve input on
  failure, and clear it only after confirmed acceptance by the service.
- Provide existing agency email/phone as a fallback when delivery is
  unavailable. Without a configured service, clearly explain that submission
  is unavailable; never show a simulated success message.

## Inputs needed for delivery

Confirm the receiving mailbox, submission endpoint or provider, deployment
support, and approved privacy/consent copy during implementation. The existing
public email is `info@rmaster35.ru`; confirm whether form inquiries should go
there. Record missing configuration as a dependency of working delivery.

## Acceptance and verification

- The new section appears immediately after Contacts on the homepage and its
  anchor works.
- Visitors can send a valid inquiry through the configured delivery mechanism;
  verify receipt in a controlled test before marking delivery complete.
- Invalid input, service errors, offline requests, and repeated clicks produce
  clear feedback without losing the visitor's message or claiming success.
- Verify keyboard navigation, visible focus, labels, error associations, and
  announced status updates in a real browser using the Playwright skill.
- Check both themes at 320px and desktop widths, enlarged text, and long input
  without horizontal overflow. Preserve navigation, settings, and cookie UI.
- Verify no-JavaScript behavior: use native submission where supported, or
  display an explicit contact fallback.
- Run `pnpm check`, `pnpm build`, and diff checks. Document configuration,
  delivery behavior, test evidence, and remaining dependencies.

Archived at the user's explicit request; unresolved delivery dependencies
and verification limits remain documented below.

## Implementation and verification — 2026-10-06

Added the homepage section after Contacts, validated editable JSON, plain
domain types, native fields, policy/direct-contact links and lightweight
browser enhancement. Delivery is disabled pending confirmed recipient,
backend/provider, hosting support and approved consent copy. Existing legal
documents name a different email from public contacts; agency review is needed.

Production browser checks passed for both themes at 320/1440px with 16/32px
root text, long input, no overflow, labels, keyboard focus, status semantics
and no-JavaScript fallback. An enabled local fixture with intercepted responses
passed validation, sending, error/offline/timeout, duplicate-submit protection,
retry IDs and confirmed-acceptance-only reset. No real delivery was performed.
The test fixture was removed and disabled configuration restored.

`pnpm check` and `pnpm build` passed; check reports one pre-existing hint in
ignored task-018 evidence. See [configuration and evidence][inquiry-guide].
Native zoom, screen-reader speech and real service/receipt verification remain
open. The user requested moving this task to fixed despite the unresolved
delivery acceptance; archiving does not confirm working inquiry delivery.

[inquiry-guide]: ../../../site/order-inquiry.md
