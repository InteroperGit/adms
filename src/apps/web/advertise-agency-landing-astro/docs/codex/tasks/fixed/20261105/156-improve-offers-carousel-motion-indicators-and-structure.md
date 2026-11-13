# Improve OffersCarousel animation, indicators and component structure

**Status:** Fixed - implementation and verification completed

**Priority:** Priority 2

**Created:** 2026-11-05

**Completed:** 2026-11-05

**Area:** Homepage offers carousel and shared image-carousel UI

## Goal

Make the offers carousel feel calmer and more deliberate during automatic and
manual slide changes. Bring the image indicators visually closer together and
make their states read as solid filled markers, while reducing duplicated
presentation and state logic so the shared carousel remains easy to maintain.

## Scope

- Replace the current short reveal with a smooth, consistent transition between
  slides. Preserve a stable slide height and avoid flashes, layout shifts or
  animation restarts when autoplay is paused, resumed or interrupted by manual
  navigation.
- Respect `prefers-reduced-motion`: disable slide movement and decorative
  transitions while keeping the selected state and navigation behavior clear.
- Rework the dots in `CarouselDots.astro` and `CarouselDot.astro` so visible
  markers sit closer together, use a compact consistent size, and have a fully
  filled active state. Keep at least a 44px keyboard/touch target through the
  control wrapper or hit area rather than by spacing the visible markers apart.
- Keep indicator contrast readable over both light and dark images, preserve a
  strong `:focus-visible` treatment, and ensure passive autoplay markers do not
  enter the accessibility tree as controls.
- Simplify `image-carousel.ts` state transitions and cleanup where practical:
  centralize selection and presentation updates, keep one timer per instance,
  and avoid selectors or data attributes that duplicate the same state.
- Keep `OffersCarousel.astro` as a thin data adapter. Do not move runtime
  content out of `data/content/`, change offer ordering, or introduce a new
  carousel dependency or framework island.
- Preserve no-JavaScript static rendering, single-item behavior, native links,
  accessible labels, inert inactive slides and existing public component APIs.

## Acceptance

- Automatic and manual changes use one coherent transition with no visible
  flicker, overlap, horizontal overflow or unexpected carousel height change.
- The selected indicator is visibly a solid fill; all indicators form a compact
  group at mobile, tablet and desktop widths without losing usable targets.
- Arrows, indicators and slide links remain keyboard reachable with visible
  focus, correct `aria-current`/`aria-hidden` state and concise announcements.
- Reduced-motion users see immediate state changes and no avoidable movement;
  autoplay does not rotate while reduced motion is enabled.
- A disabled carousel, an empty/filtered offers list, one offer and JavaScript
  failure retain the existing static and publication-gated behavior.
- The shared component has fewer duplicated transition/state rules or clearer
  ownership of them, with comments documenting non-obvious timing and cleanup.

## Verification

- Run focused carousel/component tests for zero, one and multiple enabled
  offers, arrows, dots, autoplay pause/resume, manual selection and cleanup.
- Use browser checks at 320px, tablet and wide desktop widths in light and dark
  themes; inspect animation, indicator spacing, focus, overflow and image load.
- Repeat the relevant browser cases with reduced motion and JavaScript disabled
  to verify the static fallback and accessibility state.
- Run `pnpm check`, `pnpm format:check` and `pnpm build` after implementation.
- Record screenshots or other browser evidence under an ignored
  `output/playwright/task-156/` directory.

## Implementation

- Replaced the one-sided reveal with a 900ms opacity overlap. The incoming image
  fades in over an opaque outgoing image to prevent background flashes. Artwork
  alone scales from 1.035 to 1 over 1200ms within the clipped slide; text and
  controls remain stationary. Slide selection and `aria-hidden`/`inert` state
  update immediately. Per-slide cleanup timers keep rapid manual changes smooth
  and release outgoing slides after the transition.
- Kept both slide layers below the controls so arrows and indicators remain
  visible and usable over the active image.
- Tightened the visible dots into a zero-gap group with 44px hit areas. Markers
  are solid, with the selected dot emphasized by opacity and scale; passive
  autoplay markers remain noninteractive.
- Simplified enhancement and selection updates in `image-carousel.ts`, retained
  reduced-motion and animation-option behavior, and corrected arrow insets to
  prevent mobile overflow and match the tested desktop layout.
- Updated carousel tests for crossfade cleanup, rapid selection and the current
  panel-ratio contract. Added browser assertions for both transition layers.

## Verification Results

- Focused component tests: 4 files, 18 tests passed.
- Chromium carousel scenarios: 4 passed, covering manual controls, both
  crossfade layers, responsive arrow layout, focus, inert inactive links and
  reduced motion.
- `pnpm check`: passed with 0 errors and 0 warnings; one existing Zod
  deprecation hint remains in `src/validation/content-blocks.ts:129`.
- `pnpm format:check`: passed.
- `pnpm build`: passed, 39 pages generated.
- Browser viewport checks at 390px and 1280px reported no horizontal overflow;
  dot targets measured 44x44px and reduced-motion transitions were immediate.
- Hover-state screenshot with both arrow controls and all four indicators is
  saved at `output/playwright/task-156/offers-carousel-controls-hover.png`.
- Diff checks passed. No content, publication settings, external service or
  deployment was changed.
