# Offers controls inside the carousel

**Status:** Completed 2026-10-05 (Europe/Moscow)

**Priority:** Medium

**Dependency:** 019. Implement before 020.

Read the [carousel plan](../../plan/20261005_044149_plan.md),
[task guide](../../task-management.md), [README](../../../../README.md) and
[project instructions](../../../../AGENTS.md). Apply relevant
astro-best-practices/frontend-design guidance and Playwright for browser work;
consult required Astro component and styling guides.

## Scope

Move the manual navigation controls from the separate row into the carousel's
image area:

- Place the previous arrow inside the left edge and the next arrow inside the
  right edge. Center both vertically relative to the slide area. Both arrow
  buttons must be circular, with equal width and height and centered SVG icons.
- On devices with a mouse/hover capability, show arrows only while the pointer
  is over the carousel. Animate their appearance on pointer entry and their
  disappearance on pointer exit. Hidden arrows must not intercept clicks.
- Preserve keyboard access: reveal arrows when focus enters the carousel and
  keep focused controls visible. On touch/non-hover devices, keep arrows
  available without requiring mouse hover. Respect reduced motion by removing
  show/hide animation.
- Move the circular slide indicators inside the carousel at the bottom,
  centered horizontally. Keep dots visible independently of mouse hover.
- Show only the indicator circles: no visible group container, pill, panel,
  background, border or shadow around the group. Individual dot buttons must
  have transparent backgrounds in default, hover and selected states; no
  highlighted area around the selected circle. Keep generous invisible click
  targets and a visible keyboard focus outline when focused.
- Give every visible indicator circle the same radius, including the selected
  circle.
  Use outlined empty circles for unselected slides and a filled circle for the
  selected slide. Remove the current extra outline/size emphasis; retain
  `aria-current` and generous button targets around the small markers.
- Remove the visible current-item/total-item numbers and their counter markup
  and updates. Preserve accessible slide labels, dot names and concise polite
  manual status for screen-reader orientation.
- Add responsive padding to the content area containing the description and
  CTA. Reserve left/right space for the circular arrow buttons, including their
  full click targets and focus outlines, plus a clear gap. Reserve bottom space
  for the indicators. Keep this padding while arrows are hidden so hover/focus
  reveal does not shift content. Apply it to every configured copy position;
  description text and CTA must never overlap navigation controls.

Keep controls legible over both bright and dark images and in both themes.
Reserve sufficient copy/CTA space so overlay controls never obscure text or
links, including JSON-configured positions and enlarged/long copy. Preserve
stable rotation height, native CTA links, wrapping arrows and direct dot
selection. Reveal controls only after successful initialization and only for
multiple items; preserve zero/one/no-JS behavior. Autoplay belongs to task 020.

## Acceptance

Verify in Chrome:

- Left/right placement and vertical centering; dots at the bottom horizontal
  center; no separate control row or visible numeric counter.
- Both arrow buttons have circular boundaries, equal width and height, and
  centered icons at every tested viewport/text size.
- Animated arrow show/hide on mouse entry/exit, including rapid re-entry;
  pointer movement between slides/controls causes no flicker. Hidden arrows
  do not block underlying content or links.
- Equal visible circle radii, filled selected circle, correct `aria-current`,
  direct dot selection and wrapping arrows.
- Indicators have no visible container or button background in default, hover
  or selected states. Selection changes only the circle fill, with no outer
  ring or highlighted area. Keyboard focus remains visibly distinguishable.
- Keyboard Tab/Enter/Space, focus-triggered visibility, retained focus and
  visible focus outlines; touch/non-hover navigation remains usable.
- Reduced motion removes reveal/hide animation. Controls have at least
  44×44px targets and sufficient contrast over bright/dark/failed images.
- Both themes at 320/375/768/1440px, 200% text, short landscape height and
  resizing; all copy positions and long text stay clear of controls with no
  clipping, overflow or slide-height jump.
- Verify description and CTA padding keeps their bounds clear of both arrow
  targets/focus outlines and bottom indicators in all nine copy positions,
  including long text and enlarged CTA labels. Hover/focus show/hide must not
  change content position or padding.
- Native CTA destinations, zero/one items and no-JS fallback still work.

Record browser scripts/results/screenshots under ignored
`output/playwright/task-019a/`. Run `pnpm check`, `pnpm build` and diff checks;
update `docs/site/offers-carousel.md`. Restore original JSON/publication settings
after temporary fixtures. Record changed files, checks and limits, then archive
by actual completion date and update the plan. No commit or deployment implied.

## Completed changes

- `src/components/sections/OffersCarousel.astro`: circular edge arrows centered
  vertically, 180ms hover show/hide, keyboard focus reveal, non-hover visibility,
  hidden pointer exclusion and reduced motion. Bottom-centered standalone dots
  have equal radii and fill-only selection, transparent default/hover/selected
  targets, no visible group container and visible keyboard focus. Removed
  counter markup/state. Controls are bounded at 44–56px; icons remain centered.
- Reserved side padding protects description/CTA from arrow targets/outlines;
  persistent bottom padding protects against dots. ResizeObserver adjusts
  clearance for wrapped indicators without measuring slides. Shared grid height
  and JSON copy positions remain. No autoplay or carousel dependency added.
- Updated `docs/site/offers-carousel.md` and the carousel plan. Original JSON
  bytes restored after fixtures, including enabled/autoplay true, 7000ms and
  two enabled demos. No publication configuration change remains.

## Verification and limits

Chrome passed 16 both-theme width/text cases and 144 copy-position checks.
Verified arrow/dot placement, circular geometry, icon centering, 44px targets,
fill-only selection, transparent group/targets, wrapping navigation, polite
status, native CTA navigation, Tab/Enter/Space, focus outline/reveal and hidden
CTA exclusion. Hover entry/exit, rapid re-entry, movement onto controls, hidden
hit testing and unchanged text geometry passed. Reduced-motion duration respects
the site's global near-zero rule. Both-theme touch/no-JS, short landscape and
resizing passed. Four long/unbroken copy/CTA cases at 3rem and 200% root text
had no clipping/overflow/overlap and stable rotation height. Artificially wrapped
indicators retained clearance. Both remote images loaded; bright/black fallback
and loaded desktop/mobile screenshots reviewed. Six real JSON fixtures passed:
zero/global-disabled/all-disabled/one/filtered/restored multiple.

`pnpm check`: zero errors/warnings and one preexisting ignored task-018 hint.
`pnpm build`: six pages. Diff and component 80-column code checks passed.
Evidence scripts/results/screenshots: ignored `output/playwright/task-019a/`.
Verification uses development output. Native browser zoom and screen-reader
speech were not tested; 200% root text is separate. Task 021 owns integrated
production/performance verification. No commit or deployment.
