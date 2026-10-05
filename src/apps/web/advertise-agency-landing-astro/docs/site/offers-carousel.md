# Offers carousel content

[Documentation index](../../README.md)

## Publication and ownership

Edit `data/content/offers.json`. The retained enabled baseline contains two
explicitly identified test offers with factual service copy; stock photographs
do not show agency work. Replace demos with agency-approved content before
production publication. No prices, discounts, deadlines or results are inferred.
Tasks 019–020 own navigation/autoplay; the current component remains static with
ordered stacked offers and native links, including without JavaScript.

`src/content/offers.ts` validates the entire document, exports `offers`, and
filters `enabledOffers` once in editorial order. Consumers respect global
`enabled`; zero enabled items omit the region and one renders statically.
Disabled items are validated. Plain interfaces `Offer`, `Offers`,
`OfferPresentation`, `OfferFocalPoint` live in `src/types/offer.ts`; strict
runtime schemas and bidirectional output compatibility checks live in
`src/validation/offers.ts`. Change contracts, schemas, JSON and consumers
together. Parser errors identify the source and field path.

## Settings

- `enabled`, `autoplay`; Rule / default: Required booleans; autoplay
  configures later behavior.
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
placeholders or carousel semantics before navigation exists. Visible slide
content is description plus CTA only, over a full-width `object-fit: cover`
image. Copy wrappers are transparent. Only a nonempty description receives a
padded rectangular black/white background, with no rounded corners. The CTA sits
outside this rectangle; an empty description creates no paragraph or background
and no extra gap before the CTA. Images have no dimming overlay.

Inner copy uses site gutters and a 36rem maximum width; below 47rem it fills
inner width and keeps requested text alignment. All nine positions remain
supported. Minimum slide height is `clamp(23rem, 36vw, 34rem)`, 25rem below
47rem, and 20rem for wider short landscape screens. Long/enlarged copy expands
slides. Bottom spacing reserves 4.5–5.5rem for future controls without
placeholders. First image eager, later images lazy; explicit dimensions and
asynchronous decoding preserve geometry independent of loading. Failed images
retain neutral black/white fallback, text and native CTAs. No styling JavaScript
is added.

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

Background image opacity is 25% (`.offer-background`); description rectangles
and CTA remain fully opaque. Component CSS uses documented multiline
declarations and purpose comments for each rule.


[source-1]:
  https://commons.wikimedia.org/wiki/File:Office_interior_2022_queue.jpg
[source-2]:
  https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Office_interior_2022_queue.jpg/1280px-Office_interior_2022_queue.jpg
[source-3]:
  https://commons.wikimedia.org/wiki/File:IS_Real_Estate_Office_Interior_Torrevieja_2024-10-23.jpg
[source-4]:
  https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/IS_Real_Estate_Office_Interior_Torrevieja_2024-10-23.jpg/1280px-IS_Real_Estate_Office_Interior_Torrevieja_2024-10-23.jpg
