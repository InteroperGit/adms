# Content sources and validation

[Documentation index](../../README.md)

Edit content in `data/content/*.json` (legal documents are in `data/content/legal/`). These JSON files remain the source of truth; do not duplicate their text in components or TypeScript objects. The small settings documents keep their typed exports in `src/content/`.

Projects and reviews use direct JSON imports because each dataset is small and their existing synchronous API and array order are sufficient. Astro content collections are unnecessary here; consider them if the site grows to need collection queries or Markdown entries. See the [Astro content collections guide](https://docs.astro.build/en/guides/content-collections/).

`src/content/schemas.ts` validates project and review arrays when their exports are imported, including during `pnpm build`. Their `Project` and `Review` types are inferred from these schemas instead of maintained as separate interfaces. Validation rejects missing, unknown, incorrectly typed, or blank fields, invalid media sources, and non-positive, fractional, or duplicate IDs. Errors name the source JSON file and field path (for example, `0.title`). Media sources can be HTTP(S) URLs or root-relative paths to public assets; validation does not check whether those resources exist.

Keep project IDs stable: each numeric ID defines `/projects/<id>`, including the existing `/projects/1`, `/projects/2`, and `/projects/3` routes. Array order determines card order. After editing JSON, run `pnpm build` to validate the content and generate the pages.

Project image metadata requires `imageAlt`, `imageWidth`, and `imageHeight`; review portrait metadata requires `avatarAlt`, `avatarWidth`, and `avatarHeight`. Alternative text must be nonblank, and dimensions must be positive integers. See [project and review media](media.md) for the outstanding asset inventory and replacement workflow.

## Contacts and map settings

In `data/content/site.json`, `sections.contacts.panelTitle` controls the contact-panel heading. Phone, email, address, and opening hours use the existing top-level fields shared with the footer.

`mapEnabled` is a boolean, defaulting to `true`. When true, Contacts renders the titled, lazy-loaded iframe from `mapSrc`. When false, it renders only the local picture specified by `mapFallback`: `src` is a root-relative public asset path, `alt` is its alternative text, and `width`/`height` are its positive intrinsic pixel dimensions. Changing these settings requires rebuilding and redeploying the static site; the flag is not a visitor preference or cookie-consent switch.

The bundled `public/images/map-placeholder.png` is an original, generic map illustration (1200 x 600), drawn locally with raster primitives. Its imaginary roads, blocks, parks, and pin contain no labels and do not represent real geography or the agency location. Its empty `alt` marks it as decorative beside the visible contact address; do not use it for directions. An approved location photograph is still needed if the agency wants one; replace the source and dimensions and provide meaningful alternative text for an informative photograph. Keep the fallback local so the disabled map state requires no external image service. No directions link is included because a verified place/directions URL has not been supplied; the embed URL is not a directions link.
