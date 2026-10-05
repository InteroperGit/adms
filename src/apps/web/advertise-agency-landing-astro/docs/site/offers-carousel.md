# Offers carousel content

[Documentation index](../../README.md)

## Publication and ownership

Edit `data/content/offers.json`. The retained enabled baseline contains two
explicitly identified test offers with factual service copy; stock photographs
do not show agency work. Replace demos with agency-approved content before
production publication. No prices, discounts, deadlines or results are inferred.
Without JavaScript, offers remain an ordered stacked list with native links.
Configured autoplay follows the JSON setting with temporary safety holds.

`src/content/offers.ts` validates the entire document, exports `offers`, and
filters `enabledOffers` once in editorial order. Consumers respect global
`enabled`; zero enabled items omit the region and one renders statically.
Disabled items are validated. Plain interfaces `Offer`, `Offers`,
`OfferPresentation`, `OfferFocalPoint` live in `src/types/offer.ts`; strict
runtime schemas and bidirectional output compatibility checks live in
`src/validation/offers.ts`. Change contracts, schemas, JSON and consumers
together. Parser errors identify the source and field path.

## Settings

- `enabled`, `autoplay`; Rule / default: Required booleans; autoplay requests
  rotation on initialization, subject to the constraints below.
- `intervalMs`; Rule / default: Integer ≥5000; omitted input defaults to 7000.
- `items`; Rule / default: Required ordered array; zero/one/multiple valid.
- Item `id`, `enabled`; Rule / default: Unique positive integer (including
  disabled items), required boolean. Keep stable IDs.
- `description`; Rule / default: Required string; empty or whitespace-only text
  hides the description and its rectangle. The CTA remains visible.
- `linkLabel`; Rule / default: Required nonblank string naming the CTA
  destination.
- `image`; Rule / default: Safe root-relative public path or absolute HTTP(S)
  URL; retained demos use direct HTTPS URLs, no local assets/downloads.
- `imageAlt`; Rule / default: Meaningful text for informative artwork or
  exactly empty for decorative artwork; no whitespace-only value.
- `imageWidth`, `imageHeight`; Rule / default: Positive integer intrinsic
  dimensions matching the actual remote image.
- `href`; Rule / default: Safe root-relative path, nonempty local fragment or
  absolute HTTP(S) URL.
- `presentation`; Rule / default: Optional strict object; missing keys default
  below.
- `presentation.fontSizeRem`; Rule / default: Number 1–3 inclusive; default
  1.125. Description size in rem.
- `presentation.textColor`; Rule / default: Opaque six-digit hex; default
  `#ffffff`. Must pass contrast for the selected description rectangle.
- `presentation.overlay`; Rule / default: `dark` (default) or `light`;
  retained field name now selects the opaque black or white rectangle behind
  description text only. No image-wide overlay.
- `presentation.horizontal`; Rule / default: `left` (default), `center`,
  `right`. Places and aligns description/CTA.
- `presentation.vertical`; Rule / default: `top`, `center`, `bottom`
  (default). Requires spare height to show alignment.
- `presentation.focalPoint`; Rule / default: Optional strict `{x,y}` object,
  numeric percentages 0–100 inclusive; omitted axes default 50.
- `presentation.mobileFocalPoint`; Rule / default: Optional strict `{x,y}`
  override below 47rem; omitted override uses desktop focal point, omitted axes
  default 50.

Titles and `imageCredit` have been removed from item/aggregate contracts and are
rejected as unknown fields. All objects reject unknown fields, null and
arbitrary CSS. URLs reject credentials, protocol-relative URLs, unsafe schemes,
whitespace/control characters and backslashes. Validation checks syntax, not
source availability, destination existence or publication approval.

Example presentation:

```json
{
  "fontSizeRem": 1.25,
  "textColor": "#18222d",
  "overlay": "light",
  "horizontal": "right",
  "vertical": "center",
  "focalPoint": { "x": 50, "y": 50 },
  "mobileFocalPoint": { "x": 65, "y": 50 }
}
```

## Layout and accessibility

The homepage component starts immediately below the header and preserves its
single visually hidden h1. The region has Russian accessible name «Предложения»;
articles have «Предложение N из M», stable `offer-ID` anchors and
`data-offer-id`. There are no visible replacement headings, credits,
placeholders. Carousel semantics are added only after initialization. Slide
content is description plus CTA only, over a full-width `object-fit: cover`
image. Copy wrappers are transparent. Only a nonempty description receives a
padded rectangular black/white background, with no rounded corners. The CTA sits
outside this rectangle; an empty description creates no paragraph or background
and no extra gap before the CTA. Images have no dimming overlay.

