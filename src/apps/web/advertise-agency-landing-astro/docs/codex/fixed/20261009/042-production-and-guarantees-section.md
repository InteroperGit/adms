# Implement the production and guarantees section

**Status:** Implemented; archived at user request 2026-10-09.
Detailed agency evidence and terms remain subject to approval.

**Priority:** Priority 2

**Created:** 2026-10-09

**Depends on:**
[Task 041](041-production-and-guarantees-content.md) and the existing homepage
section order and content-validation conventions.

## Goal

Implement a mostly static Astro section presenting publication-ready,
truthful production evidence, quality checks, warranty terms, and maintenance
options. The section must be ready to publish when Task 041 supplies approved
agency inputs.

## Scope and acceptance

- Add a dedicated section component to `src/pages/index.astro` immediately
  after `OrderingProcess` and before `Reviews`, as specified by the
  [sales and SEO plan](../../plan/sales-and-seo-plan.md).
- Render the Task 041 content through the shared typed loader and schema
  patterns; keep agency copy and media out of hardcoded component markup.
- Use complete, ready-to-use text from the approved Task 041 contract. Do not
  render lorem ipsum, placeholder wording, invented examples, fake reviews,
  fabricated guarantees, or text that describes missing content as fact.
- If an agency input is still missing, keep the corresponding content out of
  the publication build and expose the missing approval through validation;
  do not replace it with generic filler text.
- Show approved workshop and team photos with meaningful captions and alt
  text. Use responsive image sizing and explicit dimensions to avoid shifts.
- Generate any new illustrative assets from declared data using vector SVG
  source files. Use the project's Sharp dependency to rasterize and inspect
  generated derivatives (dimensions, color space, and decoding) when a raster
  derivative is required. Do not describe generated illustrations as workshop
  or team photographs, completed projects, or documentary evidence.
- Keep generated asset source, generation command/script, inputs, license,
  and output dimensions recorded in the task handoff. Do not use random or
  fabricated content to make an illustration appear authentic.
- Present materials and quality checks with the evidence that supports them.
- Make warranty coverage, duration, conditions, exclusions, and the service
  request path readable; keep maintenance scope and costs clearly stated.
- Publish only approved agency warranty and maintenance terms, keeping any
  manufacturer warranty clearly identified as a separate component term.
  Never infer a duration, coverage, exclusion, or response time from common
  industry practice or an Internet example.
- Omit unavailable optional material cleanly. A draft/demo notice may be used
  during development only and must not be presented as final customer copy.
- Provide a native link to the existing inquiry form for production,
  warranty, or maintenance questions without implying verified delivery.
- Follow existing heading, theme-token, responsive-layout, and alternating
  section-surface conventions, including after optional sections are omitted.
- Preserve semantic reading order, visible keyboard focus, and usable links
  with JavaScript disabled and reduced-motion preferences.
- Apply the project Astro, code-style, and media conventions. Keep any browser
  behavior narrowly scoped; static content must not depend on JavaScript.

## Evidence and handoff

Record changed files, final visible text, content-contract decisions, media
handling, Sharp generation inputs/outputs, source citations, and any
remaining approval dependencies. Verify that every visible factual statement
has an agency source or an explicitly identified manufacturer source. Run
`pnpm check`, `pnpm build`, and relevant content checks, then hand the section
to [Task 043](043-production-and-guarantees-verification.md).

## Implementation handoff

Implemented the section in
`src/components/sections/ProductionAndGuarantees.astro` and inserted it after
`OrderingProcess` and before `Reviews` in `src/pages/index.astro`. The section
reads `src/content/production-and-guarantees.ts` and always shows approved-
independent customer guidance cards. Agency-specific operations, materials,
quality checks, warranty terms, maintenance, and photos render only when their
approval state is `approved` and the contract is publication-ready. This keeps
pending agency inputs out of visible claims while making the section
discoverable on the homepage.

The contract at `src/data/content/production-and-guarantees.json` contains no
photos and no approved claims. No new visual asset was needed, so no SVG source,
Sharp raster derivative, or generation script was added. If agency photos are
approved later, the contract requires source, rights, dimensions, alt text, and
captions before they can render.

Verification passed: `node scripts/verify-content-invariants.mjs`, `pnpm check`,
and `pnpm build` after the visibility update. The check output retains one
pre-existing hint in
`output/playwright/task-018/matrix.js`; no new diagnostics were introduced.

## Interactive feedback — 2026-10-09

Guidance, production evidence, and warranty cards now highlight on pointer
hover and keyboard/tap focus. Native focus keeps the content accessible with
JavaScript disabled. Selection uses a tinted surface and accent border without
layout movement; keyboard focus has a separate outline. Reduced-motion
preferences disable the colour transitions.

Archived at user request together with Tasks 041 and 042a. This archive does
not approve missing detailed agency terms or documentary photos.
