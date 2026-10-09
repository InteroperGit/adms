# Content sources and validation

[Documentation index](../../README.md)

Edit content in `data/content/*.json` (legal documents are in
`data/content/legal/` ). These JSON files remain the source of truth; do not
duplicate their text in components or TypeScript objects. The small settings
documents keep their typed exports in `src/content/`.

Projects and reviews use direct JSON imports because each dataset is small and
their existing synchronous API and array order are sufficient. Astro content
collections are unnecessary here; consider them if the site grows to need
collection queries or Markdown entries. See the [Astro content collections
guide][source-1].

Offers use the same validated JSON-wrapper convention. See
[hot offers carousel](offers-carousel.md) for `data/content/offers.json`,
publication switches, ordered enabled items, stable IDs, image metadata and safe
CTA links. Task 018b retains two enabled, clearly identified test offers using
factual service copy and direct HTTPS CC0 Wikimedia Commons backgrounds. Replace
test content before production publication. JSON presentation configures
description size (1–3rem), six-digit color, validated dark/light description
rectangle, nine positions and bounded desktop/mobile focal points. Empty or
whitespace-only descriptions omit their text/background while retaining the CTA.
Images have no dimming overlay. Only description and CTA are visible; titles and
imageCredit are removed and rejected. The homepage wrapper validates all items
during builds, even when disabled. See the offers guide for contrast rules,
defaults and source/rights records.

`src/types/` owns plain domain contracts (`Project`, `Review`, `Offer`,
`Offers` ), exported through `@/types`. Executable Zod schemas live in
`src/validation/projects.ts`, `reviews.ts` and `offers.ts`; `shared.ts` owns
text/ID/media and unique-ID helpers, and `parse-content.ts` adds source/field
context. JSON wrappers in `src/content/` import their validator and parser and
expose validated values when imported, including during `pnpm build`.
Validation rejects missing, unknown, incorrectly typed, or blank fields, invalid
media sources, and non-positive, fractional, or duplicate IDs. Errors name the
source JSON file and field path (for example, `0.title` ). Media sources can be
HTTP(S) URLs or root-relative paths to public assets; validation does not check
whether those resources exist.

Keep project IDs stable. Visible demo and published records generate
`/projects/<id>`; drafts do not generate cards or routes. Array order determines
card order. The [case study guide](case-studies.md) defines structured details,
evidence, photos, publication requirements and unresolved agency inputs.
The existing IDs 1-3 remain visible as explicitly labelled, text-only demos.
Unsupported claims and unrelated Picsum placeholders have been removed.

Project photos use src/alt/width/height plus source, rights, approval and crop
metadata. Review portrait metadata still uses avatarAlt/avatarWidth/avatarHeight.
Alternative text must be nonblank and dimensions must be positive integers.
See [project and review media](media.md) for the handoff inventory.

## Introduction content

`data/content/introduction.json` keeps the heading, short service summary,
known location, inquiry action and photo metadata together. Import
`introduction` from `@/content/introduction` in the introductory section.
It follows the same domain type, strict schema and source-aware parser
conventions as other validated content. The homepage renders this content
directly after offers, with its single visible H1 and native inquiry link.

The supplied copy is a draft based on existing site/About content.
`copyApproved: false` records that the agency has not confirmed it. Limit
coverage to Череповец; do not add unsupported deadlines or guarantees.
The action is an inquiry link, not an automatic price calculator; its
destination is validated as `/#order-inquiry`.

At user request, the introduction now uses its own local CC0 photograph of
dimensional lettering, distinct from the offers carousel. The asset is
`src/assets/introduction/storefront-sign.webp`, based on [this storefront
photo by PiperMcCorkle][intro-photo-source] under CC0 1.0. It illustrates signage
and is not an agency project, client endorsement or evidence of the Череповец
location. The 4032 × 3024 source was cropped at x1200/y730 to 1440 × 1080,
then resized to 1200 × 900 and converted with Sharp at WebP quality 85.
The crop centers the sign and entrance; embedded metadata was removed.
Introduction `demoMode: true` explicitly displays this stock photo
while its approval remains false. Set `demoMode: false` for approved-only
media; its default is false. `photo: null` renders a text-only section.
Do not replace it with a Picsum, library or generated image presented as
agency work. A non-null photo requires `src`, nonblank `alt`, positive
integer `width`/`height`, `source`, `projectContext`, a recorded
`publicationPermission`, `approved` and desktop/mobile focal points.
Focal points are `{ x, y }` percentages from 0 to 100, intended for CSS
`object-position` when the layout crops with `object-fit: cover`.
Choose them by inspecting the actual photo at both viewport sizes.

