# Order inquiries

[Documentation index](../../README.md)

The homepage renders `OrderInquiry.astro` immediately after Contacts at
`/#order-inquiry`. It reuses the section primitive, semantic theme tokens,
visible labels and native controls. Name, reply email and message are required;
phone is optional. Maximum lengths are 120/254/40/5000 respectively.

## Current delivery dependency

Delivery is disabled. No provider, receiving mailbox, submission endpoint or
hosting runtime has been approved. The static site cannot receive POSTs by
itself. The separate direct-contact sidebar was removed at the user's request.
Unavailable-delivery and no-JavaScript feedback refer to Contacts immediately
above the form; that section retains the existing email and phone.

The internal [production input register](production-inputs.md) records current
business/legal sources, missing agency decisions, and both forms' task-051
handoff. No recipient, provider, consent, or business approval is inferred
from existing content.

Existing privacy/consent documents mention `info@reklamaster.ru`, a different
address, and need agency review for the message field, actual processor,
retention and approved consent wording. The form links the existing policy
and shows a required, initially unchecked policy agreement checkbox even
while delivery is disabled. The checkbox label is editable in
`consent.label`; agency approval for live delivery remains pending.

Edit `data/content/order-inquiry.json`. Its typed wrapper validates all copy,
required flags, length limits, timeout (1000–30000ms), safe endpoint and consent
configuration at build time. Enabling delivery requires a nonempty local path
or credential-free HTTPS endpoint, `consent.approved: true` and approved
nonblank `consent.label`. These editorial switches are not access control.
Rebuild after changes. Never place credentials in JSON or browser code.

## Endpoint contract for the approved backend

The browser sends JSON with `name`, `email`, `phone`, `message`, `consent`
(`"on"`) and a UUID `requestId`. The endpoint must support JSON POST and, for
another origin, approved CORS. Requests omit credentials and reject redirects.
Only a successful HTTP response with JSON `accepted: true` and a nonblank
string `receiptId` clears the form. Acceptance must follow durable delivery or
queueing, never precede it. A generic 200, HTML page or unconfirmed JSON fails.

Implement server-side field validation and length limits, consent verification,
body-size limits, rate limiting, origin checks and suitable bot protection in
the selected backend. Store service secrets there. Deduplicate `requestId`
atomically before delivery; unchanged retries reuse the ID because a timeout
can happen after acceptance. Confirm controlled mailbox receipt and service
failure behavior before enabling production. No endpoint is implemented here.

The client announces validation, sending, acceptance and failures through a
polite status region. Field errors are associated with controls; invalid
submission focuses the first error. Sending locks fields and the button.
Failures retain input in the current page, with no local storage or logging
of personal data. Reloading loses this unsent draft. Without JavaScript,
fields and submission stay disabled; agency contacts remain in Contacts above.

## Verification on 2026-10-06

`pnpm check` and `pnpm build` passed. Check reported zero errors/warnings and
one existing unused-variable hint in ignored task-018 evidence.

Playwright verified production output at 320/1440px in both themes with
16/32px root text, long unbroken message input and no horizontal overflow.
It checked section ordering, visible labels, native keyboard order and focus,
status semantics, disabled-delivery Enter behavior and no-JavaScript contact
fallback. Desktop Light and mobile Dark screenshots were visually inspected.
The screenshots include existing fixed header/cookie overlays.

A temporary enabled fixture used clearly marked local test consent and an
intercepted `/inquiry-test` endpoint. Tests passed for required/whitespace and
email errors, error associations, first-error focus, sending/busy state,
HTTP 500, offline abort, timeout, unconfirmed acceptance, duplicate submits,
preserved message, stable retry IDs and reset only on confirmed acceptance.
All requests were local test interceptions; no email was sent. The fixture
was removed and disabled configuration restored.

Evidence scripts and screenshots are under ignored
`output/playwright/task-022/`. Doubled root text is not native browser zoom;
screen-reader speech, actual deployed service/abuse protection and real mailbox
receipt remain unverified. Task 022 was archived at the user's request on
2026-10-06 despite unresolved delivery acceptance. Tasks 050 and 051 track
agency input confirmation and live delivery respectively.


## Form presentation update - 2026-10-08

The inquiry now uses a centered panel up to 56rem wide, with a neutral
border, contrasting input surfaces, larger controls, and explicit focus
outlines. Consent and privacy are separated from the writing area;
status feedback has its own readable surface. Name/email share a desktop
row, while phone/message span the form. Narrow screens stack all fields
and use a full-width submit action.