Inner copy uses site gutters and a 36rem maximum width; below 47rem it fills
inner width and keeps requested text alignment. All nine positions remain
supported. Minimum slide height is `clamp(23rem, 36vw, 34rem)`, 25rem below
47rem, and 20rem for wider short landscape screens. Long/enlarged copy expands
slides. Bottom spacing provides 4.5–5.5rem of breathing room without
placeholders. First image eager, later images lazy; explicit dimensions and
asynchronous decoding preserve geometry independent of loading. Failed images
retain neutral black/white fallback, text and native CTAs. No styling JavaScript
is required to measure heights.

Description text uses an opaque black rectangle for `overlay: dark` or white for
`light`. `offerTextContrast` rejects colors below 4.5:1 against that rectangle,
independently of image brightness. Empty and whitespace-only descriptions render
no rectangle. CTA white on orange `#b2380a` remains 6.06:1; a white focus
outline with a black outer ring remains visible on bright and dark imagery.

## Remote demo rights

Both source pages and CC0 terms were reviewed 2026-10-05, and both direct URLs
loaded in Chrome at matching dimensions. These library images are test
backgrounds, not agency projects or endorsements. No visible credit is required
under their public-domain dedication; source/creator records remain here
voluntarily. Recheck availability and terms when replacing images;
attribution-required imagery needs another suitable source while this UI has no
credit.

- 1; Creator / source: Rakoon, [Office interior 2022 queue][source-1]; Direct
  background and dimensions: [HTTPS image][source-2], 1280 × 960; Terms:
  [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/), permits
  copying/modification/commercial use without permission or displayed credit.
