# Case study content and publication

[Documentation index](../../README.md)

## Source and current audit

`data/content/projects.json` is the single ordered catalog. Numeric IDs 1-3
remain stable and their demo routes remain `/projects/1` through `/projects/3`.
The three records describe proposed project solutions with planned details.
Public copy uses project language; status remains demo internally.
No genuine customer evidence or approved installation photography was supplied.
The original Picsum images were restored at user request on 2026-10-07.
They are preview photos with qualifying captions and no agency approvals.

| ID | Legacy subject | Withheld unverified material |
| --- | --- | --- |
| 1 | Lightbox in a shopping centre | Named client; 6 x 3 m; aluminium/LED specification; 10-day delivery; 30% footfall claim |
| 2 | Facade lettering for a cafe | Named client; eight 1.2 m letters; acrylic/light specification; wiring/timer work; 50% awareness claim |
| 3 | Neon sign for a barbershop | Named client; neon/effects specification; 4 m installation height; 20% customer-growth claim |

All original statements lack recorded sources and permission. They were
removed from public copy, not converted into verified specifications or
functional outcomes. Legacy Picsum URLs used seeds outdoor1, outdoor2,
and outdoor3 at 600 x 400 pixels. These unrelated placeholders were initially removed, then restored as demos;
no source/rights approval is implied by their former presence. Review records
are a separate, still-unverified dataset and were not changed by task 035.

## Editing a case

Edit the JSON, domain interfaces in `src/types/project.ts`, and the strict
schema in `src/validation/projects.ts` together when extending the contract.
The shared parser reports source and field paths. Validation covers all
records, including drafts. Nested contract assertions guard schema/type drift.
`src/content/projects.ts` exports `projectRecords` for the complete validated
catalog and `projects` for visible records. Avoid another detail-page catalog.

Each record requires title, generic or named client description, summary,
status, nullable notice, structured details, photos and evidence.
Full description, narrative, benefits, and result are optional. Detail fields
may be omitted or null; list fields may be empty. Empty sections render no
heading, panel, or spacing. Optional outcomes still require evidence when a
case is published; missing content does not create a fabricated outcome.
Unknown genuine details use `null`. Proposed solutions may include planned
specifications and timing, identified in public copy as design targets. An empty
constraints array explicitly means no recorded special constraints, whereas
`null` means constraints have not been confirmed.

## Lettering request form

Optional `projectType` uses English values: `led-letters`, `signs`, `neon`,
`dimensional-structures`, and `installation`. Omit it or
use null when the service is unknown. Unknown strings fail validation.
`LedLettersForm.astro` renders after the final result only for cases with
`projectType: "led-letters"`. Other or missing/null types render no form or
form-specific link. Return/contact navigation remains available.
Submission includes the originating `projectId`, contacts,
lettering parameters, and the shared handler's retry-stable `requestId`.
It reuses `data/content/order-inquiry.json` delivery configuration and feedback.
Fields are editable, while sending remains disabled without a configured
endpoint. Server validation and actual receipt are still unconfigured.

Only name, phone, and consent are always required; email becomes required for
email contact. Dimensions/budget must be positive, optional links must be valid
URLs, and native selects allow requesting advice instead of guessing details.
No file upload or other service form is implemented in this scoped delivery.

## Process and result galleries

The optional `resultPhotos` array uses the same photo contract and provenance
checks. «Итоговый результат» follows installation and shows result copy when
supplied plus a static photo gallery. No copy or photos means no section.
Development cases reuse local design illustrations with captions identifying
the proposed appearance; actual finished-work photographs remain pending.

Optional `manufacturing` and `installation` objects contain `paragraphs`
(nonblank string arrays) and `photos` (the existing ProjectPhoto contract).
Either field may be omitted. Absent/null objects, empty objects, and empty
arrays produce no section. Text-only and image-only sections render normally.
Blank strings and invalid media fail validation rather than becoming visible
placeholders. Field names remain English; visible headings are «Производство»
and «Монтаж». Russian process copy uses spaced bullet lists for easy scanning.

Both sections follow the overview, in manufacturing/installation order.
They use a static responsive text/gallery layout and the existing image
pipeline. Process images are lazy; the lead gallery retains its priority.
Every process photo follows the same demo/published provenance gates as the
lead photos. Published media needs rights and recorded approval.

Development records 1-3 include distinct proposed process copy and reused
local service illustrations. These are diagrams for discussing the solution,
not photographs of completed agency work. Their rights/approvals remain null.

Collect customerTask, installationContext, constraints, materials, dimensions,
includedWork and timing. Every dimension has a meaningful label, positive
numeric value and mm/cm/m unit. Do not confuse installation height with sign
size. Timing requires a positive production duration in hours or days and a
basis stating calendar/working time and when production starts/ends. Record
design, installation and totalDelivery separately; these can remain null when
unknown. Never reinterpret the legacy 10-day delivery claim as production time.

Optional `story` paragraphs explain design choices. `expectedBenefits` lists
project goals, rendered as "Что получает заказчик"; these are not measured
outcomes or evidence. Proposed dimensions use "по эскизу" and durations use
planned wording. Result copy needs a verified source and publication permission. A documented
installation or tested functional result is sufficient. Business growth needs
actual measurement evidence, context and customer permission; omit unsupported
claims. No result is displayed when `result` is null.

