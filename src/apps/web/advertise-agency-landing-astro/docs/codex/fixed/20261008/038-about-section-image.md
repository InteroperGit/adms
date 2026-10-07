# Extract a configurable image carousel and use it in About

**Status:** Completed

**Completed:** 2026-10-08

**Priority:** Medium

**Created:** 2026-10-07

**Updated:** 2026-10-08

## Goal

Extract the existing carousel functionality into a reusable
`src/components/ui/ImageCarousel.astro` component. Use it in the existing
carousel section and in `About.astro`, with features enabled or disabled
per instance rather than duplicated implementations.

Read [project instructions](../../../../AGENTS.md),
[task management](../../task-management.md), and applicable development
rules before implementation. Apply astro-best-practices and
frontend-design; use Playwright for browser verification.

## Existing implementation

The carousel section referenced in this request is currently
`src/components/sections/OffersCarousel.astro`. It owns image slides,
manual arrows, clickable item circles, description/button overlays,
autoplay, and presentation behavior. Extract these capabilities into
`ImageCarousel.astro` and make the section a consumer of that component.

About currently renders introduction text, actions, and statistics.
It should become a second consumer with an image-only configuration.

## Scope

- Create one reusable component responsible for rendering slides,
  presentation, indicators, navigation, transitions, and autoplay.
- Accept items and configuration from callers. Keep section-specific
  content, IDs, layout, and data imports in the consuming sections.
- Provide documented enable/disable options for all optional carousel
  features. Do not hardcode offers-specific behavior into the component.
- Include independent options for autoplay, manual navigation, arrows,
  item circles, descriptions, buttons, and transition animation.
- Allow circles to display the active item independently of manual
  navigation. With manual navigation disabled, circles are passive
  indicators and must not be clickable or keyboard focusable.
- Disabling manual navigation must disable every slide-selection input,
  including arrows, clickable circles, and any gesture/key handlers.
- Support configurable timing and presentation appropriate to both a
  full-width promotional section and an inline About image panel.
- Keep configuration explicit, typed, and validated using existing
  project conventions. Document defaults and option dependencies.
- Disabled features must omit their markup, handlers, and reserved UI
  space. Optional descriptions/buttons must not require unused content.
- Keep accessibility, reduced-motion handling, and safe lifecycle cleanup
  mandatory; feature switches must not disable these safeguards.

## Consumer configurations

### Existing carousel section

Use the shared component while retaining current content, full-width
layout, description/button presentation, arrows, clickable circles,
autoplay settings, and existing interaction behavior. Preserve settings
integration, destinations, accessible labels, and no-JavaScript output.

### About section

Enable multiple images, autoplay, and item circles. Disable manual
navigation, descriptions, and slide buttons. Keep About's own actions
outside the carousel and preserve its heading, copy, and statistics.

Place the carousel to the right of the introduction/actions on desktop.
On mobile, place it after the introduction/actions and before statistics.
Keep statistics below the combined introduction/image area.

Keep About image data editable through existing content conventions.
Inspect available assets first and record sources and missing inputs.
Temporary demo imagery must be identified and must not imply agency work.
See [media guidance](../../../site/media.md).

## Shared behavior and edge cases

- Preserve ordered rotation, wrapping, active-item circles, stable image
  geometry, appropriate alt text, responsive sizing, and useful crops.
- Each instance owns its state and timer. Settings changes must respect
  each instance's configuration without leaking state between sections.
- Preserve autoplay holds for hover/focus, hidden documents, offscreen
  state, and page suspension. Resume with a fresh configured interval.
- Respect reduced motion and avoid automatic focus changes or repeated
  screen-reader announcements during rotation.
- Zero items omit the carousel; one item renders statically without
  navigation, circles, or an autoplay timer.
- Preserve readable content on image errors and initialization failure.
  Provide access to images/content without JavaScript and when autoplay
  is unavailable, including About's lack of manual navigation controls.
- Follow applicable code-style, Astro comment, and CSS conventions.

## Acceptance and verification

- Both sections use ImageCarousel.astro; carousel behavior is implemented
  once and controlled through documented per-instance configuration.
- Existing carousel appearance and behavior remain intact after extraction.
- About displays autoplay images and passive circles without manual
  navigation, slide descriptions, or slide buttons.
- Verify feature toggles independently and in both consumer combinations,
  including disabled manual navigation with visible passive circles.
- Verify simultaneous instances, settings integration, rotation/wrapping,
  automatic pause/resume, reduced motion, and zero/one/multiple items.
- Check keyboard accessibility, no-JavaScript rendering, image errors,
  and failed initialization without hidden or unreachable content.
- Review both sections at 320px, 768px, and 1440px in both themes and with
  enlarged text. No clipping, overlap, overflow, or rotation shifts occur.
- Run pnpm check, pnpm build, and diff checks. Record configuration API,
  defaults, selected About assets, screenshots, results, and open inputs.

## Completion

Implement and verify separately. Archive after acceptance passes under
the task-management guide.


