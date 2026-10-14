# Content block quality verification — task 081

Verified on 2026-10-13. Publication rules and authoring instructions are in
[articles.md](articles.md). No production domain or approval was invented.

## Automated acceptance

- `pnpm check`: Astro diagnostics and the 80-column changed-file check.
- `pnpm build`: 38 production HTML pages, no acceptance routes.
- `node scripts/test-content-block-fixtures.mjs`: production Zod schemas and
  actual MDX compilation, all ten types, negative/cross-block cases.
- `node scripts/test-publication-policy.mjs`: actual shared policy plus project
  and service schemas; JSON/MDX, inherited/explicit approval, nested media rights,
  draft/demo filters, published sitemap path membership and form gating.
- `node scripts/test-project-articles.mjs`: all 27 production project articles,
  metadata/media/evidence parity, emitted assets, demo SEO and draft visibility.
- `node scripts/test-service-articles.mjs`: all five service articles, actual
  schemas and compiler, legacy-field rejection and category/article approval.
- `node scripts/verify-content-invariants.mjs`: recursive production JSON;
  historical/negative fixtures are handled by dedicated schema tests.
- `node scripts/verify-built-quality.mjs`: semantic headings, alt/dimensions,
  local links/fragments/resources, responsive srcset variants, duplicate IDs,
  exactly one eager/high-priority lead image per real article, absent canonical
  and empty sitemap without an origin; no draft sentinel in rendered HTML.

The isolated SEO/browser build uses `CONTENT_ACCEPTANCE=true`,
`pnpm build --site https://task-081.invalid`
`--outDir ./output/playwright/task-081/dist`. This reserved test domain is never
written into production configuration. The build contains 58 HTML pages;
test-only routes are excluded from the sitemap. Run the HTML checker with
arguments `output/playwright/task-081/dist https://task-081.invalid` to verify
the configured canonical origin, sitemap and exclusion of noindex pages.

Serve the isolated directory on loopback port 4322. Run Playwright CLI with
`run-code --filename scripts/verify-block-browser.js`. Acceptance covers six
fixture cases in both MDX/JSON at 375 and 1366 pixels: ten block types, DOM
parity, published/demo robots, draft block/image exclusion, footnotes, Russian
chart fallback/gallery names, production form gates, no horizontal overflow,
lazy chart initialization, gallery keyboard navigation and focus return.
It also checks the native table and gallery link without JavaScript.
The gallery width ratio was 0.75, center offset 0 pixels, measured article CLS
0 and page/console error count 0 in the controlled browser run. Screenshot:
`output/playwright/task-081/blocks.png`.

## Size baseline and result

Measurements use `node scripts/measure-article-assets.mjs`. Sizes are bytes;
gzip is locally computed, not a claim about deployment compression. Initial
JS includes inline scripts and their static imports, excluding lazy imports.

| Route | HTML before | HTML after | JS before | JS after |
| --- | ---: | ---: | ---: | ---: |
| `/projects/2/` | 58,450 | 59,354 | 9,782 | 9,802 |
| `/services/svetovye-bukvy/` | 26,878 | 26,878 | 7,004 | 7,004 |

Project HTML gzip: 12,187 → 12,292; service HTML gzip: 7,881 → 7,883.
Initial JS gzip: project 4,308 → 4,343; service 3,182 → 3,182.
The project increase comes from the demo disclosure and Russian gallery labels.
No framework island or additional hydration was introduced.

The old statically imported chart bundle was 581,767 bytes (196,774 gzip).
The new runtime is 553,377 bytes (186,213 gzip), requested only when an
actual chart intersects the viewport. Browser requests confirm zero ECharts
downloads on project/service/minimal pages without a chart. The fixture page
with a chart has about 11.3 kB initial JS (5.1 kB gzip), plus the runtime after
visibility. Its complete native data table is available before loading.

Decision: retain the useful chart types and the explicit >500 kB build warning;
do not raise the warning threshold. Defer this isolated runtime behind visible
charts and remove unused feature imports. Further renderer/type reduction needs
a product decision about supported charts, not arbitrary chunk splitting.

## Review and fixes

Three self-review passes checked the diff and repeated affected acceptance:

1. Replaced duplicated test logic with production policy/schema calls; covered
   unclassified media approval, nested image states and rights. Removed eager
   loading from gallery thumbnails; retained only the first lead image eager.
   Translated chart/gallery defaults and kept keyboard focus on controls.
2. Disabled production forms for mixed demo streams, removed chains of notes
   targeting filtered drafts, guaranteed project demo disclosure and tightened
   explicitly classified demo media rights. Added actual DOM-parity comparison;
   it caught mutation of cached MDX fixture data between prerendered routes.
   Fixed fixture preparation with a cloned stream and a test-only adapter.
3. Preserved chart observers/canvas for Back/Forward cache restores while still
   releasing resources on a real unload. Final checks found no remaining
   blocking findings.

## Known limitations

- Astro still reports the existing Zod `.finite()` deprecation hint. There are
  zero type errors/warnings; the finite-value contract remains tested.
- The deferred ECharts chunk still triggers the documented build size warning.
- External demo media/CDN styles are stubbed in deterministic browser tests.
  Bundled media and local links are real requests. Remote availability, legal
  evidence and field CLS cannot be proved by this controlled acceptance run.
- Existing unclassified media on demo owners remains compatible. Explicit
  demo/published media and approved articles enforce rights/approval rules.
  Editorial approval is a recorded reference, not an automated legal check.
- Detailed touch/zoom and assistive-technology speech review remain task 082.
- Production origin remains unset. Release verification with the confirmed
  deployment domain is separate; no test origin is a production substitute.

Video acceptance is included in the current block fixture: poster, caption,
transcript, failed source, native controls, keyboard focus, reduced-motion,
print and no-JavaScript fallback are reviewed at 320, 768 and 1440 pixels in
both themes. The fixture source is intentionally unavailable so the fallback
path stays covered.
