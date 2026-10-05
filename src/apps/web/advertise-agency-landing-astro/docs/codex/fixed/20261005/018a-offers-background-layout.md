# Full-width offers with background images and editable descriptions

**Status:** Completed 2026-10-05

**Priority:** Medium

**Dependency:** 018. Implement before 019.

Read the [carousel plan](../../plan/20261005_044149_plan.md),
[task guide](../../task-management.md),
[offers guide](../../../site/offers-carousel.md),
[content guide](../../../site/content.md) and
[project instructions](../../../../AGENTS.md). Apply astro-best-practices,
frontend-design and Playwright guidance; consult the required Astro component,
styling and content guides.

## Requested change

The offers component must span the full width of the site. Each offer's image
must cover its entire slide area, with a contrasting description over the
background. Content editors must be able to change description font size, text
color and position through JSON. Populate `data/content/offers.json` with test
data and remote stock-image backgrounds. The existing filename is plural
(`offers.json`).

## Scope

- Rework `src/components/sections/OffersCarousel.astro` into a full-width layout
  below the header and above About. Backgrounds extend edge to edge; inner text
  may align to the site's existing content gutters. Remove the separate
  image/copy columns. Each image covers the whole offer area on desktop and
  mobile, with intentional cropping and reserved geometry. Let long or enlarged
  copy expand the slide without clipping.
- Render the title, description and real CTA over the image. Keep description
  text readable over bright, dark and busy photos in both themes. Use a reliable
  contrasting backing/overlay or equivalent treatment; do not rely on the photo
  itself for contrast. Preserve clear CTA and keyboard-focus contrast when text
  colors change.
- Add JSON-editable presentation settings for description font size, text color
  and position. Document units, allowed values, defaults and mobile behavior.
  Provide useful horizontal and vertical positions, such as top/center/bottom
  and left/center/right. Validate numeric ranges, safe color formats and
  position choices; never accept arbitrary CSS strings. Update plain domain
  types and executable validation together, retaining bidirectional
  item/aggregate compatibility checks and adding checks for any new nested
  contract.
- Preserve strict validation, safe URLs, duplicate-ID checks, image metadata,
  interval defaults, editorial order and enable flags. Keep older records valid
  through documented presentation defaults where appropriate. Preserve the
  hidden homepage h1 and an accessible section/offer heading hierarchy.
- Fill `data/content/offers.json` with at least two clearly identified test
  offers showing different description settings. Use truthful existing service
  copy or explicit demo copy, without invented discounts, deadlines or client
  results. Make the test preview visible and document that the checked-in
  content is demonstration data rather than approved promotions. Retain these
  test records after verification as requested.
- Use direct HTTPS image URLs from web image libraries/stock-photo sources in
  each offer's `image` field. Do not download, generate or add local background
  assets. Keep CTA `href` separate from the background source. Verify image URLs
  actually load in the browser, record photographer/source-page links and
  applicable usage terms in the offers guide, and identify stock images as demo
  backgrounds rather than agency work.
- Keep the static single-item layout and readable stacked multiple-item
  fallback. Navigation, dots and autoplay remain tasks 019–020; do not add
  nonfunctional controls. Account for failed/slow remote images so copy and CTA
  remain readable and geometry stays stable.
- Update the offers/content guides and carousel plan to describe the new layout,
  JSON settings, remote-image sources and retained demo configuration. This task
  supersedes task 018's separate image/copy composition and temporary-preview
  restoration requirement.

## Acceptance

- Verify full-width slides and whole-area background coverage at
  320/375/768/1440px in both themes. Check description positioning,
  font-size/color changes, wrapping, real CTA links, headings, keyboard focus
  and absence of horizontal overflow.
- Exercise long text, 200% text enlargement, bright/dark/busy backgrounds,
  slow/failed image requests, zero/one/multiple enabled items and the
  no-JavaScript fallback. Record native browser zoom separately from text-size
  simulation. Validate contrast for supported text/backing combinations.
- Run targeted schema/default regressions for the new settings, including
  invalid size/color/position, unknown fields and preserved existing offer
  rules. Confirm defaults and domain/schema compatibility through type checking.
- Run `pnpm check`, `pnpm build` and diff checks. Capture representative
  screenshots and verification scripts/results under ignored
  `output/playwright/task-018a/`. Use the instructed Astro background-server
  workflow.
- Keep the requested remote-image test data in `offers.json`; remove only
  temporary stress fixtures used for verification. Record changed files, actual
  checks, image-source attribution and limitations. Archive by actual completion
  date and update the plan when complete. No commit or deployment is implied.

## Completion record

Implemented edge-to-edge whole-slide remote image backgrounds, adaptive opaque
contrast backing, validated/defaulted JSON presentation
size/color/horizontal/vertical settings, and optional visible
image/source/license credits. Retained two enabled explicit demo records with
factual service copy and actual browser-loaded Wikimedia Commons URLs. No local
background assets, controls, commit or deployment.

Verification: 119 schema/parser/wrapper assertions; 16 Chrome
theme/viewport/text combinations; nine position/color combinations; four
long/unbroken 200% text stress cases; zero/one/global/all-disabled server
rendering; held/failed uncached remote images; both-theme JavaScript-disabled
fallback; keyboard focus/headings/CTA destinations. Evidence
scripts/results/screenshots: ignored output/playwright/task-018a/. Root text
scaling is not native zoom; native zoom was not exercised. Background server
refreshed through instructed workflow and left running. See offers guide for
exact dimensions, contrast measurements, source/license links and limitations.

Changed files: OffersCarousel.astro, offers.json, types/offer.ts,
types/index.ts, validation/offers.ts, offers/content guides and carousel plan.
Preserved preexisting task-018 implementation/documentation changes. pnpm
check/build/diff validation completed with six pages built; check reports one
preexisting hint in ignored task-018 evidence, zero application errors/warnings.
