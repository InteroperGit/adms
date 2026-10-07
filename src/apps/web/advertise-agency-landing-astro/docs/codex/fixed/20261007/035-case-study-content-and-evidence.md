# Prepare expanded case study content and evidence

**Status:** Archived at user request; technical work verified

**Priority:** High

**Created:** 2026-10-07

**Depends on:** Agency records and approved installation photos.

## Goal

Prepare content for Expanded case studies in the
[sales and SEO plan](../../plan/sales-and-seo-plan.md).
Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable development rules.

## Scope

- Audit the three existing records in `data/content/projects.json`. Preserve
  numeric IDs and URLs where practical. Photos are Picsum placeholders and
  growth claims of 30%, 50%, and 20% have no recorded supporting evidence.
- Collect customer task, installation context and constraints, materials,
  dimensions with units, included work, and production time. Distinguish
  production duration from design, installation, and total delivery time.
- Obtain verified outcomes and sources. A documented installation or functional
  result is sufficient; business growth figures require evidence and permission.
  Remove or withhold unsupported claims from public copy.
- Collect completed-installation photos with source, usage rights, approval,
  alt text, dimensions, captions, and crop guidance. Confirm customer naming
  permission or an approved generic description. Demo media is not real work.
- Extend existing project types, strict schema, and shared-parser loader for
  structured details and photos; avoid a duplicate detail-page catalog.
- Record evidence and approvals for copy, specifications, timing, outcomes,
  attribution, and images. Keep demo/draft status separate from real approval.
- Define consistent visibility for cards, generated routes, and their consumers.
  Specify empty/partial/unapproved behavior. Preserve honest limited/demo
  pages where practical; omitted routes must have no dangling public links.
- Audit pricing-link validation against actual generated project destinations.
- Document editing, evidence, publication rules, and missing agency inputs in
  `docs/site/` for [task 036](036-expanded-case-study-pages.md).

## Acceptance and verification

- Production-ready cases have all six plan details and genuine approved photos
  with evidence recorded. Visible demo material carries explicit notices.
- Validate unique IDs, text, dimensions/units, timing, image metadata, approval
  consistency, and links. Exercise full/draft/empty cases and meaningful errors
  with temporary fixtures; restore original data exactly.
- Run `pnpm check`, `pnpm build`, and diff checks. Verify project consumers and
  pricing links remain consistent with generated destinations.
- Record results and missing real inputs. Technical content-layer completion
  does not establish agency approval or production acceptance.
- Archive after acceptance and update plan links/status under task rules.

## Implementation record (2026-10-07)

Implemented in a subagent at the user's request; no commit or publication.

- Audited IDs 1-3 and preserved their existing destinations as labelled demos.
  Removed unsupported completed-work descriptions, customer names, sizes,
  timing and 30%/50%/20% growth claims from public case copy. Removed unrelated
  Picsum placeholders; current cards and pages are intentionally text-only.
- Added structured detail, dimension/unit, separate production timing, photo,
  evidence and publication contracts with strict nested schemas and type checks.
  Genuine published cases require complete details, outcome evidence, all five
  approvals and actual installation photos with rights and approval records.
- One shared visible export supplies cards and static paths. Drafts have no
  cards/routes; demos have notices and no genuine evidence/outcome assertions.
  Empty content retains the homepage anchor and an explicit empty state.
- Genuine pricing links accept only generated published agency destinations.
  Demo/draft routes cannot substantiate genuine pricing; existing pricing demos
  have no project links and retain their current behavior.
- Added [case study editing and handoff](../../../site/case-studies.md), including
  the legacy audit, evidence rules, publication policy and task 036 contract.
  Updated content, media, pricing, deployment guides and the documentation index.

### Verification

- `node output/task-035/verify.mjs`: 34 fixture checks passed. Covered full
  published, draft, partial and empty data through actual content wrappers;
  duplicate IDs; source-aware text, dimension/unit, timing, photo, crop, date
  and approval errors; demo outcome/attribution/evidence rejection; and genuine
  pricing destination rejection for demo/draft/missing cases. Fixtures were
  supplied only through a temporary module loader; the JSON bytes were unchanged.
  The local helper is ignored verification evidence, not an application API.
- `pnpm check`: passed, zero errors/warnings. One pre-existing unused-variable
  hint in `output/playwright/task-018/matrix.js` remains.
- `pnpm build`: passed, 11 pages including all three stable demo project routes.
- Generated HTML: three matching homepage links/routes and exact Russian demo
  notices verified; no project Picsum images, unverified growth claims or result
  sections. No corrupted question-mark text in visible page markup. Existing
  JavaScript nullish operators are excluded from that text check.
- All changed code/JSON lines are at most 80 characters. Diff whitespace checks
  passed; Git reports only ordinary LF/CRLF conversion notices.

### Open production acceptance

No genuine agency records, completed-installation photos, usage rights,
customer attribution permission or agency approvals were supplied. Production
acceptance is not complete: obtain the inputs listed in the editing guide and
verify them against each real case before publishing. This task was previously kept in
`todo/` pending agency acceptance. Task 036 still owns expanded
presentation and inquiry actions; task 037 owns their browser verification.

## Archive record (2026-10-07)

Moved to `fixed/20261007/` at the user's request with tasks 035-037.
Technical verification is recorded above and in task 037. Genuine agency
approvals, photo rights, and live submission remain production dependencies.
