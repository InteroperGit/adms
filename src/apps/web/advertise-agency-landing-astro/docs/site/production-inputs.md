# Production business and legal input register

[Documentation index](../../README.md)

Prepared for [task 050][task-050] and [task 051][task-051] on 2026-10-09.
This is an internal evidence inventory and agency handoff, not an approval
record or legal opinion. Repository content establishes what is currently
configured; it does not establish agency approval, mailbox ownership, hosting
capabilities, or a working delivery service. No agency confirmations or
external account evidence were supplied during this implementation.

## Business facts awaiting confirmation

Every row below is **unconfirmed**. Approval owner, approval date, and approval
source are **not supplied** for every row. The inventory date above is not an
approval date. Keep existing public values until the agency supplies approved
replacements and identifies the responsible owner.

| Input | Current repository value | Source / agency decision required |
| --- | --- | --- |
| Public business name | Рекламное агентство Рекламастер; logo: Рекламастер | [Site JSON][site]; confirm public name and legal operator identity separately. |
| Address | г. Череповец, ул. Металлургов, д. 9 | [Site JSON][site]; confirm public/customer-facing location. |
| Phone | 8 8202 600-635 | [Site JSON][site]; confirm number and display format. |
| Public email | info@rmaster35.ru | [Site JSON][site]; confirm monitored public mailbox. |
| Hours | Пн–Пт: 09:00 – 18:00; Сб–Вс: выходной | [Site JSON][site]; confirm hours and timezone. |
| Service area | Draft introduction names Череповец; `copyApproved: false` | [Introduction JSON][introduction]; confirm actual coverage; address does not establish service area. |
| Approval owner | Not recorded | Supply responsible agency person/role and authority to approve business, legal, and delivery changes. |
| Legal operator | Site name only; no confirmed legal identity | [Privacy policy][privacy], [consent document][consent]; supply operator identity and any agency-required details. |

## Email mismatch and legal review

Public contacts use `info@rmaster35.ru`. Privacy policy section 5 and consent
document section 4 use `info@reklamaster.ru` for deletion/change requests and
consent withdrawal. [Archived task 022][task-022] already recorded this mismatch.
Neither mailbox has an approval record here. The agency must confirm each
mailbox's purpose and whether they should agree or intentionally differ.
Do not select one address merely because it appears in current public copy.

Both legal documents display an effective date of 1 September 2026; this is
existing text, not evidence of review or approval. Agency/legal review must
cover both actual forms, including free-text messages and the lettering
form's company, installation address, preferences, specifications, file link,
and service/project context. Current lists do not describe all these fields.

The current wording also mentions analytics, continued-use agreement,
protected servers, and indefinite consent. These statements need review
against the actual provider, operator, storage, access, retention/deletion,
and consent process. The [cookie guide][cookies] records that preferences
only hide the banner and do not gate external resources. No analytics
integration is documented there. This inventory does not validate legal
sufficiency or propose replacement legal text.

## Delivery decision register

All decisions below remain **missing**, with no approver, date, or approval
source. Record agency answers and evidence before selecting infrastructure
or enabling either form.

| Required decision | Agency input needed |
| --- | --- |
| Recipient and operations owner | Confirm monitored inquiry mailbox(s), routing for both forms, authorized receiver, and who handles failures. Public email does not establish the recipient. |
| Deployment capabilities | Identify host/account owner and verified runtime or function support, external endpoint options, origin, and configuration access. |
| Provider / endpoint | Select authorized transport, endpoint, provider/processor, sender identity, queue/delivery behavior, and who configures server secrets. |
| Data processing | Confirm purposes, processed fields, processors/storage locations, access roles, retention periods for inquiries, logs, queues and backups, and deletion/withdrawal procedure. |
| Consent and legal wording | Approve both forms' checkbox labels and policy/consent document revisions, with version and effective date. The lettering form has its own literal label. |
| Receipt verification | Identify authorized test receiver and approval for controlled test submissions from each form, without storing personal data in evidence. |

`astro.config.mjs` currently sets `output: 'static'` and configures no server
adapter. This confirms the application's build mode, not the deployment
host's available capabilities. [Deployment assumptions][deployment] must be
checked with the hosting owner. No production provider or endpoint has been
selected in the repository.

