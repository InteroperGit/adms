# External submissions

Keep submission disabled until the receiving service, configuration, consent and
operational ownership are approved and verified. A static form or an enabled
content flag does not establish a working delivery service. Preserve a usable
contact fallback and clear unavailable/no-JavaScript feedback. Never show a
success message for an action the system cannot confirm.

## Trust and validation

Treat every browser payload as untrusted, including hidden context, identifiers,
consent flags and values already checked by client validation. Validate on the
receiving server before processing or delivery, using the actual supported form
contract and trusted context. Reject unsupported fields/types, enforce size and
length limits, and validate URLs and selections. Keep client and server
contracts aligned; do not silently adapt an incompatible service response into
success.

Use client validation to help visitors: visible labels, associated errors, a
clear first-error focus path and understandable status feedback. Prevent
accidental duplicate sends while a request is pending. Do not lose entered data
on validation, timeout, network or service failure. Avoid persistent storage of
unsent personal data unless explicitly required and approved.

## Acceptance and retries

HTTP success alone does not prove acceptance or delivery. Clear the form only
after the receiving service supplies the agreed explicit acceptance evidence.
Distinguish durable intake from actual receipt by the intended recipient. Do not
confirm intake before the service has durably accepted responsibility for it.

A timeout can occur after acceptance. Preserve retry identity for an unchanged
submission and require the receiving system's retry contract to prevent
duplicate processing. Where retries are supported, deduplication must survive
concurrent requests and restarts; process-memory state is insufficient.
Conflicting content under the same retry identity must not silently become a
second submission. Verify these semantics with the chosen service rather than
assuming them from a status code or a generic success field.

## Privacy and abuse controls

Keep provider credentials and verification secrets in backend runtime
configuration, never browser code, public environment variables, editable
content or version control. Public client keys do not establish server
verification. Apply appropriate origin, request-size, rate and bot controls at
the receiving boundary. A challenge token does not replace field validation;
verify it through the provider's server contract and handle failures safely.

Escape untrusted text for its destination. Do not interpolate it into email
headers, executable templates or queries. Never fetch submitted links as an
incidental part of form handling. Keep raw payloads, personal data and secrets
out of ordinary logs, error messages and committed evidence. Use operational
identifiers and redacted diagnostics where needed.

Confirm the recipient, processor, access, retention/deletion rules and consent
wording with the responsible owner. A checked box or existing legal copy does
not establish approval. Describe actual processing and third-party behavior;
never claim that a preference gates resources when it does not.

## Activation and rollback

Before activation verify valid/invalid requests, configured limits and abuse
controls, timeout/failure input preservation, retry behavior and service
outages. Use intercepted or isolated delivery during development. Obtain
authorization before real submissions and confirm controlled receipt with the
intended owner; mocked success is not live-delivery evidence. Record approvals
and redacted results without personal test payloads.

Enable only the approved configuration after those checks. Provide a rollback
that disables new submissions at both the site and receiving boundary, rebuilds
or redeploys as needed, and preserves contact fallback. Handle already accepted
work under the owner's agreed retention, drain or deletion procedure. See
[release](release.md) for release checks.
