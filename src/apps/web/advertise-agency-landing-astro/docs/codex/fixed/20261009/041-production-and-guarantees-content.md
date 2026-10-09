# Prepare production and guarantees content and evidence

**Status:** Implemented; archived at user request 2026-10-09.
Agency approval of detailed evidence and terms remains pending.

**Priority:** Priority 2

**Created:** 2026-10-09

**Depends on:**
Agency-confirmed production practices, warranty and maintenance terms, and
approved workshop and team photographs with publication rights.

## Research baseline for the draft

Use the following public manufacturer information as a research baseline and
question list. It is reference material for drafting, not evidence that the
agency uses these products or offers these terms:

- 3M describes its MCS warranty as applying only to eligible combinations of
  3M films, inks, printers, applications, and finished graphics. See the
  [3M graphics warranty resources](https://www.3m.com/3M/en_US/graphics-signage-us/resources/warranties/)
  and the [3M warranty bulletin](https://multimedia.3m.com/mws/media/1034875O/3m-graphics-warranties-warranty-bulletin.pdf).
  Ask which substrate, film, ink, and installation combinations the agency
  actually supplies before mentioning a manufacturer warranty.
- 3M's signage brochure lists coverage of up to nine years for eligible
  finished graphics, subject to its warranty matrices. Treat this as a
  product-specific example, never as the agency's warranty period.
- SloanLED publishes product-specific periods ranging from 60 months to
  120 months or a limited “life of sign” period for selected LED modules;
  power supplies and conditions can differ. See its
  [global limited warranty](https://sloanled.com/downloads/SloanLEDGlobalLimitedWarranty.pdf).
  Ask for the exact LED and power-supply models and the applicable installer
  requirements before making a duration claim.
- A common sign-contractor warranty structure covers defects in materials and
  workmanship for a stated period, with exclusions for relocation, alteration,
  misuse, or excluded technologies. The [Signature Signs three-year example](https://www.sigsigns.com/warranty)
  is a market example only; do not copy its duration or exclusions without
  legal and agency review.
- Common maintenance guidance includes scheduled visual inspection, gentle
  cleaning with manufacturer-compatible products, checking fasteners and
  seals, and prompt reporting of failed illumination or damage. Confirm the
  agency's actual service scope, customer responsibilities, pricing, and
  safety limits before publication.

## Goal

Prepare truthful content for Production and guarantees in the
[sales and SEO plan](../../plan/sales-and-seo-plan.md). Establish trust through
specific information and evidence about the agency's work.

## Scope and acceptance

- Obtain real workshop and team photographs; record their source, publication
  rights, approval, captions, alt text, and image dimensions.
- Confirm which production operations the agency handles and which, if any,
  involve partners. Do not imply ownership of facilities without evidence.
- Describe materials used for relevant services and explain their selection
  without inventing brands, certifications, or performance claims.
- Document actual quality checks, when they occur, and what they verify.
  Associate each quality claim with agency confirmation or specific evidence.
- Obtain actual warranty terms: covered products/work, duration, start date,
  conditions, exclusions, and how customers request warranty service.
- Confirm maintenance and repair options, availability, scope, and whether
  they are included or quoted separately. Avoid unsupported response times.
- For each proposed warranty statement, record whether it is an agency
  workmanship warranty, a component manufacturer's warranty, or both. Keep
  duration, exclusions, claim route, and maintenance obligations separate.
- Cite manufacturer documents in the internal content handoff when they are
  used to explain a component; do not present third-party warranty language as
  the agency's promise.
- Prepare concise homepage copy and a readable presentation of the terms;
  preserve qualifications that affect the customer's decision.
- Follow the existing typed JSON, Zod validation, and content-loader patterns.
  Record approval state and unresolved inputs explicitly in the contract.
- Keep unapproved claims and placeholder photos out of production evidence.
  Any draft or demo must be clearly labelled and retain pending approvals.

## Evidence and handoff

Record approved copy, photo sources/rights, evidence references, warranty
terms, maintenance scope, and unresolved agency questions in this task or a
linked content handoff. Identify the final contract and media for
[Task 042](042-production-and-guarantees-section.md).

Run relevant content checks when implementing the contract. Content approval
remains pending until the agency confirms the publication material; technical
preparation alone does not establish production acceptance.

## Implementation handoff

The draft contract is implemented in
`data/content/production-and-guarantees.json`, with the typed domain model in
`src/types/production-and-guarantees.ts`, Zod validation in
`src/validation/production-and-guarantees.ts`, and the parsed loader in
`src/content/production-and-guarantees.ts`. The type barrel exports the new
content types from `src/types/index.ts`.

The contract keeps production operations, materials, quality checks, photos,
agency workmanship terms, component manufacturer terms, and maintenance
separate. Every evidence item has a draft/approved state. Warranty entries
record coverage, duration, start conditions, exclusions, claim route, source
type, and source reference. The initial record is demo mode with no photos,
no approved copy, and explicit pending agency questions; manufacturer links
remain research references rather than agency promises.

Verification completed with `node scripts/verify-content-invariants.mjs`,
`node scripts/check-code-style.mjs`, and `astro check` (zero errors; one
pre-existing unused-variable hint in `output/playwright/task-018/matrix.js`).
The equivalent `pnpm verify:content` and `pnpm check:style` commands were
blocked by the sandbox's `EPERM` access to `C:\\Users\\maxsi` while pnpm
initialised its environment; their underlying scripts passed directly.