Field identities, copy, validation, consent, and submission configuration
are unchanged. Delivery remains disabled. Type check and production build
pass. Browser checks pass in both themes at 320/768/1440px with normal and
doubled text, including keyboard focus, labels/hints, policy navigation,
no-JavaScript protection, and disabled Enter submission (64 checks).
Evidence is in output/playwright/inquiry-design/. External demo images
were isolated from the local form checks; no delivery endpoint was enabled.

## Server validation prerequisite - 2026-10-09

[Task 051](../codex/fixed/20261009/051-enable-and-verify-inquiry-delivery.md) adds
[a dependency-free payload validator](../../src/server/inquiry-payload.ts).
It accepts the existing flat JSON payloads for both forms, checks each form's
actual required fields and limits, validates consent and UUID retry identity,
and rejects unexpected fields, invalid select values, contact details,
numeric/date specifications and unsafe file-link schemes or credentials.
The validator never fetches file links. Adapters must treat free text as
untrusted, escape it in email/HTML, and never insert it into email headers.

The selected server adapter must invoke `validateInquiryPayload` before
queueing. Supply `projectIds` from its trusted published catalog; an empty
list rejects every lettering request. Supply `homepageLimits` from the
current inquiry content if its limits are smaller than the hard ceilings.
Validation returns normalized string fields or field names only, never an
acceptance receipt. Consent `"on"` records a checked box; it does not prove
approved wording or establish the eventual provider's consent record.
This module is not imported by the browser and is not yet wired to a runtime.

Run `node scripts/test-inquiry-payload.mjs` to exercise both contracts and
negative cases with synthetic data. The test transpiles TypeScript in memory
using the existing compiler dependency, including on supported Node 22.
Five tests passed; `pnpm check` reported zero errors/warnings and the existing
unused-variable hint in task-018 evidence. These checks do not prove delivery.

### Existing monorepo integration options

Investigation found two earlier services; neither is an approved or verified
production host/provider for this Astro application:

- [Fastify form route][form-route] returns `{status: "success"}` after
  registered handlers run. Its [registry][form-registry] currently installs
  only a logger for feedback. That result does not establish delivery and
  does not implement this client's receipt or retry contract.
- [Yandex orders intake][orders-intake] expects nested `order`, a captcha
  token and a structured consent record, then queues and returns
  `{messageId}`. The current Astro payload does not meet that interface.
  It takes correlation identity from the gateway event, rather than the
  client's retry UUID. The inspected handler does not durably deduplicate
  that UUID. Its downstream queue/email capability is a candidate for reuse
  only after the agency approves the provider and runtime.

Do not convert either existing success response to `accepted: true` in the
browser. The chosen intake must enforce validation, origin/body-size/rate
limits and approved bot protection, and atomically retain the client UUID
and payload identity with its durable queue/delivery operation. Unchanged
retries must return the original receipt; conflicting payloads for the same
UUID must fail. A process-memory map or gateway-generated UUID cannot meet
this requirement. The adapter must return `{accepted: true, receiptId}` only
after durable acceptance and preserve that behavior after restart/concurrent
requests. Provider-specific consent records, retry storage and delivery
retention remain agency decisions recorded in [production inputs][inputs].

### Activation and rollback

Keep `submission.enabled: false`, an empty endpoint and
`consent.approved: false` until the approved adapter is deployed and tested.
Configure secrets in that runtime only. Verify origin/abuse controls,
durable deduplication, queue/provider failures and input-preserving client
failures before an authorized controlled submission from each form.
Record redacted receipt evidence, including project/service context, with
the receiving agency. No messages have been sent during this implementation.

Once approval and receipt evidence exist, set the credential-free endpoint,
approved consent text and enable flags in the content configuration, build
and release through the host owner's deployment process. To roll back,
disable submission and rebuild/redeploy the static site; stop new intake
server-side as well. Previously accepted queued inquiries require the
agency's agreed drain/deletion procedure. Direct-contact fallback remains
available. Task 051 was archived at user request on 2026-10-09; backend
integration and real receipt remain pending.

[form-route]: ../../../../../services/advertise-agency/form-data-service/src/routes/formRoute.ts
[form-registry]: ../../../../../services/advertise-agency/form-data-service/src/formRegistry.ts
[orders-intake]: ../../../../../services/advertise-agency/yandex-cloud-infrastructure/src/orders-intake/src/index.ts
[inputs]: production-inputs.md