## Implementation and verification — 2026-10-08

- Extracted shared ImageCarousel.astro from OffersCarousel with one custom
  element lifecycle, instance-local state/timers, and scoped styles.
- Added plain shared types and build-time validation. Preserved the offers
  JSON contract and public validation exports while sharing presentation
  rules. Options independently control enabled state, autoplay/interval,
  manual navigation, arrows, circles, descriptions, buttons, animation,
  full/panel layout, image fit/ratio, and first-image loading.
- Offers remains a section/data adapter, preserving its anchor, slide IDs,
  copy/actions, configured timing/crops, and manual/autoplay behavior.
- About consumes editable about-carousel.json with three existing local
  service demo PNGs. Autoplay/passive circles are enabled; manual input,
  descriptions, and slide buttons are disabled. A persistent caption and
  image alt text identify demonstrations. Own section actions are retained.
- Added responsive desktop copy/image columns, mobile stacking, full-image
  framing, Astro responsive variants, lazy loading, and stable rotation
  geometry. Statistics follow both columns.
- Reduced motion or disabled autoplay exposes a static gallery when no
  usable manual controls exist. Missing JavaScript/observers and failed
  initialization preserve readable static content. Removal clears timers,
  listeners, and observers; reconnection initializes independently.
- Documentation: [shared carousel API](../../../site/image-carousel.md),
  updated offers/media guidance, and README entry.

### Verification

- pnpm check: zero errors/warnings; one pre-existing unused-variable hint
  remains in ignored output/playwright/task-018/matrix.js.
- pnpm build: passed, 11 static pages and 28 image variants.
- Schema/generated fixtures: 106 checks passed for defaults, malformed
  options/items, duplicate IDs, feature toggles, and zero/one/disabled/
  filtered/partial/image-only cases. Production JSON remained unchanged.
- Production browser layout: 121 checks passed across 320/768/1440px,
  light/dark, and normal/doubled root text. Images decoded, buttons and
  statistics remained accessible, and offers controls wrapped correctly.
- Feature/fallback browser suite: 52 checks passed, including independent
  instances, feature switches, no-JavaScript system themes, failed images,
  unavailable/failing observers, and enlarged fixture overlays.
- Autoplay/lifecycle: 36 checks passed for timing/wrapping, passive circles,
  hover/focus/offscreen holds, fresh resumes, reduced motion, stable height,
  disconnection, and reconnection. Hidden-document and page suspension were
  checked using simulated events, not native browser backgrounding.
- Reviewed desktop light and mobile dark About screenshots. Evidence and
  helpers: output/playwright/task-038/, including summary.json,
  fixture-results.json, layout.js, features.js, and behavior.js.
- Source 80-character and diff checks passed. The unavailable-observer
  test found an initialization exception; capability checking was fixed,
  production rebuilt, and fallback/lifecycle checks rerun successfully.

### Limits and archive

External demonstration resources were deliberately aborted during layout
checks; remote image availability is not established. About uses existing
illustrations, not agency photos. Approved replacements remain a content
handoff, not fabricated agency evidence. No live inquiry delivery changes.

Archived in fixed/20261008 after technical acceptance. The protected
.codex/TASKS.md registry remains read-only in this session; task status and
implementation evidence are recorded here.


## Follow-up changes and refactor ? 2026-10-08

- Removed the visible About figure caption and its unused styles at user
  request; descriptive demo alt text remains. Updated media/API guidance.
- Renamed the shared slide class to carousel-slide to avoid DaisyUI's
  carousel utility forcing horizontal scrollbars. Verified no horizontal
  scroll container at 320/768/1440px and retained offers navigation.
- Refactored ImageCarousel.astro into a shell for validation, controls,
  indicators, and layout; ImageCarouselSlide.astro owns slide images,
  optional overlays, and scoped slide styling. The browser-only module
  image-carousel.ts owns instance initialization, rotation, event handlers,
  observers, and cleanup. The custom element delegates its lifecycle to
  the initializer without duplicating browser behavior.
- Preserved public props/defaults, feature configuration, static fallbacks,
  native controls, image pipeline, and the recent caption/scrollbar fixes.
  Build-time schemas and image imports remain outside browser code.
- Refactor verification: pnpm check passed with zero errors/warnings and
  the existing task-018 hint; pnpm build passed, 11 pages/28 variants.
  All 106 schema/rendering checks and 209 browser regression checks pass.
- Before/after generated carousel HTML matches across 85 nodes/attributes
  after ignoring only Astro scope attributes and whitespace. All 96
  element style/size measurements match across 12 viewport/theme cases.
- Evidence: output/playwright/carousel-refactor/ includes original source
  and HTML, before/after measurements, markup/appearance comparisons,
  responsive screenshots, regression transcripts, and summary.json.
  Browser checks retain prior limitations: external assets are isolated
  and hidden-document/page-suspension events are simulated.
- Source line-length and diff checks pass; documentation reflects the
  extracted slide component and browser module.
