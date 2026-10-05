# Offers integrated verification and handoff

**Status:** Pending

**Priority:** Medium

**Dependency:** 017, 017a, 018, 018a, 018b, 019, 019a, 020 and 020a.

Read the [carousel plan](../plan/20261005_044149_plan.md),
[task guide](../task-management.md), [README](../../../README.md),
[offers guide](../../site/offers-carousel.md) and
[project instructions](../../../AGENTS.md). Apply relevant
astro-best-practices/frontend-design guidance and Playwright for browser work;
consult required Astro guides. Tasks 020 and 020a are fixed; task 020a's
settings-controlled autoplay supersedes the original pause/play behavior.
Close the native hidden-tab visibility gap carried from task 020 during final
integrated verification.

## Scope

Run the plan's final integrated review against built production output and fix
scoped regressions. Use the latest implementation below; earlier separate-row,
numeric-counter and opaque-description-background evidence is historical.
Optional swipe remains deferred to a separate future task.

## Current baseline from tasks 017–019a

- Content stays JSON-editable in `data/content/offers.json`. Plain domain types
  live in `src/types/offer.ts`; modular runtime validation/parser and
  bidirectional schema/type compatibility checks live in `src/validation/`.
  Content wrappers validate at build/server time and preserve enabled-item
  editorial order. Runtime schemas must not enter browser bundles.
- Strict validation covers stable unique IDs, positive image dimensions, safe
  image/CTA URLs, decorative/informative alt text, required flags, interval
  default 7000/minimum 5000 and presentation defaults/bounds. Removed titles
  and `imageCredit` fields are rejected. Empty/whitespace descriptions are valid
  and omit the paragraph, backing rectangle and extra CTA gap.
- Full-width remote backgrounds use `object-fit: cover`, JSON desktop/mobile
  focal points, intrinsic dimensions, eager first/lazy later loading and neutral
  image-failure fallbacks. Only description and native CTA are visible; there
  are no replacement headings, credits, copy panels or whole-image wash. The
  description alone has square-corner 25% black/white backing; images and CTAs
  remain opaque. JSON controls font size/color and all nine copy positions.
- One current index drives wrapping arrows/direct dots. Circular arrows sit
  inside left/right edges, vertically centered with centered SVG icons and
  bounded 44–56px targets. Fine-pointer hover reveals/hides arrows over 180ms;
  focus-within reveals them, non-hover/touch keeps them visible, and invisible
  arrows do not intercept pointer events. Reduced motion removes meaningful
  reveal/slide animation.
- Equal-radius standalone circles sit inside the bottom horizontal center.
  Selected circles are filled; others outlined. No visible group container,
  button background, hover/selection area, selected outer ring or numeric
  counter. Invisible targets stay generous; keyboard focus remains visible.
  Accessible Russian slide/dot labels and concise polite manual status remain.
- Persistent responsive side/bottom padding protects description/CTA from
  arrow targets, focus outlines and indicators. Hover/focus does not shift copy.
  ResizeObserver updates bottom clearance if dots wrap/resize. Inactive slides
  use `aria-hidden`, `inert` and CSS visibility but share the tallest grid track
  to preserve rotation height without clipping enlarged/long copy.
- Zero/global-disabled/all-disabled omit the region; one item is static with
  no navigation. Multiple items without JS remain a stacked list with working
  CTAs and no controls. Enhancement reveals controls only after initialization.
  Hidden slides stay outside the accessibility tree/tab order; native
  Tab/Enter/Space work without document-wide key interception.

## Integrated verification matrix

- Both themes at 320/375/768/1440px, 200% root text, short 844×390 landscape
  and resizing. Record native browser zoom coverage separately. Exercise all
  nine copy positions, empty/whitespace text, maximum 3rem long/unbroken copy
  and enlarged CTA labels. Check no clipping, overlap, horizontal overflow or
  rotation/hover/focus-induced layout shift. Include wrapped indicator lists.