- 2; Creator / source: Parpeliupant, [IS Real Estate Office Interior Torrevieja
  2024-10-23][source-3]; Direct background and dimensions: [HTTPS
  image][source-4], 1280 × 961; Terms:
  [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Replaces the
  attribution-required Shixart1985 image.

## Task 018b verification (historical layout)

160 schema/parser/wrapper assertions cover defaults, all positions, focal
bounds, contrast, unsafe URLs, removed/unknown fields, IDs, dimensions,
intervals and ordered exports. Chrome passed 16 Light/Dark × 320/375/768/1440px
× normal/200% root-text combinations, short 844×390 landscape, all nine
positions, keyboard focus, source loading and target existence, absent
headings/credits/panel, full-width coverage, focal overrides and no overflow.
Four long/unbroken description/CTA checks at maximum 3rem and 200% root text
expanded without clipping. Bright/dark/checkerboard backgrounds passed 4.5:1;
retained demos have conservative 9.23:1/8.07:1 minima. Slow/failure and
both-theme no-JavaScript checks preserve copy/links and geometry. Actual server
fixtures cover zero/global-disabled/all-disabled/one/filtered items and restore
enabled demo bytes.

`pnpm check`, `pnpm build` and diff checks pass. Evidence
scripts/results/screenshots are under ignored `output/playwright/task-018b/`.
Checks use development output; native browser zoom was not tested (200% root
text is separate). Historical task evidence remains historical; task 021 owns
integrated production review. No commit or deployment.


## Description background follow-up

Removed the whole-image wash and placed an opaque square-corner rectangle behind
the description only. Empty/whitespace text is valid JSON and omits both text
and rectangle; CTA and background image remain. Historical task-018b results
above describe its earlier implementation.

Follow-up verification: 162 schema/parser/wrapper assertions passed. Chrome at
320/1440px confirmed no image overlay, square-corner description rectangles and
no overflow. Actual empty/whitespace JSON fixtures rendered zero
paragraphs/backgrounds with two images and CTAs; original demo JSON restored.
`pnpm check` passed with zero errors/warnings and one preexisting ignored-script
hint; `pnpm build` generated six pages. Evidence: ignored
`output/playwright/description-background/`.

Description rectangles use 25% black/white backing; images and CTAs remain
fully opaque. Component CSS uses documented multiline declarations and
purpose comments for each rule.

## Manual navigation (task 019, historical placement)

With multiple items, a small Astro browser script initializes one current-slide
index. Previous/next native buttons wrap through editorial order; circular dot
buttons select directly and expose `aria-current="true"`. The current dot has
a filled center and extra outline. A quiet numeric counter provides position.
Local inline SVG arrows have Russian accessible names. All targets are at least
44×44px at the default text size and have visible theme-aware focus outlines.
Tab, Enter and Space use native browser behavior; no global keys are captured.
Manual changes update the polite Russian status; initialization stays silent.
Focus stays on the activating button. CTAs remain separate native anchors.

Controls appear only after initialization and only for multiple items. One item
is static; disabled/empty lists omit the region. A script failure leaves the
stacked fallback and hides controls. Inactive slides use `aria-hidden`, `inert`
and `visibility: hidden`, so links and content are absent from the accessibility
tree and keyboard order. Their grid geometry remains in the shared track,
reserving the tallest slide without measuring or clipping text. Layout adapts
automatically to resizing and enlarged/long copy. The separate control row
wraps and stays clear of descriptions and CTAs. Active slides fade for 160ms
only when reduced motion is off. No autoplay, swipe or pause/play is added yet.

Task 019 verification: Chrome passed 16 light/dark × 320/375/768/1440px ×
normal/200% root-text combinations, both-theme 844×390 landscape and resizing.
Arrows wrap, dots/counter agree, manual status is polite, native CTA targets
work, Enter/Space retain focus, and Tab skips inactive CTAs. Controls have
44px minimum targets, visible focus and no overlap with copy. Rotation height
stays stable with no horizontal overflow. Reduced motion removes animation.
Both-theme no-JS and blocked-image fallbacks preserve content/links; both remote
images also loaded successfully. Four maximum-size, long/unbroken copy/CTA
checks with 200% text expanded without clipping and preserved rotation height.
Actual JSON fixtures passed zero/global-disabled/all-disabled/one/filtered and
restored-multiple cases. Original JSON bytes, including `enabled: true`,
`autoplay: true` and `intervalMs: 7000`, were restored.

`pnpm check` reports zero errors/warnings and one preexisting ignored-script
hint; `pnpm build` generates six pages. Browser evidence is under ignored
`output/playwright/task-019/`. Checks use development output; native browser
zoom, screen-reader speech and integrated production performance remain outside
this scoped check. Task 021 owns integrated production verification. No commit
or deployment.

## Overlay navigation (task 019a)

Navigation now sits inside the image area. Circular previous/next buttons are
vertically centered at its left/right edges. On fine-pointer hover devices,
arrows fade in/out over 180ms as the pointer enters/leaves the carousel. Hidden
arrows do not intercept clicks. Keyboard focus within the carousel reveals
arrows and preserves focus visibility; touch/non-hover devices keep them visible.
Reduced motion removes meaningful reveal animation. Arrow backgrounds use
solid theme tokens so icons stay readable independently of the photograph.

Standalone equal-radius circles sit at the bottom horizontal center. The
selected circle is filled; others are empty outlines. There is no visible group
container, pill, button background, hover background or selected highlight area.
White markers have a small dark shadow for bright-image legibility. Invisible
button targets remain at least 44px; keyboard focus adds a white/black outline.
The visible numeric counter and its updates are removed. Accessible slide/dot
labels and concise polite manual status remain.

Control size is bounded at 44–56px to preserve reading space when text grows.
The content stage reserves responsive side padding for arrow targets, focus
outlines and a gap, and bottom padding for the indicators. Padding remains when
arrows hide, so hover/focus causes no text movement. A small ResizeObserver
updates bottom clearance when the indicator group wraps or resizes. Slide
height still comes from the shared tallest grid track; content is never clipped.
One/zero/no-JS behavior and native CTA links remain as described above.
Autoplay/pause/play are described in the task 020 section below.

Verification: Chrome passed 16 light/dark × 320/375/768/1440px × normal/200%
root-text cases, including 144 copy-position combinations, circular button/icon
centering, bottom dot centering, fill-only selection, transparent dot controls,
44px targets, no overlap/overflow and stable rotation height. Pointer entry/exit,
rapid re-entry, control-entry stability, hidden hit testing, unchanged hover
geometry, Tab/Enter/Space, focus reveal, native CTA navigation and reduced motion
passed. Both-theme touch and no-JS cases passed, as did short 844×390 landscape,
resizing and four long/unbroken description/CTA cases at maximum 3rem with 200%
text. Artificially wrapped indicators retained clearance. Bright/black image
fallback screenshots and loaded images were checked; desktop/mobile loaded
screenshots were visually reviewed. Six actual JSON fixtures passed and original
bytes/publication settings were restored (`enabled: true`, `autoplay: true`,
`intervalMs: 7000`, two demo items).

`pnpm check`: zero errors/warnings, one preexisting ignored task-018 script hint.
`pnpm build`: six pages. Diff and 80-column component code checks pass. Evidence:
ignored `output/playwright/task-019a/`. Checks use development output; native
browser zoom, screen-reader speech and integrated production performance remain
unverified. Task 021 owns integrated production review. No commit or deployment.


## Autoplay and explicit pause/play (task 020, historical)

The existing Astro script reads validated `autoplay` and `intervalMs` from the
region. There is one timeout per initialized carousel. Zero items omit the
region; one stays static with no controls or timer. Multiple items without
JavaScript remain stacked with controls hidden. No storage or cookies are used.

An always-visible circular rotation button sits at the bottom right, separate
from the centered dots. Its solid theme background, Russian accessible action
name, local pause/play SVG, 44–56px target and white/black focus outline match
the existing controls. The dots reserve horizontal room for this button and
wrap within that space; shared bottom clearance keeps both controls below copy.
Controls precede slides in keyboard order, with rotation first.

Rotation has a requested state and temporary constraints:

- Initial request: `autoplay: true`, multiple items and reduced motion off.
  `autoplay: false` starts paused but still allows explicit Play.
- Temporary holds: pointer hover (excluding touch), focus anywhere within the
  carousel, hidden document, no viewport intersection or page suspension.
  Rotation resumes only if its request remains active and every hold is gone.
- Persistent stops: Pause, arrow/dot selection, focus entering a CTA or another
  navigation control, and keyboard interaction within the carousel. Leaving
  focus/hover does not clear these stops; explicit Play is required.
- Play toggles the request but does not override any temporary hold or reduced
  motion. Pause remains the button action while a requested rotation is held.
  To resume with the keyboard, activate Play then Shift+Tab outside the region.
  Tab toward other carousel controls stops the request again. Modifier keys
  alone do not stop it. Focus remains on the activating button.
- Reduced motion starts paused and removes slide animation. Enabling reduced
  motion during a visit cancels the request. Explicit Play while reduced motion
  is on waits until that preference and all other holds are cleared.
- Every state change clears the outstanding timeout before scheduling a fresh
  full interval. There are no accumulated ticks or catch-up changes. Pagehide
  clears the timer; pageshow restores the same request subject to all holds.

Automatic selection updates slides, inert state and selected dots silently.
It never moves focus or changes the polite manual-navigation status. The focus
gate prevents a focused CTA from being replaced automatically.

Production Chrome verification on 2026-10-06 passed a real approximately 7s
interval and wrap, plus controlled-clock checks for interval boundaries,
hover/resume, persistent Pause, Play, manual arrow/dot stops, keyboard restart,
focused CTA safety, offscreen/resume and reduced-motion changes. Rapid repeated
visibility events did not create duplicate timers; Play and combined hover
constraints respected simulated hidden-document state. Sixteen light/dark ×
320/375/768/1440px × normal/200% root-text layouts passed target, clearance and
overflow checks. Short 844×390 landscape and no-JavaScript stacked links passed.
Desktop/mobile screenshots were captured and the mobile image reviewed.

Actual JSON fixtures were built and checked in Chrome for zero, one and
autoplay-off items, including explicit Play with autoplay off. Original JSON
bytes were restored (`enabled: true`, `autoplay: true`, `intervalMs: 7000`, two
items), and production output rebuilt. `pnpm check` reports zero errors/warnings
and one preexisting ignored task-018 script hint; `pnpm build` generates six
pages. Evidence is under ignored `output/playwright/task-020/`.

Native hidden-tab verification remains pending: tab switching and minimizing
headed automated Chrome, including disabling focus emulation, did not change
`document.hidden`. Hidden/visible event tests therefore override that getter
explicitly; they verify the production state handling, not a native tab
transition. Task 020 was archived as fixed at the user's request on 2026-10-06;
task 021 carries this native visibility verification gap.
Native zoom, screen-reader speech and integrated performance remain task 021
work. No commit or deployment.

## Settings-controlled autoplay (task 020a)

Task 020a supersedes task 020's pause/play button and persistent manual stops.
The autoplay button, icons, labels, event handlers and styles are removed.
Dots remain centered and use the full available bottom width without reserving
space for a deleted button; copy still reserves arrow and indicator clearance.

`autoplay: true` enables rotation for multiple offers using the validated
`intervalMs`. `autoplay: false` keeps automatic rotation off for the page visit.
There is no user-requested state or visitor override. Manual arrows/dots reset
its interval and preserve polite manual position status.

Hover (excluding touch), focus anywhere within the carousel, hidden document,
no viewport intersection, page suspension and reduced motion are temporary
holds. Clearing all holds automatically schedules one fresh full interval when
autoplay is enabled. Focused CTA content stays active; automatic changes never
move focus or update the live status. Reduced motion removes slide animation
and suppresses rotation, including on initial load. Clearing that preference
allows configured autoplay to resume. Every reconciliation clears the previous
timeout before scheduling, preventing duplicate timers and catch-up changes.

Zero/one offers remain omitted/static; no-JS offers are stacked native links
with controls hidden. No content/schema/storage changes are required.

[source-1]:
  https://commons.wikimedia.org/wiki/File:Office_interior_2022_queue.jpg
[source-2]:
  https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Office_interior_2022_queue.jpg/1280px-Office_interior_2022_queue.jpg
[source-3]:
  https://commons.wikimedia.org/wiki/File:IS_Real_Estate_Office_Interior_Torrevieja_2024-10-23.jpg
[source-4]:
  https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/IS_Real_Estate_Office_Interior_Torrevieja_2024-10-23.jpg/1280px-IS_Real_Estate_Office_Interior_Torrevieja_2024-10-23.jpg