## Evidence and photos

Each evidence slot (copy, specifications, timing, outcome, attribution) is
null until genuinely approved. An approval contains source, approvedBy and a
real YYYY-MM-DD approvedAt date. Source should identify the agency record,
measurement sheet, accepted design, completion record, or approval message.
Do not put private records into public assets: use a traceable internal record
reference and retain the original securely with the agency. Approval references
are not rendered as visitor copy. Obtain attribution approval for either a
named customer or the exact generic description being published.

Every photo includes src, alt, positive intrinsic width/height, kind, source,
rights, approval, caption, cropGuidance and a focalPoint with x/y percentages.
Use kind installation only for the actual completed work; kind demo identifies
unrelated preview media. Demo photos cannot carry installation approval.
Approved photos require recorded usage rights. Capture the original supplier,
licence or customer permission, who approved publication and when. Check real
file dimensions, subject, rights and permission manually: schema shape is not
proof. Public asset paths and HTTP(S) sources are accepted, but validation does
not check existence. Prefer optimized local files in public/images/projects/.

Array order selects the card thumbnail and the first eager/high-priority
photo on detail pages. All later gallery photos are lazy. Cards crop at 3:2
using focalPoint percentages; detail galleries contain full images and captions.
`ProjectPhoto.astro` resolves bundled `/src/assets/` raster originals through
Astro Image and generates 320/640/960/1280px variants bounded by source size,
plus a maximum 1440px fallback. Missing bundled originals fail at build time.
Public and remote URLs keep supplied dimensions and use native images without
responsive variants; prepare suitable optimized files or a CDN for those URLs.
Use accurate intrinsic dimensions and inspect crops before publication.

Task 036 renders structured details, dimensions with Russian units, production
basis and separately supplied design/installation/total timing. Unknown fields
produce no empty sections. At the user's request, detail headers show only
the title and customer/year metadata above the lead image. Preview qualifiers
remain in proposed copy, planned specification labels, and image captions;
homepage cards also retain the notice. Matching lettering cases have a local
form/action after final imagery. Other cases retain native return/contact
links. Form delivery remains disabled without its endpoint configuration.

## Publication contract

- draft: validated but omitted from cards and generated routes. Partial/null
  details and empty photos are allowed while approvals are collected.
- demo: a proposed solution with a required catalog notice and generic client.
  Agency evidence approvals, installation photos and outcome claims are
  rejected. Demo visibility never establishes production acceptance.
- published: all five evidence approvals and at least one genuine approved
  installation photo with usage rights. Narrative/detail sections are optional.
  Every supplied photo must satisfy the genuine publication requirements.

The same `projects` export drives homepage cards and getStaticPaths. An empty
catalog produces no detail routes; the homepage retains the projects anchor
and an empty-state message. Never construct public links from projectRecords.
Changing a published/demo record to draft removes its route: review external
links separately and rebuild into a clean deployment directory.

Pricing validation receives only visible records with status published.
A genuine pricing example cannot point to an existing demo or hidden draft
route; remove its optional href until a genuine approved route exists.
Fictional pricing examples already reject project links. No checked-in pricing
example currently includes href. Rebuilds reject stale pricing destinations.

The current `projectType` determines the case form. Only `led-letters` has an
implemented form and local action; do not create links to absent forms.
Form delivery is an independent dependency.

## Agency handoff and acceptance

For each ID obtain the real project association (or replace the generic preview
with a documented case), approved customer naming/generic description, customer
task/context/constraints, measured dimensions, materials, included work,
production timing and its basis, verified outcome and all approval records.
Supply completed-installation originals with actual metadata and publication
rights. Review public copy against those records before setting published.

Task 035's technical layer and demo cleanup can be verified independently.
Production-ready cases and production acceptance remain pending these genuine
inputs. Tasks 035-037 were archived at user request on 2026-10-07; this
does not establish production acceptance.
Run pnpm check, pnpm build, source/field fixture checks and generated-link
inspection after edits. Task 037 covers full browser verification after task
036 adds the expanded presentation.

## Sales copy update (2026-10-07)

User requested full selling copy without demonstration/example wording.
All three visible solutions now have narrative, planned scope/dimensions,
materials, timing, constraints and customer benefits. The project notice
explains that parameters are refined after measurement. No completed-job
evidence, customer identity, growth statistics or approvals were invented.
Restored Picsum images remain visual references, not installation proof.

## Technical verification (task 037, 2026-10-07)

The current case pages pass schema/fixture checks, 320/768/1440px light/dark
layouts, 200% text enlargement, local image decoding, keyboard/native anchors,
and no-JavaScript checks in both system themes. Minimum measured text contrast
is 5.55:1 light and 7.02:1 dark. All 224 generated internal links resolve.
Empty sections and nonmatching forms are omitted. Email requirement labels
now track the chosen contact channel and reset correctly.

Restored Picsum images failed to decode in a fresh verification browser.
Local diagrams loaded, but the restored remote images cannot be considered
verified production photos. Genuine agency evidence/rights and real inquiry
delivery remain outstanding. See the
[verification record](../codex/fixed/20261007/037-case-study-verification.md)
and `output/playwright/task-037/` for scope, results and limitations.
