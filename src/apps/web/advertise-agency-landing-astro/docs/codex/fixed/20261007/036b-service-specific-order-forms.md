# Implement service-specific order forms

**Status:** Archived at user request; technical work verified

**Priority:** High

**Created:** 2026-10-07

## Goal

Let customers request each service through its own tailored order form, with
shared contact fields and relevant project questions. Connect service pages
and case studies to the appropriate form under the
[sales and SEO plan](../../plan/sales-and-seo-plan.md).

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable development rules.
Apply astro-best-practices and frontend-design during implementation.

## Scope

### User scope adjustment (2026-10-07)

Implement only LedLetters (Световые буквы), embedded immediately after
«Итоговый результат» on case study pages. Other service forms, homepage
selection, and service-page integration are outside this implementation.

- Audit the existing service catalog, OrderInquiry component, validation,
  submission handler, and backend configuration before selecting integration.
- Provide a distinct form for every service in the catalog. Reuse common
  components and a validated configuration rather than duplicating form code.
  Each service page opens its own form with the service already selected.
- Let homepage visitors choose a service. Changing service reveals only that
  service's unique fields and updates validation and the submission payload.
  Preserve entered contact information; exclude hidden fields from submission.
- Associate each case study with a validated service ID. Its inquiry action
  opens the matching service form and includes optional project context.
  Keep direct links useful and avoid relying solely on client-side state.

## Shared fields

- Contact name and phone; optional email and preferred contact method.
- Optional company name, project address, desired deadline, budget range,
  and a free-text description of the customer's needs.
- Link to relevant existing privacy/consent documents with clear consent
  wording. Reuse established consent behavior and accessible controls.
- Design files or site photos: support attachments only when actual delivery
  supports them; otherwise offer an optional file link without a fake upload.
- Keep the minimum submission short. Clearly label required/optional fields,
  provide units and hints, and allow unknown technical specifications.

## Unique fields by service

Use this as the starting field matrix and refine it against existing content.
All technical inputs should allow customers to request advice or a site visit.

| Service | Project-specific questions |
| --- | --- |
| Световые буквы | Sign text/logo; letter height or overall width; lighting type; facade/background; mounting and power availability |
| Вывески | Sign type; width/height; indoor/outdoor placement; illumination; artwork availability; installation needed |
| Неон | Text/logo; width/height; color; indoor/outdoor placement; backing shape; mounting and power availability |
| Объёмные конструкции | Object type; dimensions; intended location; materials/finish; lighting; support or mounting requirements |
| Монтаж | Existing object type and size; installation address/height; wall or support type; access conditions; power; dismantling needed |

Confirm exact service IDs and labels from the catalog during implementation;
new services must have explicit form configuration or a useful general form.
Avoid implying instant pricing or acceptance of an order from a request form.

## Submission and behavior

- Include service ID, shared fields, active service fields, and optional case
  study ID in one documented payload. Validate on both client and server.
- Audit/configure real delivery and report success only after backend receipt
  is confirmed. Current inquiry delivery is disabled when unconfigured.
  Never make a client-only success message stand in for an actual request.
- Use clear loading, validation, success, and failure states. Prevent duplicate
  submissions, preserve inputs on failure, and support retry without data loss.
- Do not hardcode credentials or recipient details. Identify any missing
  endpoint/recipient configuration as a concrete implementation dependency.
- Retain useful no-JavaScript behavior, keyboard access, visible focus,
  programmatic labels, error associations, and announcement of status changes.
- Match existing site typography, controls, themes, and responsive layouts.
  Update content/integration documentation and task progress.

## Acceptance and verification

- Every catalog service has its own complete form and relevant unique fields.
  Service-page, homepage, and case-study entry points select the correct form.
- Service switching preserves shared values and never submits stale hidden
  fields. Unknown/missing service IDs lead to a useful general selection.
- Verify required fields, contact formats, units, optional values, consent,
  active-field validation, payload contents, and server rejection behavior.
- Exercise real success and backend failure; verify receipt at the configured
  destination before claiming delivery works. Test double-click and retry.
- Check mobile/desktop, both themes, keyboard flow, screen-reader errors,
  long labels, enlarged text, and direct/no-JavaScript navigation.
- Run relevant tests, `pnpm check`, `pnpm build`, and source style/diff checks.
  Record evidence and remaining delivery configuration requirements.
- Archive only after implementation and verification meet acceptance;
  incomplete delivery remains explicit rather than being marked successful.

## Implementation and verification (2026-10-07)

- Added `src/components/forms/LedLettersForm.astro` after the result section on
  all three case pages. Local inquiry links target `#led-letters` and explicitly
  name the lettering service, including on non-lettering development cases.
- Shared contact fields: name/phone required; email/company/address/deadline/
  budget/message optional. Email is required when selected as the contact
  channel. Added sign text, letter height/overall width in cm, lighting,
  facade, installation, power, and optional design/photo URL fields.
- Native selects offer advice/unknown options. Consent is explicit and links
  to existing legal pages. No fake upload or pricing calculation was added.
- Reused receipt-based submission initialization and existing configuration.
  Extended common control validation to selects, numeric/native constraints,
  URL validation, and phone formats. Requests contain `serviceId`, `projectId`,
  entered fields, and a retry-stable `requestId`.
- Form fields are usable without delivery configuration, but submit stays
  disabled. Contacts remain accessible with or without JavaScript.
- Astro check/build passed; the existing task-018 unused-variable hint remains.
- Browser checks passed for all three pages at 320/768/1440px in both themes:
  form follows result, controls work, email requirement changes, and no overflow.
- Simulated endpoint checks passed for required-field and negative-dimension
  rejection, duplicate-submit prevention, payload/service/case context, failure
  preserving inputs, retry ID reuse, and receipt-confirmed reset/success.
  These tests do not establish actual agency delivery.
- No-JavaScript form filling and disabled-submit fallback passed. Screenshots
  and helper: `output/playwright/task-036b/`; desktop light layout reviewed.
- No backend endpoint or approved consent configuration is supplied. Live
  submission and server validation remain dependencies.

## Archive record (2026-10-07)

Moved to `fixed/20261007/` at the user's request with tasks 035-037.
Technical verification is recorded above and in task 037. Genuine agency
approvals, photo rights, and live submission remain production dependencies.
