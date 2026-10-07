# Shared image carousel

`src/components/ui/ImageCarousel.astro` validates caller configuration
and renders the carousel shell/controls. `ImageCarouselSlide.astro` owns
individual slide markup, responsive images, and scoped presentation.
The browser-only `image-carousel.ts` module owns autoplay, enhancement,
and lifecycle cleanup. Sections own content and surrounding layout.
No framework hydration is used; the public component API is unchanged.

## Component API

Required props: unique HTML `id`, accessible `label`, and ordered `items`.
Optional `itemLabel` defaults to «Изображение»; `slideIdPrefix` defaults to
`<id>-slide`. Keep both instance IDs and slide prefixes unique per page.
`options` accepts a partial configuration; omitted settings use defaults.

| Option | Default | Behavior |
| --- | --- | --- |
| enabled | true | False omits the complete instance. |
| autoplay | true | Requests automatic ordered rotation and wrapping. |
| intervalMs | 7000 | Integer, minimum 5000; every resume starts fresh. |
| manualNavigation | true | Enables selection by rendered controls. |
| arrows | true | Renders arrows only when manual navigation is enabled. |
| circles | true | Shows item circles; passive when manual is disabled. |
| descriptions | true | Renders nonblank supplied descriptions. |
| buttons | true | Renders supplied link/button pairs. |
| animation | true | Enables fades; reduced motion always overrides. |
| layout | full | `full` preserves offers; `panel` uses an inline frame. |
| imageFit | cover | `cover` crops; `contain` preserves the entire image. |
| aspectRatio | 4 / 3 | Positive numeric ratio for panel frames. |
| eagerFirst | true | Eager first image; false makes all images lazy. |

Feature switches are independent. Manual navigation overrides arrows and
circle interaction, but never hides circles when `circles` is true.
Disabled descriptions/buttons omit their content stage and spacing.
There are no swipe handlers or document-wide keyboard shortcuts.
Accessibility holds, focus behavior, and cleanup are mandatory.

Items need a positive unique numeric ID, image source, alt text, positive
intrinsic dimensions, and optional `enabled` (default true). Description
is optional. Supply both `href` and `linkLabel` or neither. Image-only
items need no button/description fields. Optional presentation settings
cover text size/color/alignment, backing, and desktop/mobile focal points.
See the shared types/schema for bounds and contrast validation.

Only root-relative or HTTP(S) image sources are accepted. Local originals
under `/src/assets/` are resolved through Astro and generate responsive
variants; missing originals fail the build. Remote/public files retain
supplied URLs/dimensions without build-time remote downloads.

## Consumers and editing

OffersCarousel retains the outer `offers` anchor and passes validated
`data/content/offers.json` items/autoplay/timing to the shared component.
Its existing description, button, alignment, and crop settings remain.
The offers JSON contract and public validation exports are unchanged.
Autoplay configuration is supplied at render time, as before; rebuilding
is required after editing JSON. Theme settings remain independent.

About uses `data/content/about-carousel.json`, parsed by
`src/content/about-carousel.ts`. This file exposes all options and images.
It enables autoplay/circles and disables manual navigation, arrows,
descriptions, and slide buttons. About's own contact/project actions stay
outside the carousel. Its images sit right of the introduction at wide
widths, then stack before statistics below 64rem.

The current three local PNGs are existing service demo illustrations:
`svetovye-bukvy-demo`, `neon-demo`, and `vyveski-demo`. They are not agency
photographs or verified completed work. Image alt text identifies that
distinction; no visible caption is rendered. Supply approved assets before
replacing them; record provenance/permissions in the media handoff.

## Fallback and lifecycle

Zero enabled items omit the instance; one renders statically without
controls, circles, or timer. Static HTML keeps all slides accessible until
successful initialization. Without JavaScript, images/content stack.

Each custom-element instance owns its timer, handlers, and observers.
Autoplay pauses for hover, focus within, hidden documents, offscreen state,
page suspension, and reduced motion. Touch does not latch hover. Manual
changes retain focus and restart a full interval after holds clear; only
manual changes announce position. Automatic changes stay silent.

With no usable manual navigation and autoplay disabled or reduced motion
active, all images form a static gallery. This keeps About images
accessible without adding prohibited manual controls. Restoring motion
re-enhances eligible instances. Missing/failed observers leave static
content accessible; removal clears timers/listeners/observers and restores
slides. Reattachment initializes again without duplicate handlers.

Images reserve frame geometry even on load failures. A shared grid track
reserves the tallest slide during rotation. Control clearance follows
only rendered arrows/circles, including wrapping circles/enlarged text.

## Verification

Task 038 records schema/rendering checks, production responsive screenshots,
feature combinations, independent instances, autoplay timing, reduced
motion, no-JavaScript themes, failed images/observers, and reconnection.
Artifacts live under ignored `output/playwright/task-038/`.
Hidden-document and page-suspension checks simulate lifecycle events;
external demonstration URLs were deliberately aborted for layout checks.
Those checks do not establish external image availability or photo approval.

Slides use the dedicated `carousel-slide` class to avoid DaisyUI's
`.carousel` utility, which forces horizontal scrolling and native
scrollbar UI even when image content fits the frame.
