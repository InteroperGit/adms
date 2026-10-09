# Replace test offers with real agency content

**Status:** Backlog — implementation verified; agency approval pending

**Moved to backlog:** 2026-10-10, at user request

**Archived:** 2026-10-10

**Priority:** Priority 1

**Created:** 2026-10-09

**Plan:** [Sales and SEO improvement plan](../plan/sales-and-seo-plan.md).

**Depends on:** Task 050; archived offers tasks 017-021.

## Goal

Replace the test carousel with useful service offers and relevant licensed
photography before bringing more visitors in.

## Scope

- User scope updated 2026-10-09: real selling texts and stock photographs
  processed with Sharp. Sharp processes images; it has no photo collection.
- Use evergreen service offers with clear customer needs and contact CTAs.
  Obtain agency approval before release. Time-limited promotions, if added,
  need confirmed eligibility, prices/discount conditions and dates.
- Replace library/test offer material in data/content/offers.json while
  preserving the existing carousel and user-requested first-section order.
- Disable expired or unavailable promotions through the existing content
  controls; do not invent an offer to fill the carousel.
- Verify image crops/loading/failure behavior, readable text, keyboard controls,
  reduced motion, and CTA navigation in both themes and narrow layouts.

## Acceptance

- Every enabled offer has approved copy, current dates where applicable,
  relevant licensed imagery, and a working destination.
- No test promotion or unrelated library photograph is sold as agency work;
  the homepage remains usable when there is no genuine promotion.

## Implementation

- Replaced both test descriptions with service copy about business signs and
  neon lettering for cafe, salon and office interiors. Each CTA names its
  service and leads to the existing contacts section.
- Replaced unrelated office images with local CC0 photographs of illuminated
  storefront lettering and neon. Sharp creates WebP originals; the existing
  Astro carousel generates responsive variants without remote dependencies.
- Image sources, authors, licenses and processing are recorded in
  [Offers carousel documentation](../../site/offers-carousel.md).
- Stock imagery is illustrative; it is not evidence of agency projects.
  Prices, discounts, schedules and performance results were not invented.
- Archived at user request on 2026-10-10 after implementation and verification.
  Subsequently moved from fixed to backlog at user request on the same date.
  Agency copy/publication approval remains a release dependency; archival
  does not establish the original production acceptance.

## Verification — 2026-10-10

- Follow-up scope: added offers 3/4 for information stands and city architecture
  sign approval, each with a specific contacts CTA. Stands use an original
  decorative SVG; sign approval reuses the licensed storefront photograph.
  Follow-up `pnpm check`, `pnpm build` and diff checks pass; generated homepage
  contains both new slides and service-specific contact links. The eight
  browser cases below describe the original two-offer baseline.

- `pnpm check` passes: zero errors/warnings, one existing unused-variable hint
  in an older browser-check artifact. Changed-file code style passes.
- `pnpm build` passes and generates four responsive variants per offer image.
- Eight browser cases pass: both slides, 1440/320px, light/dark themes.
  Photos decode locally, responsive sources exist, CTAs fit and target the
  existing contacts section. Keyboard Enter selects each slide with reduced
  motion enabled. Both static slides remain visible without JavaScript.
- Screenshots reviewed for image crops and copy readability; evidence and
  verification script are in `output/task-052/` (local, ignored artifacts).

## Execution notes

Read project instructions, task-management guidance, and applicable rules
before implementation. Record missing agency inputs or external access as
dependencies. This task file authorizes no external publication or messages.
Archive only after acceptance, with evidence and updated plan/status links.
