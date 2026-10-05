# Offers static layout and homepage integration

**Status:** Completed on 2026-10-05 (Europe/Moscow).

**Priority:** Medium

**Dependency:** 017 and 017a.

Read the [carousel plan](../../plan/20261005_044149_plan.md),
[task guide](../../task-management.md), [README](../../../../README.md) and
[project instructions](../../../../AGENTS.md). Apply relevant
astro-best-practices/frontend-design guidance and Playwright for browser work;
consult required Astro guides.

## Scope

Create sections/OffersCarousel.astro below the header and above About. Render
validated offers with image, heading, description and CTA. Implement theme-aware
desktop/mobile composition, reserved image frames and long-copy wrapping.
Preserve hidden homepage h1. Disabled/zero items omit the section; one item is
static; multiple items form a stacked readable no-JS fallback. Do not show
nonfunctional controls.

## Acceptance

Test temporarily enabled preview in both themes at 320/768/1440px, enlarged text
and failed images. Check links/headings/overflow, capture representative
screenshots and run check/build. Update offers guide and restore original
publication setting.

Keep content truthful and JSON-editable. Browser evidence belongs under ignored
`output/playwright/task-018/`. Record changed files, checks and limits; archive
by actual completion date and update the plan after verification. No commit or
deployment is implied.

## Changes and verification

- Added `src/components/sections/OffersCarousel.astro` and integrated it before
  About on the homepage; preserved its hidden h1. Validated exports govern
  rendering, order and per-item enable filtering. Added a named section, labeled
  articles, intrinsic image dimensions, reserved theme-aware frames,
  desktop/mobile composition and wrapping CTA/copy. Multiple offers remain
  stacked with all native links usable; no new script or controls.
- Updated [offers guide](../../../site/offers-carousel.md),
  [content guide](../../../site/content.md) and the carousel plan. The content
  guide now records homepage build validation even with disabled publication.
  Applied Astro/frontend-design/Playwright skills and consulted Astro component,
  styling, routing and content guides. Reused existing visual tokens and Button.
- Chrome matrix: 12 passing theme/viewport/text combinations (Light/Dark,
  320/768/1440, root text 16/32px); no document or offer-element overflow. Long
  unbroken copy and expanded CTA remained visible. Checked hierarchy,
  region/article labels, placement, IDs 18/20 with disabled ID19 excluded,
  existing fragment targets, eager/lazy loading and keyboard focus/Tab order.
- JavaScript-disabled context retained both offers/links at 320px without
  overflow. Blocked artwork retained a 160.875px mobile frame and readable
  copy/CTA. Single item was static; empty/all-disabled/global-disabled cases
  omitted the section. Original JSON restored byte-for-byte; publication remains
  false with empty items.
- Screenshots, local configuration helper, browser scripts and result logs saved
  under ignored `output/playwright/task-018/`. Section-only enlarged mobile and
  Dark desktop evidence were also visually reviewed. Preview fixtures clearly
  identified reused service copy and the existing logo; no promotional
  claims/assets added.
- `pnpm check`: 85 files, zero errors/warnings/hints. `pnpm build`: six pages
  with temporary preview, followed by restored publication build. Git
  whitespace/diff checks passed; no JSON/publication changes retained.

## Limits and handoff

Verification used the existing Astro background development server, not
production output. Final matrix blocked unrelated external HTTPS requests after
network-idle timeouts; resource errors from deliberate blocking are expected.
200% root text is not native browser zoom. Approved promotional copy/artwork,
screen-reader/native-zoom coverage and measured performance/byte deltas remain
for task 021. Arrow/dot navigation and autoplay remain tasks 019–020. No commit,
deployment or new server ownership was implied.