## Task 051 technical handoff

This is the existing client interface to preserve or explicitly revise after
agency decisions. It is not an approved transport/recipient/consent contract.

- [Inquiry JSON][inquiry-config] has `submission.enabled: false`, empty
  `submission.endpoint`, `timeoutMs: 15000`, and `consent.approved: false`.
  Delivery stays disabled. Enabling requires approved nonblank consent and
  a credential-free HTTPS endpoint or local path; these flags do not establish
  approval or server access control.
- Both [homepage form][homepage-form] and [lettering form][lettering-form]
  use the configuration and [shared client transport][transport]. Requests
  are JSON POSTs with string-valued form fields and a UUID `requestId`, omit
  credentials, and reject redirects. Cross-origin transport needs approved
  CORS. Do not put service secrets in editable JSON or browser code.
- Homepage fields: required `name` (120), `email` (254), `message` (5000),
  optional `phone` (40), and required `consent: "on"`.
- Lettering fields: required `name` (120), `phone` (40), `consent: "on"`;
  `email` (254) becomes required when `contactMethod` is `email`. Optional
  fields include `company` (120), `signText` (300), `widthCm`,
  `letterHeightCm`, `address` (300), `facade` (300), `deadline`, `budget`,
  `fileLink` (2000), and `message` (5000). Selects are `lighting`,
  `installation`, `power`, and `contactMethod`. Hidden fields include
  `serviceId: "svetovye-bukvy"` and string `projectId`. Server validation
  must use each form's actual requirements, allowed choices and numeric/date
  constraints; homepage requirements cannot be applied to both forms.
- Only an HTTP success with JSON `accepted: true` and a nonblank string
  `receiptId` clears inputs. The backend must durably deliver or queue before
  acceptance, atomically deduplicate `requestId`, and handle unchanged retries
  without duplicate delivery. This response proves client acceptance, not
  receipt in the agency mailbox; verify both forms' actual receipt in 051.
- Implement server validation, body-size limits, rate limiting, origin checks,
  and suitable bot protection in the selected backend. Treat submitted
  service/project context as untrusted. Keep validation and delivery logs
  consistent with the approved retention contract and avoid personal data in
  source-controlled verification evidence.
- Preserve input on failure, direct-contact fallback, and explicit disabled
  no-JavaScript behavior. [Inquiry guide][inquiry-guide] records prior local
  fixture verification; it does not establish live delivery. Task 051 must
  document backend setup, rollback, authorized real receipt checks, and
  failure/retry behavior before production activation.

## Approval record and completion procedure

For each decision above record: exact approved value or document version,
named agency approver and role, approval date, authoritative source/reference,
scope (public contacts, legal contact, recipient, host, provider, or consent),
and any restrictions. Link accessible source material or a redacted evidence
record; keep credentials and personal test payloads out of version control.

Approval records received to date: **none**. When supplied, replace the
missing entries with real evidence. Then apply approved facts consistently
to site JSON, both legal documents, and both forms' consent copy; verify their
rendered pages and transport requirements. Resolve the email decision
explicitly, including any intentional distinction between mailbox purposes.
Task 050 was archived at user request on 2026-10-09. Agency confirmation and
business/legal agreement with approved sources remain pending. Task 051 can
use this list to obtain missing inputs; no live delivery is authorized here.

[task-050]: ../codex/fixed/20261009/050-confirm-production-business-and-legal-inputs.md
[task-051]: ../codex/fixed/20261009/051-enable-and-verify-inquiry-delivery.md
[task-022]: ../codex/fixed/20261006/022-order-inquiry-form-section.md
[site]: ../../data/content/site.json
[introduction]: ../../data/content/introduction.json
[privacy]: ../../data/content/legal/privacy-policy.json
[consent]: ../../data/content/legal/terms-of-use.json
[inquiry-config]: ../../data/content/order-inquiry.json
[homepage-form]: ../../src/components/sections/OrderInquiry.astro
[lettering-form]: ../../src/components/forms/LedLettersForm.astro
[transport]: ../../src/components/forms/order-inquiry.ts
[deployment]: deployment-and-assets.md
[cookies]: cookie-preferences.md
[inquiry-guide]: order-inquiry.md
