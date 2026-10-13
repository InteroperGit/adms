# Project and service article authoring

Task 080 uses one ordered renderer, `src/components/content/ContentBlocks.astro`,
for project pages, service pages and the restricted MDX component mapping.
All authored JSON and MDX stays under `data/content/`.

## Sources

- `data/content/projects.json`: ordered project catalog metadata, evidence and
  article references. No legacy details/photos/story fields remain here.
- `data/content/articles/projects/<id>.mdx`: project article; strict frontmatter
  contains only `projectId`, which must match the catalog's numeric ID and entry.
- `data/content/articles/services/<slug>.mdx`: service article with strict
  title/description/approved frontmatter, as described in
  [service authoring](service-articles.md).
- `data/content/fixtures/projects-before-blocks.json`: archived migration source.
  It is regression evidence, never consumed by application loaders.

The project loader validates authored catalog records, resolves collection
entries, then validates each normalized article against `projectSchema`.
Missing/mismatched entries and unsupported MDX fail the build. There is no
runtime legacy conversion. The offline migration script is retained for audit;
do not rerun it over subsequently edited articles.

Project JSON fallback is explicit:

```json
{
  "format": "json",
  "reason": "Recorded editorial decision after MDX failure",
  "content": [{ "type": "paragraph", "paragraphs": ["Article text"] }]
}
```

Fallback content has the same production block validation and renderer as MDX.
An absent/blank reason is rejected. Service fallback additionally retains its
article metadata, following the service contract.

## Blocks and media

The gallery discriminator is `image-gallery`; its MDX component is
`ImageGalleryBlock`. The previous `image-stack` spelling is rejected by schemas
and the MDX allowlist. JSON component attributes contain literal JSON strings;
JavaScript imports, expressions and arbitrary HTML are rejected.

Image and gallery items keep src, alt, dimensions, captions and provenance.
Optional kind, cropGuidance, focalPoint and mobileFocalPoint retain editorial
media intent. Rights and approval references are preserved without rendering
private evidence as visitor copy. Project evidence slots remain catalog metadata;
null approvals remain null. No agency approval has been invented.

Shared `ContentImage.astro` resolves bundled images through Astro assets,
provides responsive variants without upscaling and reserves intrinsic geometry.
Project cards crop at 3:2 using focal coordinates; gallery views contain the
full image. Service figures retain their 4:3 crop. Only the first article media
item loads eagerly; later media and card thumbnails load lazily.

## Page context and forms

Pages pass an `ArticleContext` with their owning category, identity and
publication decision. Authored MDX cannot enable forms. Specialized forms require
the exact registered context/category/form tuple and an approved owning page.
The renderer keeps the existing lettering form, consent and projectId/serviceId
payload. Demo, missing/unknown categories and mismatches get a native link to
`/#order-inquiry`, which also works without JavaScript.

Project routes keep breadcrumbs, notice, canonical behavior, noindex and contact
actions. Stored return links accept only same-origin catalogue/static page URLs,
preserving query and fragment. Direct entry, blocked storage and corrupt values
fall back to `/projects/`. Service return links retain the homepage anchor or
homepage fallback according to catalogue visibility.

## Verification

Run `astro check`, `astro build`, `test:project-articles`,
`test:service-articles`, `test:content-blocks`, `verify:content` and `check:style`.
The project regression test compiles all 27 MDX files and compares catalog text,
evidence, descriptions, dimensions, timing, media and crop/provenance data with
the archived source. Service regression tests cover all five articles.

Set `CONTENT_ACCEPTANCE=true` only for a test build. It injects private fixture
routes under `/__article-check/` and emits to `output/playwright/task-080/dist/`.
Normal builds have neither fixture routes nor fixture sitemap entries. Serve that
directory on loopback port 4322 and run `scripts/verify-article-browser.js` through
Playwright CLI. It checks MDX/JSON DOM parity for all block types and owner gates,
mobile/desktop layout, themes, form identity/consent, gallery navigation and native
fallbacks. ECharts session IDs/canvas are normalized for DOM comparison; its
server-side data table remains compared.

Detailed touch/zoom, accessibility speech, chart interactions, media-rights
publication policy and layout-shift measurements remain tasks 081/082.

## Block publication review

Every block may carry `status: draft`, `demo` or `published`. A published
article rejects draft blocks. A block explicitly marked `published` and
containing media must include provenance `rights`, `approvedBy` and
`approvedAt` (`YYYY-MM-DD`). Unclassified legacy blocks remain valid while
they are migrated through editorial review. JSON fallback uses the same
contract and policy as MDX.
