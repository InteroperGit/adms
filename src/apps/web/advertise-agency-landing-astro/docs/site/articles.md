# Project and service article authoring

Task 080 uses one ordered renderer, `src/components/content/ContentBlocks.astro`,
for project pages, service pages and the restricted MDX component mapping.
All authored JSON and MDX stays under `data/content/`.

## Sources

- `data/content/config/projects.json`: ordered project catalog metadata, evidence and
  article references. No legacy details/photos/story fields remain here.
- `data/content/articles/projects/<id>.mdx`: project article; strict frontmatter
  contains only `projectId`, which must match the catalog's numeric ID and entry.
- `data/content/articles/services/<slug>.mdx`: service article with strict
  title/description/approved frontmatter, as described in
  [service authoring](service-articles.md).
- `tests/fixtures/content/`: versioned regression JSON and MDX fixtures. They
  are regression evidence and are never consumed as production content.

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

Task 081 adds production publication fixtures, generated SEO/link/resource
checks and the browser script `scripts/verify-block-browser.js`. Detailed
touch/zoom and assistive-technology speech review remain task 082.

## Block publication review

Every block and gallery image may carry `status: draft`, `demo` or `published`.
Omitted status inherits editorial requirements from the owning article.
Production approvals must come from the actual reviewer, never fixture data.

- Draft blocks and draft gallery images are omitted from public HTML. Empty
  galleries and footnotes targeting hidden blocks are omitted too. An approved
  article containing draft blocks or images fails validation; editors must
  remove the drafts or move the owning article back to review.
- Demo blocks are visible with a Russian disclosure. A visible demo block,
  demo gallery image or image with `kind: demo` makes a project/service article
  noindex and excludes it from the sitemap. Production forms remain disabled.
- Every explicitly published block requires provenance `source`, `approvedBy`
  and `approvedAt` (`YYYY-MM-DD`), even on a demo/draft page. Unclassified
  blocks in an approved article require the same approval.
- Media explicitly marked demo or published, and media in a demo/published
  gallery or approved article, requires nonblank provenance `rights`.
  Gallery approval does not replace individual media approval. A published
  gallery requires approval for every visible image. Draft gallery images are
  hidden and do not authorize publication of an approved article.
- Existing unclassified media on demo owners remains compatible while reviewed.
  This permits existing demo previews without inventing approval. It is not an
  exception for approved articles or explicitly classified media.

Project page status, all block approvals, rights and the absence of draft/demo
content must permit publication together. Service pages additionally require
the existing catalog/category/article approvals and `demoMode: false`.
Changing a page status alone cannot bypass block review. JSON fallback uses
the same contract and policy as normalized MDX.

## Editing and adding blocks

Prefer MDX for articles. Edit catalog metadata in `projects.json` or
`services.json`; preserve numeric IDs/slugs, article entry identity, evidence
and approval flags. Project frontmatter contains only `projectId`; service
frontmatter contains `title`, `description`, `approved`. Unknown fields fail.
Paragraphs and lists accept plain Markdown and one h2 before their content.
Use literal JSON block attributes for tables, charts, media, forms, quotes and
footnotes. The allowlist consists of ParagraphBlock, OrderedListBlock,
UnorderedListBlock, TableBlock, ChartBlock, ImageBlock, ImageGalleryBlock,
OrderFormBlock, QuoteBlock and FootnoteBlock. Imports, executable expressions,
arbitrary HTML, nested lists, unsupported inline markup and extra h1 fail.

Use a stable kebab-case `id` when linking a footnote or standalone heading.
IDs must be
unique in the article; footnote `targetId` must name an existing block. Tables
need column labels and matching row widths; charts need named series and finite
numeric values. Supply meaningful Russian headings, captions and image alt.
Supply intrinsic image dimensions and bundled `/src/assets/...` keys; the
renderer emits optimized URLs. External media is subject to a separate rights
and availability review. Never publish a source asset path as a browser URL.

JSON fallback requires `format: json`, a nonblank review `reason` and the same
ordered `content` stream. Use it only after a recorded editorial decision when
MDX is unsuitable; malformed or missing MDX never selects it automatically.
All authored JSON/MDX, including new examples, stays under `data/content/`.

To add a block type, extend the union in `src/types/content-blocks.ts`, its
strict schema and compile-time contract in `src/validation/content-blocks.ts`,
the MDX allowlist in `src/content/mdx-blocks.mjs`, the type labels and the scoped
Astro renderer. Define publication/media rules in `block-publication.ts`, add
valid/negative fixtures and update `ContentBlocks.astro`. Check native semantic
HTML, Russian accessible names, no-JS fallback, MDX/JSON DOM parity, responsive
overflow and resulting JS size. Load large dependencies only for visible
blocks that actually need them; keep layout dimensions stable before loading.

Run the schema/compiler tests and normal build before requesting publication
review. Confirm the real deployment origin separately; the test origin
`https://task-081.invalid` used in acceptance builds is never production config.

## Video authoring

Use `VideoBlock` for MP4, WebM, or Ogg media. Supply a root-relative or
HTTP(S) `src`, meaningful `alt`, positive intrinsic `width` and `height`, and
an optional image `poster`. Add a `caption` and a complete `transcript` when
spoken or essential visual information is not otherwise available. Use
`kind: demo` for unapproved demonstrations; autoplay is never enabled.
Published or demo videos require provenance rights, just like other media.
