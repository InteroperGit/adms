# Offers manual carousel navigation

**Status:** Completed 2026-10-05 (Europe/Moscow)

**Priority:** Medium

**Dependency:** 018, 018a and 018b.

Read the [carousel plan](../../plan/20261005_044149_plan.md),
[task guide](../../task-management.md), [README](../../../../README.md) and
[project instructions](../../../../AGENTS.md). Apply relevant
astro-best-practices/frontend-design guidance and Playwright for browser work;
consult required Astro guides.

## Scope

Enhance the static layout with one current-slide state, wrapping previous/next
arrows, circular selected dots and a quiet position counter. Show controls only
after successful initialization and only for multiple items. Use native
Russian-labeled controls/local SVGs, generous targets, hidden inactive slides,
visible focus and manual polite status. Keep height stable without clipping
copy; respect reduced motion. No autoplay or swipe yet.

## Acceptance

Verify arrows/wrap/dots/counter/CTA links, keyboard focus, zero/one/no-JS
behavior and both-theme narrow/enlarged/short-height/resizing layouts. Record
browser evidence, run check/build and update guide. Restore original publication
setting.

Keep content truthful and JSON-editable. Browser evidence belongs under ignored
`output/playwright/task-019/`. Record changed files, checks and limits; archive
by actual completion date and update the plan after verification. No commit or
deployment is implied.

## Completed implementation

Changed `src/components/sections/OffersCarousel.astro`: added wrapping native
Russian-labeled SVG arrows, generous circular dot targets with current state,
quiet counter, visible theme-aware focus and polite manual status. One current
index drives all navigation. Initialization alone adds carousel semantics and
reveals controls; zero/one/no-JS preserve static behavior. Inactive slides use
`aria-hidden`, `inert` and CSS visibility while sharing the tallest grid track.
This avoids Tailwind's `hidden` display rule removing reserved geometry.
No height measurements, carousel package, autoplay or swipe. Short fade respects
reduced motion. A separate wrapping control row stays clear of all copy/CTAs.

Updated `docs/site/offers-carousel.md` with behavior and verification, corrected
stale opacity notes against existing CSS, and updated the carousel plan.
Original `data/content/offers.json` restored byte-for-byte after fixtures:
`enabled: true`, `autoplay: true`, `intervalMs: 7000`; two enabled demo offers.

## Verification and limits

- Chrome: 16 light/dark × 320/375/768/1440px × normal/200% root text cases.
  Wrapping arrows, direct dots, selected indicator/counter, native CTA navigation,
  concise status, silent initialization, Tab/Enter/Space, retained focus,
  inactive accessibility/tab exclusion, 44px targets and visible focus passed.
- Stable height, contained copy, separate controls and no document overflow
  passed, including both-theme 844×390 landscape and resizing to 320px.
  Reduced motion disables animation. Four long/unbroken maximum-3rem
  description/CTA cases with 200% root text expand without clipping.
- Both-theme no-JS and blocked-image fallbacks passed. Both remote images loaded
  successfully in a separate check; desktop screenshot visually reviewed.
- Six actual JSON browser fixtures passed: zero, global-disabled, all-disabled,
  one, filtered order and restored multiple. Fixture cleanup restores bytes even
  on failure; a development reload connection reset was retried successfully.
- Final `pnpm check`: zero errors/warnings, one preexisting ignored task-018
  script hint. Final `pnpm build`: six pages. Diff and 80-column code checks pass.
- Evidence scripts, matrix record, fixture/edge results and screenshots:
  ignored `output/playwright/task-019/`.

Browser checks use development output. Native browser zoom and screen-reader
speech were not tested; 200% root text is a separate check. Task 021 owns
integrated production/performance verification. No commit or deployment.