Record the original supplier/file reference in `source`, the actual
completed installation in `projectContext`, and who approved publication,
when and where that permission was recorded in `publicationPermission`.
Set `approved: true` only after reviewing the actual installation and rights.
Outside demo mode, both `copyApproved` and `photo.approved` must be true;
merely adding a photo does not publish it. Approved copy without an approved
photo retains the text-only layout. Current draft copy remains visible, with
its approval flag false; this is not production acceptance of the service area.
For optimized responsive variants, use an approved original under
`src/assets/` and set `src` to `/src/assets/<filename>`. The component's
explicit import map passes local metadata to Astro Image. Supported raster
extensions are avif, jpeg, jpg, png and webp. Missing mapped assets fail
the build. Public paths and HTTP(S) sources use supplied image files;
resize/compress these before publication. With `photo: null`, the section
uses a text-only layout without a placeholder. See [media handoff](media.md).
Schema validation checks
metadata shape, not asset existence, dimensions or truth of permissions.
Confirm these manually before treating the content as publication-ready.
Task 024 was archived at user request. [Task 053][catalog-acceptance] tracks
its remaining copy approval and genuine-photo acceptance. Its inquiry action
now says «Обсудить проект» instead of implying an automatic price calculation.

## Inquiry and contacts settings

Order inquiry labels, feedback and disabled submission configuration live in
`data/content/order-inquiry.json`, with domain types and runtime validation
following the JSON-wrapper convention. See [order inquiries](order-inquiry.md)
for the delivery contract, consent gate and remaining agency dependencies.

In `data/content/site.json`, `sections.contacts.panelTitle` controls the
contact-panel heading. Phone, email, address, and opening hours use the existing
top-level fields shared with the footer.

`mapEnabled` is a boolean; the current checked-in setting is `false`. When
true, Contacts renders the titled, lazy-loaded iframe from `mapSrc`. When
false, it renders only the local picture specified by `mapFallback`: `src` is a
root-relative public asset path, `alt` is its alternative text, and `width`
/`height` are its positive intrinsic pixel dimensions. Changing these settings
requires rebuilding and redeploying the static site; the flag is not a visitor
preference or cookie-consent switch.

The bundled `public/images/map-placeholder.png` is an original, generic map
illustration (1200 x 600), drawn locally with raster primitives. Its imaginary
roads, blocks, parks, and pin contain no labels and do not represent real
geography or the agency location. Its empty `alt` marks it as decorative beside
the visible contact address; do not use it for directions. An approved location
photograph is still needed if the agency wants one; replace the source and
dimensions and provide meaningful alternative text for an informative
photograph. Keep the fallback local so the disabled map state requires no
external image service. No directions link is included because a verified
place/directions URL has not been supplied; the embed URL is not a directions
link.

## Changing a domain field

Update the plain contract in `src/types/` and the corresponding item or settings
schema in `src/validation/` together, then update JSON and consumers. Each
validator has compile-time item and aggregate checks for both assignability
directions and field keys, including optional fields; offers also check nested
`OfferPresentation` and `OfferFocalPoint`. `pnpm check` rejects drift.
`Offers.intervalMs` is required in the validated contract even when omitted from
raw JSON: validation supplies 7000. `Offer.presentation` is likewise always
present after parsing, with all inner defaults applied; `mobileFocalPoint`
remains optional. The assertions compare schema output, leaving schema input
defaults valid.

Import direction is JSON + validation → content wrappers → server-rendered
components; validation imports domain contracts with `import type` only. Domain
contracts never import content, validation or Zod. Keep validation out of
browser scripts. Shared project/review media rules remain broader than the
offer-specific safe-link rules in `offers.ts`; do not tighten them
inadvertently.

Task 017a verification: `node output/playwright/task-017a/verify.mjs` exercises
schemas, source-aware parser failures and actual wrappers for all three
datasets. `verify-contracts.mjs` temporarily changes schema/domain fields to
confirm compile-time rejection and restores each file. These ignored local
helpers are evidence rather than application APIs.


[source-1]: https://docs.astro.build/en/guides/content-collections/
[catalog-acceptance]: ../codex/fixed/20261010/053-publish-approved-introduction-and-services.md
[intro-photo-source]: https://commons.wikimedia.org/wiki/File:Storefront_of_Rack_Room_Shoes_store_at_Brenham_Crossing.jpg
