# Implement solutions by business type section

**Status:** Fixed

**Priority:** Priority 3

**Created:** 2026-10-09

**Depends on:** [Task 047](../fixed/20261009/047-business-type-solutions-content.md).

## Goal

Help visitors find relevant signage and interior solutions for their business
through four readable examples and direct access to the inquiry form.

## Scope and acceptance

- Read project rules and the required Astro skill before editing components.
- Create `BusinessSolutions.astro` with typed content from Task 047.
- Insert after FAQ and before Contacts, preserving section background order.
- Render shops, cafés/restaurants, salons, and offices in that order.
- Show each summary, suitable options, customer task, and complete example.
- Add the shared `ImageCarousel.astro` to every business-solution item so
  visitors can view image examples alongside the description.
- Extend the Task 047 content contract with a carousel configuration for each
  item: at least one relevant image, descriptive alt text, dimensions, and
  publication-rights metadata. Use approved real project media when available.
- Keep each carousel's images tied to that item's business type and example;
  do not reuse an unrelated project image or present stock/generated media as
  completed agency work.
- Give each carousel a stable unique ID, a meaningful item label, and a
  visible caption or contextual description. Preserve the shared carousel's
  native controls, keyboard operation, focus styles, reduced-motion behavior,
  and JavaScript-disabled static gallery fallback.
- Reserve image dimensions to prevent layout shift and ensure images remain
  readable at narrow widths and 200% text size. Use lazy loading after the
  first visible image where the shared component supports it.
- If approved project media is unavailable, retain a complete solution item
  with a clearly contextual image supplied for that business type; do not
  render an empty carousel, broken image frame, or fabricated project claim.
- Use shared layout conventions, no fixed text heights, and no client JavaScript.
- Optional images/project links must not leave broken links or empty frames.
- Show attribution only when matching project evidence exists.
- Add each category's native link to `/#order-inquiry`.
- Include no fake, draft, demo, test, preliminary, placeholder, or fabricated proof.
- Preserve keyboard access, focus, headings, contrast, reduced motion, themes,
  no-JavaScript access, narrow widths, and enlarged text behavior.
- Verify every carousel independently for image decoding, alt text, slide
  order, controls, captions, focus, and fallback gallery behavior.

## Handoff

Task 049 can use the rendered section in `BusinessSolutions.astro`. It follows
FAQ and precedes Contacts in `src/pages/index.astro`. Each item links to
`/#order-inquiry` and uses one contextual local service illustration with
visible source and rights metadata. The changed content contract, JSON data,
types, validation, and section are ready for follow-up work. Form availability
is distinct from successful inquiry delivery.
