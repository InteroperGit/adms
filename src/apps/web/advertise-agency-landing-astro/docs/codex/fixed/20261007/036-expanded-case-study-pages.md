# Implement expanded case study pages and project cards

**Status:** Archived at user request; technical work verified

**Priority:** High

**Created:** 2026-10-07

**Depends on:** [Task 035](035-case-study-content-and-evidence.md).

## Goal

Help visitors assess similar projects and reach the inquiry form under the
[sales and SEO plan](../../plan/sales-and-seo-plan.md).
Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and code-style, Astro, and server
rules. Apply frontend-design and astro-best-practices during implementation.

## Scope

- Upgrade `src/pages/projects/[id].astro` using task 035's validated contract.
  Preserve static generation and numeric URLs unless publication rules require
  documented omission. Keep breadcrumbs and return-to-projects navigation.
- Show task/context, materials/dimensions, production time with its defined
  scope, completed-installation photos, and verified outcome. Use semantic
  sections with one visible H1, approved attribution, and photo captions.
- Omit unavailable optional details cleanly; display required demo/draft
  notices. Placeholder imagery and unsupported results cannot imply real work.
- Add a native "Заказать похожий проект" action linking to `/#order-inquiry`.
  Retain contact access. Avoid an extra form, nested links, or delivery claims.
- Update `ProjectCard.astro` and Projects with the same eligible collection
  and truthful summaries. Preserve `id="projects"`, heading hierarchy,
  offers-first order, and rendered section background alternation.
- Use a static photo layout with reserved geometry, responsive sources,
  alt/captions, appropriate crops, and loading priorities. Reuse Astro image
  handling for bundled originals. Keep text/actions useful if an image fails.
- Reuse tokens, typography, containers, and controls. Support both themes,
  narrow screens, long Russian text, and enlarged text. All details and
  inquiry navigation remain available without JavaScript.
- Supply descriptive page titles/descriptions using existing conventions.
  Production-domain setup remains separate plan work.
- Audit homepage, pricing, and other project links against generated routes.
  Do not associate fictional pricing with unrelated genuine work.

## Acceptance and verification

- Eligible cases show all required details/photos; cards and detail pages
  follow the same publication, omission, and notice rules.
- Supported URLs, breadcrumbs, and actions resolve. Inquiry arrival clears
  the sticky header; reaching the existing disabled form proves no receipt.
- Empty/partial data adds no broken links, empty panels, or misleading claims.
  Temporary fixtures never persist as agency-approved data.
- Run `pnpm check`, `pnpm build`, and diff/line-length checks. Inspect generated
  headings, metadata, content, and destinations. Record results and missing
  inputs for [task 037](037-case-study-verification.md).
- Archive after acceptance and update plan links/status under task rules.

## Implementation and verification (2026-10-07)

- Expanded existing static project pages with task/context, constraints,
  materials, numeric dimensions with Russian units, included work, separate
  production duration/basis and optional design/installation/total timing.
  Verified outcome and unknown-section omission follow task 035's contract.
- Added opening and closing native similar-project inquiry actions. Preserved
  breadcrumbs, return/contact navigation, descriptive title/description, one
  H1 and all three demo URLs. The inquiry form remains disabled.
- Added shared `ProjectPhoto.astro`: bundled raster originals use Astro
  responsive variants, captions, stable intrinsic frames and eager/high lead
  priority; later images are lazy. Public/remote sources use supplied URLs and
  dimensions without a variant generator. Missing bundled originals fail clearly.
- Cards reuse the photo component with focal-position 3:2 cropping. Detail
  galleries retain full framing and captions. No hydration or scripts added.
  Existing themes/tokens, section order and shared eligibility remain intact.
- Current data remains three text-only demos with visible notices. No real
  project details, rights, approvals or installation photos were invented.

### Checks and evidence

- `pnpm check`: zero errors/warnings; existing unused-variable hint remains
  in ignored `output/playwright/task-018/matrix.js`.
- `pnpm build`: passed, 11 pages and 20 existing image variants.
- `node output/playwright/task-036/fixtures.mjs`: 32 generated checks passed
  for full/partial/empty catalogs, draft omission, all details, captions,
  responsive variants, loading priorities, card focal position, private evidence
  omission and inquiry links. Vite injects fixtures into isolated output builds;
  checked-in JSON bytes remain unchanged. Fixture approvals/images are test data.
- Focused Playwright: demo and full fixture at 320/1440px in both themes have
  no horizontal overflow; fixture photos decoded. Enter on the demo inquiry
  action reached the form with sticky-header clearance in four cases. Native
  navigation also passed at 320px without JavaScript. These are implementation
  checks; task 037 retains broader accessibility/regression verification.
- Four full-fixture screenshots in `output/playwright/task-036/`; desktop
  light and mobile dark reviewed. Helpers: `fixtures.mjs` and `browser.js`.
  Unrelated HTTPS resources were aborted in browser checks; remote image
  reliability and inquiry receipt are not established by these checks.
- A number-formatting edit caused a temporary dev-page error; corrected the
  fraction option and reran fixture/browser checks. An initial CLI script
  quoting error was resolved with `run-code --filename`. Neither remains.
- Diff and changed source 80-character checks passed.

### Remaining acceptance and task 037 handoff

Task 035 still needs agency evidence, real details, photo rights and approvals.
This implementation is ready for those inputs, but production case acceptance
remains pending. Do not treat isolated test fixtures
as approved cases. Task 037 should check all project URLs, 768px layouts,
enlarged/long text, contrast, keyboard focus, empty/partial states, missing
images, both no-JavaScript system themes and surrounding regressions. Successful
inquiry delivery remains independent work.

## Archive record (2026-10-07)

Moved to `fixed/20261007/` at the user's request with tasks 035-037.
Technical verification is recorded above and in task 037. Genuine agency
approvals, photo rights, and live submission remain production dependencies.
