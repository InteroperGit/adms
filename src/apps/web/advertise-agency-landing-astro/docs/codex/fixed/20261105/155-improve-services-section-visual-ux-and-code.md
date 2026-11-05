# Improve the services section visual design, user experience and code

**Status:** Fixed — implementation and verification completed

**Priority:** Priority 2

**Created:** 2026-11-05

**Area:** Homepage services catalog (`Services.astro` and service cards)

## Goal

Make the «Наши услуги» section easier to scan, more persuasive and more
consistent across screen sizes while simplifying the rendering and styling code
that supports the catalog.

## Scope

- Review the section hierarchy, spacing, card composition and calls to action so
  visitors can quickly understand each service and its next step.
- Improve responsive behavior from narrow mobile widths through wide desktop;
  preserve readable text, stable image proportions and predictable card heights.
- Refine visual states for hover, focus, keyboard navigation, touch input and
  reduced-motion preferences, including sufficient contrast in both themes.
- Preserve semantic headings, native links, no-JavaScript navigation and the
  existing publication/demo disclosure rules.
- Remove duplicated or unnecessary markup and CSS, keep the component API
  focused, and avoid adding client-side code where static Astro rendering is
  sufficient.
- Keep service ordering and visibility driven by the validated content layer; do
  not move runtime content out of `data/content/`.

## Acceptance

- At 320px, tablet widths and wide desktop, the section has no horizontal
  overflow, clipped content or unusable controls.
- A visitor can identify each service, its benefit and its available action
  without relying on color, hover or client-side JavaScript.
- Keyboard focus is visible and follows a logical order; interactive cards or
  links have clear names and usable touch targets.
- Light and dark themes retain readable contrast, and reduced-motion users do
  not receive avoidable animated transitions.
- The implementation remains statically rendered, keeps existing content and
  publication gates intact, and has less duplicated presentation logic where the
  refactor permits it.

## Verification

- Run the relevant component or browser checks at mobile, tablet and desktop
  widths, in both themes, with JavaScript disabled where applicable.
- Run `pnpm check`, `pnpm format:check` and the focused service/content tests.
- Record screenshots or browser evidence for responsive layout, focus states,
  theme contrast and reduced-motion behavior.

## Dependencies and notes

- Review `src/components/sections/Services.astro`, its service card component,
  and the validated service content before implementation.
- Keep any copy or image changes inside the approved content workflow; this task
  does not authorize publication of unapproved agency claims or media.
- Read the applicable Astro, code-style, development-server and sound
  notification rules before implementation.

## Implementation

- Added shared `src/components/cards/Card.astro` for the catalog card layout,
  responsive media, focus states and reduced-motion behavior.
- Reworked `ProjectCard` and `ServiceCard` as thin adapters over the shared card
  while preserving project category badges and service metadata.
- Removed the service title underline and the arrow after the detail action.
- Restored a white text panel inside cards and kept the selected-card surface
  visually distinct from the section background.
- Updated service images to use the existing public OffersCarousel image URLs:
  `/images/carousel/storefront.webp` and `/images/carousel/neon-sign.webp`.
- Added responsive `sizes` handling to `ContentImage` for the shared card.

## Verification Results

- Focused card and section tests: 4 files, 13 tests passed.
- `pnpm check`: passed with 0 errors and 0 warnings; one existing deprecation
  hint remains in `src/validation/content-blocks.ts:129`.
- `pnpm format:check`: passed.
- `pnpm build`: passed, 39 pages generated.
- Browser evidence: `output/playwright/services-section-final.png` at the
  services section shows loaded public images, white card copy panels and the
  simplified detail links.
