# Add Manufacturing and Installation to project case studies

**Status:** Completed (development implementation verified 2026-10-07)

**Priority:** High

**Created:** 2026-10-07

**Depends on:** [Task 036](036-expanded-case-study-pages.md).

## Goal

Show how a project is manufactured and installed through useful text and
images on `src/pages/projects/[id].astro`, under the
[sales and SEO plan](../../plan/sales-and-seo-plan.md).

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable development rules.
Apply astro-best-practices and frontend-design during implementation.

## Scope

- Add optional `manufacturing` and `installation` content sections to the
  validated project contract. Use English field names and visible headings:
  **Manufacturing** and **Installation**. Keep descriptive copy in Russian
  to match the site's audience.
- Each section supports substantial text and multiple images with alt text,
  captions, dimensions, and the existing media provenance fields.
- Manufacturing explains material preparation, fabrication, lighting or
  assembly, finishing, and quality checks relevant to that project.
- Installation explains site preparation, positioning, mounting, electrical
  connection where relevant, final checks, and handover to the customer.
- Treat all case study content sections as optional. Omit absent, null, and
  empty sections entirely, including headings, containers, and spacing.
  Render supplied text or images even when the other content type is absent.
  Validate meaningful content; do not render blank paragraphs or galleries.
- Preserve the current title, compact customer/year metadata, and direct
  transition to the lead image. Put the new sections in the case study body,
  with Manufacturing before Installation. Preserve existing inquiry links.
- Populate both new sections for all three development projects with full,
  distinct selling copy and suitable preview images so the complete layout
  can be reviewed immediately. Explain concrete choices and customer value;
  avoid generic filler, unsupported metrics, or invented completed work.
- Keep development content within the existing non-approved data status.
  Preview imagery and proposed copy do not establish actual agency work,
  media rights, or publication approval. Do not add fabricated evidence.
- Reuse the static image pipeline, reserved image geometry, responsive
  layouts, and existing theme tokens. Support both themes and narrow screens
  without client-side JavaScript. Do not add a carousel or hidden text.
- Update the content guide with the new fields and omission behavior.

## Acceptance and verification

- All three development pages show complete Manufacturing and Installation
  sections with readable text, images, and captions in the intended order.
- Missing, null, and empty data produces no section heading, empty panel,
  broken image, or leftover spacing. Check text-only and image-only cases.
- Existing optional case study sections follow the same omission behavior;
  title, attribution, navigation, and inquiry actions remain usable.
- Verify image loading, heading hierarchy, alt text, keyboard navigation,
  narrow/wide layouts, both themes, and no horizontal overflow.
- Run `pnpm check`, `pnpm build`, and changed-source style/diff checks.
  Record verification for [task 037](037-case-study-verification.md).
- Keep this task pending until implementation and verification are complete;
  archive according to the task-management rules after acceptance.

## Implementation and verification (2026-10-07)

- Added optional Manufacturing and Installation with Russian project-specific
  copy for all three records. Reused local service illustrations, with explicit
  diagram captions and null rights/approval; no completed work was fabricated.
- Added a shared static ProjectProcess component with a responsive text/image
  layout. Text-only and image-only content renders without empty columns.
  Images reuse ProjectPhoto and Astro variants, intrinsic geometry, and lazy
  loading. English headings declare their language; no hydration was added.
- Existing narrative, benefits, results, specifications, and timing now omit
  empty data. Details may be absent/null; empty lists and timing objects render
  no section. Empty reading/facts columns and whole overview containers vanish.
- Preserved compact customer/year metadata, lead photos, breadcrumbs, and
  inquiry navigation. Process media uses the existing publication/provenance
  gates. Published evidence requirements remain; visible sections are optional.
- `pnpm check`: zero errors/warnings, one pre-existing task-018 helper hint.
- `pnpm build`: passed, 11 static pages and 28 image variants.
- `schema.mjs`: 14 validation checks passed for optional data, blank text,
  invalid dimensions, demo approval restrictions, and published photo rights.
- `fixtures.mjs`: 80 generated-page checks passed for absent/null/empty data,
  text-only/image-only sections, process order, attribution and inquiry links.
  Fixture builds do not mutate source data.
- Playwright: all three cases at 320/768/1440px in both themes passed image
  decoding, heading/alt checks, and horizontal overflow checks. Keyboard Enter
  reaches the inquiry anchor; content/navigation also work without JavaScript.
- Four process screenshots saved; desktop light and mobile dark reviewed.
  External HTTPS requests were aborted in the main browser matrix, so these
  checks establish local process image loading, not legacy remote reliability.
- Source 80-character, encoding, and diff checks passed. A temporary copy
  encoding error was corrected and verification rerun before completion.
- Evidence: `output/playwright/task-036a/` (ignored helpers and screenshots).
  Content guide updated. Task 037 retains broader regression verification;
  genuine agency content acceptance remains separate from this preview task.
