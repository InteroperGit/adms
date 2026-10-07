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
failure behavior before enabling production. No backend is implemented here.

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
receipt remain unverified. Task 022 remains in todo until delivery acceptance.


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
