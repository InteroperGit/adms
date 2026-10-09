# Verify the production and guarantees section

**Status:** Completed technical verification, 2026-10-09

**Priority:** Priority 2

**Created:** 2026-10-09

**Depends on:**
[Task 041](041-production-and-guarantees-content.md) and
[Task 042](042-production-and-guarantees-section.md), and
[Task 042a](042a-customer-guarantees-presentation.md).

## Goal

Verify that the production and guarantees section provides accurate evidence
and clear terms, renders accessibly, and fits the existing homepage.

## Scope and acceptance

- Confirm the section appears once, after OrderingProcess and before Reviews.
- Compare materials, production responsibilities, quality checks, warranty
  terms, and maintenance options against the Task 041 approved handoff.
- Confirm real workshop/team photos match their captions and have recorded
  publication rights. Verify image loading, aspect ratios, alt text, and
  responsive sizing; placeholder media must not imply production evidence.
- Check approval handling and missing optional content with representative
  fixtures. Reject invalid content and unsupported publication states.
- Verify warranty qualifications remain visible and readable, and that
  maintenance is not implied to be free or covered unless confirmed.
- Test desktop, narrow mobile, short landscape, both themes, and enlarged
  text for overflow, clipping, contrast, and readable spacing.
- Check heading hierarchy, landmark names, reading order, keyboard focus,
  link activation, and sticky-header clearance at the inquiry destination.
- Verify JavaScript-disabled and reduced-motion behavior.
- Confirm inquiry links reach the existing form without asserting successful
  delivery when the endpoint is unavailable.
- Check neighboring OrderingProcess and Reviews sections and alternating
  surfaces for regressions, including optional-section omission.
- Run `pnpm check`, `pnpm build`, `pnpm verify:content`, and relevant built
  quality and browser checks.

## Evidence and completion

Record tested URLs, fixtures, viewport/theme cases, assertions, screenshots,
and limitations under the ignored output folder. Distinguish technical
verification from agency approval, photo rights, and inquiry delivery.

Archive accepted tasks under `docs/codex/fixed/YYYYMMDD/` using the local
completion date, and update task links, plan status, and `.codex/TASKS.md`.
Keep unresolved production dependencies explicit; passing layout checks does
not approve agency claims or warranty terms.

## Verification handoff, 2026-10-09

Verified the current six-card customer guarantees presentation at
`http://localhost:4321/` and its native `/#order-inquiry` destination.
The contract and minimum one-year whole-sign warranty statements come from
the user's explicit instructions. The other four brief workflow statements
are proposed copy; this technical review does not establish their factual
approval. Detailed production, materials, checks, warranty and maintenance
records remain draft and unpublished. No workshop/team photos are supplied;
photo rights, captions and documentary loading cannot yet be verified.

- 75 Playwright browser assertions pass across 12 layout/theme/text cases:
  1440x1000 desktop, 320x760 mobile and 667x375 landscape; light/dark;
  normal and 200% root text. All guarantees cards fit without clipped text.
- Both no-JavaScript system themes retain all six cards and inquiry access.
  Reduced-motion media is enabled throughout the matrix; the guarantees
  section has no client script or animation of its own.
- Five unique local SVG masks load successfully. Icon boxes align by card
  padding; screenshots confirm normalized drawing alignment. Dark icons use
  `rgb(255, 160, 77)`, the shared orange primary token.
- Measured text contrast is at least 5.81:1 light and 7.95:1 dark.
- Single named guarantees landmark, one H2 and six H3 headings verified.
  Section appears once, immediately after OrderingProcess and before Reviews.
- Keyboard focus is visible; Enter reaches the existing inquiry form with
  sticky-header clearance. The unavailable submit endpoint remains disabled;
  no live submission or delivery claim was tested.
- 24 schema/content/generated-HTML fixture assertions pass, including unsafe
  inquiry links, unknown approval states, duplicate IDs, missing guidance,
  unsupported icons, blank photo metadata, invalid approval references,
  approved demo and approved pending-source warranty rejection.
- Approved-copy fixture with no pending-input placeholders is accepted;
  remaining optional detailed draft records stay permissible and hidden.
- `pnpm check` passes with zero errors/warnings and one pre-existing hint in
  `output/playwright/task-018/matrix.js`. `pnpm build` generates 11 pages.
  Content invariants pass for 13 files; built quality passes for 11 routes.

Fixed accessible landmark naming, mobile/enlarged-text card and CTA overflow,
and the schema's approved-warranty source and pending-input handling.
Evidence and replay scripts are in `output/playwright/task-043/`.
Locator screenshots are section crops; browser chrome, sticky-header and
Astro dev-toolbar overlays can appear in captured crops and are not page
content. Assertions use DOM geometry and computed styles independently.

## Limits and remaining production inputs

Unrelated external placeholder media failed during the initial inspection.
The deterministic matrix blocks external HTTPS requests; local SVG responses
are verified independently. No assertions approve existing testimonial or
stock-image content elsewhere on the page.

At 320px with 200% root text, the neighboring OrderingProcess inquiry button
still widens the overall document. Guarantees cards and its button fit the
viewport; this existing adjacent-section issue is recorded separately.
Optional-section alternation is governed by the existing `nth-of-type`
homepage rules; no temporary content mutations or approved-detail browser
fixtures were published during this verification.

Full coverage, start dates, exclusions, maintenance pricing, manufacturer
terms, actual materials/responsibilities, real photos and publication rights
still require agency input. Tasks 041/042/042a retain their separate approval
status. Task 043 is archived as technical verification of the current
presentation, following the Task 040 convention, not production acceptance.
