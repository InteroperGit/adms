# Verify the homepage pricing examples

**Status:** Completed — demo verification passed

**Completed:** 2026-10-07

**Priority:** High

**Created:** 2026-10-07

**Depends on:**
[Task 033](033-pricing-examples-section.md) — completed.

**Implementation evidence:** `output/playwright/task-033/`; six theme/width
cases, enlarged text, image failure, keyboard/inquiry links, empty/draft and
dated-price fixtures, and a no-JavaScript flow. See task 033 for limits.

## Demo verification update — 2026-10-07

Task 032 now supplies user-requested fake data and test photos. Verify the
enabled demo, visible Russian notices, fictional-price labels, local image
loading, and retained false agency-approval flags. Demo acceptance replaces
the real-content approval requirements below for this delivery. Record real
pricing and project approvals as future production work, without blocking
demo completion. Keep the technical and inquiry-link checks below.

## Goal

Verify that visitors can assess real example budgets and reach the inquiry
form, fulfilling “Priority 1: Pricing and examples” in the
[sales and SEO plan](../../plan/sales-and-seo-plan.md).

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable development rules.
Use the Playwright skill for browser checks and follow development-server
rules when starting, reusing, or stopping the server.

## Scope and acceptance

- Check each published example against its recorded agency approval:
  completed project, dimensions, materials, included work, exclusions,
  price/range, currency, price date/context, and applicable conditions.
  Confirm image provenance, rights, relevance, and approved wording.
- Verify cost factors and individual-estimate guidance match approved copy.
  Ensure no demonstration article or image is presented as completed work.
- Review screenshots in light/dark themes at 320px, 768px, and desktop
  widths. Check price/specification hierarchy, readable conditions, photo
  crops, spacing, and page/section horizontal overflow.
- Check enlarged text, long Russian copy, exact/range prices, and zero,
  one, and multiple examples. Use temporary fixtures when needed and
  restore them afterward. Record fixture coverage separately from actual
  publication acceptance and distinguish text enlargement from browser zoom.
- Confirm Projects → Pricing examples → Reviews, alternating rendered
  surfaces, one homepage H1, and logical section/example headings.
  Empty/draft states must not leave an empty section or navigation target.
- Check real image requests, decoding, alt text, reserved dimensions,
  responsive sizes, loading behavior, and meaningful crops. Failed images
  must leave example specifications, prices, and actions readable.
- Verify contrast, forward/reverse keyboard navigation, visible focus, and
  Enter activation for every inquiry action and optional project link.
  Check sticky-header clearance at the form and valid project destinations.
- Repeat essential content and native-link flows without JavaScript.
  Verify the existing unavailable-submission message when delivery remains
  disabled; reaching the form is not proof of inquiry delivery.
- Check header/mobile navigation, theme/settings persistence, offers,
  services, projects, reviews, contacts, cookie UI, and form for regressions.
- Fix findings within pricing scope and repeat affected checks. Run
  `pnpm check`, `pnpm build`, and diff checks after fixes.
- Record evidence paths, routes, viewports, command results, and remaining
  limitations. Do not mark missing approvals or unperformed checks as passed.

## Completion

Archive after acceptance passes, preserving task numbers and updating the
Pricing and examples task links/status in the plan. Report unresolved agency
prices, specifications, photos, and inquiry-delivery dependency explicitly.
Case-study expansion and dedicated SEO pages remain separate plan work.

## Verification results — 2026-10-07

Used the Playwright and astro-best-practices skills, Chromium session
`pricing34`, and the existing background server at `http://localhost:4321`.
Reviewed the pricing components and task 032's content contract. No
application defects requiring source changes were found.

### Demo content and generated HTML

- Three visible examples remain explicitly fictional: facade letters,
  a flat entrance sign, and an interior neon inscription. Their amounts
  render as 65 000–85 000, 18 000, and 22 000–30 000 rubles respectively.
  Exact/range formatting, section demo notice, and adjacent fictional-price
  labels passed checks. No example links to an unrelated real project.
- Generated HTML matches every configured title, description, dimension,
  material, included-work item, exclusion, condition, alt text, cost factor,
  and estimate explanation. Specifications/copy/price/image approvals and
  section copy approval remain false. Source/usage references are recorded.
- The three images are original local site demo illustrations, not genuine
  photographs or images of the exact fictional scopes. Source SVG references
  and demonstration usage are documented in the pricing handoff.