- Verify circular arrow geometry/centering, bottom-centered equal-radius dots,
  fill-only current state and no visible counter/container/highlight area.
  Test pointer entry/exit, rapid re-entry, movement onto controls, hidden-arrow
  hit testing, keyboard focus reveal/retention and touch/non-hover visibility.
  Check generous targets and visible focus, arrow wrapping, direct selection,
  `aria-current`, silent initialization and polite manual-only status. Follow
  actual CTA destinations; arrows/dots must never activate CTA links.
- Recheck zero/one/multiple/filtered/global-disabled/all-disabled states,
  no-JS and failed initialization, reduced motion, slow/failed images and
  unavailable storage. Verify remote-image dimensions/focal crops and image
  loading behavior after manual and automatic selection.
- Exercise current schema/parser/wrapper regressions and contract checks:
  defaults, bounds, strict removed/unknown fields, invalid URLs/IDs/dimensions,
  enabled ordering, empty descriptions and source/field errors. Confirm the
  plain type/validator/wrapper import direction and browser bundle boundary.
- After task 020a, verify configured timing/wrap and one timer only. Rotation
  requires autoplay true, multiple items, viewport/document visibility and no
  reduced motion. Hover/focus/hidden-tab/offscreen holds resume automatically
  when cleared. Manual/keyboard interaction never permanently stops autoplay;
  selection resets its interval. Autoplay false stays off. Automatic changes
  stay silent and never replace a focused CTA or move focus. Verify the autoplay
  button is absent and overlay arrows/dots retain layout and accessibility
  without a counter or visible dot container. Distinguish genuine native tab
  visibility tests from simulations when closing task 020's verification gap.
- Retest homepage placement below header/above About, one hidden h1, Russian
  region/slide labels and inactive accessibility exclusion. Check existing
  header/settings/theme/menu/cookie interactions and project/legal routes.
- Measure actual rendered contrast: description backing is 25% transparent,
  while the current schema contrast helper compares against solid black/white.
  Passing schema validation or historical opaque-background results does not
  prove current contrast. Test retained imagery and bright/dark/checkerboard
  cases; reconcile documentation/validation assumptions and fix scoped
  failures without reverting the requested visual design. Check CTA text,
  arrow icons/boundaries, standalone dots and focus against actual backgrounds
  (4.5:1 normal text, 3:1 essential controls).
- Record production JS/CSS bytes, offer-specific additions where measurable,
  image requests/loading and sampled layout-shift observations with conditions.
  Separate measured results from assumptions; do not reuse development-output
  evidence as proof of production performance.

## Acceptance

Finalize `docs/site/offers-carousel.md` with current editing instructions,
behavior, durable results, source rights/content handoff and check limits.
Reconcile stale opaque-backing and historical navigation descriptions with the
actual component; keep historical results clearly labeled. Earlier task checks
used development output and did not cover native zoom, screen-reader speech or
integrated production performance. Record newly covered checks and remaining
limits explicitly; prior evidence is a baseline, not final acceptance.

Save representative mouse-hidden/shown, focused, touch, both-theme narrow/wide,
enlarged-text, empty-description, failed-image and no-JS browser evidence.
Restore original JSON bytes/publication settings after fixtures. Current saved
baseline is `enabled: true`, `autoplay: true`, `intervalMs: 7000` with two
explicitly identified test offers; capture the actual starting state rather than
assuming task 017's original disabled/empty configuration. Missing approved
promotions remain agency inputs, and demo stock images are not agency work or
approval to publish. No invented discounts, prices, deadlines or results.

Run `pnpm check`, `pnpm build` and diff/code-style checks after scoped fixes.
Verify no critical carousel regression remains, then update plan completion
status. This task remains pending until its integrated review is performed.

Browser evidence belongs under ignored `output/playwright/task-021/`. Record
changed files, checks and limits; archive by actual completion date and update
the plan after verification. No commit or deployment is implied.
