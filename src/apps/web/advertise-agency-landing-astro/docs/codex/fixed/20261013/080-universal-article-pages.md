# 080. Shared project and service article pages

Status: fixed. Created: 2026-10-12. Completed: 2026-10-13.
Plan: [Universal blocks](../../plan/20261012_universal-content-blocks-plan.md).
Dependencies: 075a, 076, 077, 078, 079.

## Result

- [x] All 27 project articles migrated to MDX under
  `data/content/articles/projects/`; catalog metadata/order/IDs remain stable.
- [x] Project loader validates authored references and normalized articles
  directly. Runtime legacy conversion is removed from application code.
- [x] Archived legacy source retained under `data/content/fixtures/` and compared
  with all MDX articles: text, descriptions, dimensions, timing, photos/captions,
  evidence, rights/approvals and crop/focal guidance. No approvals invented.
- [x] Explicit project JSON fallback requires a nonblank editorial reason and
  uses the same production schemas and renderer as normalized MDX.
- [x] Projects, services and the MDX component map share `ContentBlocks`.
  Separate ProjectDetailOverview/ServiceContentBlocks branches are removed.
- [x] All article block types occupy one linear reading flow with shared styles,
  no persistent desktop/mobile information sidebar, and semantic block anchors.
- [x] Shared `ContentImage` replaces ProjectPhoto in cards and article media,
  preserving responsive assets, dimensions, captions and thumbnail focal crops.
- [x] First article media is eager; later gallery/media items and cards are lazy.
- [x] Forms require published page context and an exact registered tuple.
  Project/service identity, consent and existing payload/delivery behavior remain.
  Demo, absent/unknown categories and context mismatches use general inquiry.
- [x] Breadcrumbs, old project/service URLs, notice, canonical/noindex behavior,
  sitemap policy, contact anchors and service return links are preserved.
- [x] Catalogue return restores same-origin catalogue/static page URLs including
  query/fragment; direct entry, disabled JS and blocked storage retain fallback.
- [x] User-requested rename: `image-stack` → `image-gallery`,
  `ImageStackBlock` → `ImageGalleryBlock`, gallery types/schemas/exports updated.
  Old authored discriminator and MDX component fail validation.

## Verification

- Astro check: 162 files, zero errors/warnings, one existing Zod finite hint.
- Normal Astro build: 38 pages; private fixture routes absent from `dist/`.
- Project/service article regression tests, block fixtures, content invariants,
  code style and whitespace checks pass.
- Separate `CONTENT_ACCEPTANCE=true` build: 18 private fixture routes, emitted
  under `output/playwright/task-080/dist/`, excluded from normal deployment.
- Chromium checks compare MDX/JSON block DOM for nine cases at 375/1440px:
  published project/service, demo project/service, missing owner, null/unknown
  category, context mismatch and minimal article. All ten block types covered.
- Published form identity/consent and fallback ownership gates pass. Gallery
  arrows/Escape/focus return and native emitted image destination pass.
- Project/service pages checked at 375/1440px in light/dark themes, with one H1,
  no document overflow and demo noindex. Before/after screenshots inspected.
- Native no-JS inquiry/gallery/return links, blocked-storage fallback and
  catalogue return/Back/Forward state pass.

Durable browser scenario: `scripts/verify-article-browser.js`.
Local screenshots/results: `output/playwright/task-080/`.
Authoring and verification: [articles](../../../site/articles.md).

## Remaining boundaries

Task 081 owns block-level publication/media-rights gating, full evidence policy,
configured canonical/sitemap variants, bundle size and layout-shift measurement.
Task 082 owns broader chart interactions, touch/zoom, reduced motion, focus trap
and assistive-technology acceptance. Existing ECharts chunk warning remains.
External Picsum placeholder availability is not guaranteed; bundled gallery
native destinations were checked independently of those external previews.

Evidence remains catalog editorial metadata to preserve the supplied approval
records. It is not visitor copy. The offline migration helper under `scripts/`
is retained for audit and never imported by application loaders.