- Generated section has three articles, descriptive inquiry links, visible
  H2/H3/H4 hierarchy, one homepage H1, and no pricing script or hydrated island.
  Bundled source paths resolve to optimized public assets rather than leaking
  `/src/assets/` paths into `<img src>`.

### Responsive layout, contrast and images

- Six actual theme/viewport combinations passed at 320/768/1440px in light
  and dark modes. Reviewed all six section screenshots: readable scopes,
  visible conditions and labels, recognizable centered illustration crops,
  and no horizontal page/section overflow or overlapping pricing content.
- Confirmed Projects → Pricing → Reviews and alternating rendered surfaces
  throughout the homepage in both themes.
- Repeated all six cases with 200% root text, long Russian headings and
  descriptions, extended conditions, and a 100-character unbroken string.
  No page/section overflow; contrast remained above 4.5:1. This is text
  enlargement, not native browser zoom or screen-reader testing.
- Minimum sampled computed text/background contrast was 5.55:1 in light
  mode and 7.02:1 in dark mode, including pricing labels and actions.
  Measurements use opaque computed surfaces with sRGB luminance; they do
  not constitute an independent accessibility certification.
- Each pricing image decoded at all six widths/themes with lazy loading,
  responsive sources/sizes and 50%/50% crops. Sharp also decoded originals
  and confirmed their configured 1200×900 dimensions. The browser observed
  81 successful local optimized-image responses across the homepage visits;
  this total also includes the Services images.
- An intentional missing image retained identical frame width/height and
  readable price/action content. This verifies reserved geometry, not a
  measured cumulative-layout-shift score. The DOM mutation was discarded
  by reload; no missing asset was added to configuration.

### Catalog states, links and no JavaScript

- One/five-example browser-only catalog fixtures at 320px remained within
  the viewport. Reload restored the actual three examples. These fixtures
  verify layout capacity and do not establish approval of additional work.
- Reran task 033's source fixture helper for empty and unapproved-production
  omission, no dangling pricing links, single current/historical dated-price
  rendering, and optional project-link markup. Its `finally` restored
  `pricing.json` byte-for-byte; no temporary approvals remain.
- Forward/reverse Tab order and visible 2px focus outlines passed. Every
  actual inquiry action activated by Enter in all six theme/width cases,
  reaching the existing form with sticky-header clearance.
- Current fictional examples correctly have no project links. A temporary
  browser-only optional link activated by Enter and reached `/projects/1`;
  the existing Projects link also reached that destination. This tests the
  navigation mechanics, not a fictional-to-real project association.
- At 320px in both system themes with JavaScript disabled, all three examples
  rendered and the native inquiry action reached the form. Submission stayed
  disabled and the no-JavaScript feedback remained visible.

### Regressions and tooling

- All 29 regression checks passed: accepted/declined cookie persistence;
  mobile focus wrapping, Escape and anchor closing/focus; settings dismissal;
  light/dark/system theme persistence across reload and project navigation;
  desktop Services navigation clearance; five Services cards and a demo
  service page; a project destination; Reviews; telephone/email links;
  editable inquiry fields with disabled submit and unavailable feedback;
  optional-link activation; manual offers navigation and real autoplay.
- The regression helper initially selected both hidden mobile and visible
  desktop menu links; narrowed it to `:visible`. A subsequent check read
  headings before navigation finished; added explicit URL/heading waits.
  The corrected complete run passed. Neither issue required application edits.
- `pnpm check`: zero errors/warnings and one pre-existing unused-variable
  hint in ignored `output/playwright/task-018/matrix.js`.
- `pnpm build`: passed, 11 static pages and 20 reused responsive image variants.
  Generated-content audit passed. Diff and verification-file line checks
  passed; no dependencies or application implementation changed in this task.

### Evidence and remaining production work

- Helpers and six reviewed screenshots: `output/playwright/task-034/`.
  Browser command output includes six contrast/layout results and the 29
  regression assertions. CLI snapshots/logs are under `.playwright-cli/`.
  Empty/draft/dated-price fixtures reuse task 033's recorded helper.
- Browser HTTPS requests were intentionally aborted to isolate local media
  and anchor behavior from existing unrelated remote placeholders. These
  checks do not establish remote image reliability. Screenshots hide fixed
  header/toolbar/cookie overlays only through capture styles; application
  behavior is unchanged. Temporary DOM fixtures disappeared on navigation.
- Demo acceptance is complete. Genuine agency prices, specifications, copy,
  photos, rights/crops and successful inquiry delivery remain future
  production work. Form navigation is verified; receipt of an inquiry is not.
  No real-content approvals were inferred from these technical checks.
