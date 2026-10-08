# Implement the ordering process section

**Status:** Implemented; verified by Task 040

**Priority:** Priority 2

**Created:** 2026-10-08

**Depends on:**
[Task 038](038-ordering-process-content.md) and the existing homepage section
order.

## Goal

Add a mostly static Astro section that makes the ordering sequence clear and
reduces uncertainty before a visitor submits an inquiry.

## Scope and acceptance

- Render the five approved steps in this order: inquiry, measurements,
  design approval, production, and installation.
- Add the new ordering-process section component in `src/pages/index.astro`
  immediately before the `Reviews.astro` testimonials component, preserving
  the homepage order from the sales and SEO plan.
- Show customer responsibilities and agency responsibilities without making
  unsupported promises.
- Use semantic ordered-list markup when it represents the sequence; preserve
  a logical heading hierarchy and accessible names.
- Add a clear path to the inquiry form from the section.
- Follow the existing alternating section surfaces and responsive layout
  conventions.
- Keep the section usable with keyboard navigation, reduced motion, and
  JavaScript disabled.
- Add only approved local or rights-cleared media; do not add placeholder
  photography as production evidence.
- Extend content validation where the new content contract requires it.

## Evidence and handoff

Record changed files, generated routes, screenshots, and content-contract
decisions. Pass the implementation to Task 040 for responsive, accessibility,
and content verification.

## Implementation — 2026-10-09

- Added `src/components/sections/OrderingProcess.astro` with a static,
  semantic ordered list for the five content steps.
- Each step shows the customer inputs and agency responsibilities in separate
  native lists. The draft notice remains visible while approval is pending.
- Added a native inquiry link to `/#order-inquiry`; no JavaScript or media is
  required by the section.
- Inserted `OrderingProcess` in `src/pages/index.astro` immediately before
  `Reviews.astro`, matching the planned homepage order.
- Added responsive one-, two-, and three-column layouts using existing theme
  tokens and preserved the site's alternating section surfaces.
- Moved step marks into standalone SVG files under
  `public/images/ordering-process/`; each step now selects its icon through
  the content contract instead of component ID branching. Production uses a
  hammer mark and installation uses a drill mark.

## Verification

- `pnpm check`: passed with one pre-existing hint in the ignored
  `output/playwright/task-018/matrix.js` helper.
- `pnpm check:style`: passed for the changed source files.
- `pnpm build`: passed; 11 routes generated.

Task 040 must complete responsive, keyboard, reduced-motion, no-JavaScript,
and content-order verification before this implementation is archived.
