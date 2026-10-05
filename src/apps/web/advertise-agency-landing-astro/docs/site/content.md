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

Keep project IDs stable: each numeric ID defines `/projects/<id>`, including
the existing `/projects/1`, `/projects/2`, and `/projects/3` routes. Array
order determines card order. After editing JSON, run `pnpm build` to validate
the content and generate the pages.

Project image metadata requires `imageAlt`, `imageWidth`, and `imageHeight`;
review portrait metadata requires `avatarAlt`, `avatarWidth`, and
`avatarHeight`. Alternative text must be nonblank, and dimensions must be
positive integers. See [project and review media](media.md) for the outstanding
asset inventory and replacement workflow.

## Contacts and map settings

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
