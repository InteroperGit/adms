# Universal article browser acceptance — task 082

Verified 2026-10-13 with Chromium through Playwright CLI. Fixtures are private
test routes and use recorded synthetic owners, not approved production data.

## Reproduce

Set `CONTENT_ACCEPTANCE=true` for the isolated build only. Run
`astro build --site https://task-082.invalid`
`--outDir ./output/playwright/task-082/dist`. Serve that directory on loopback
port 54382. Never deploy acceptance routes or use this origin in production.
The build has 62 HTML routes, including 24 private MDX/JSON fixture routes.

Open Playwright CLI against the loopback server and use `run-code --filename`
with these durable scenarios:

- `scripts/verify-task-082-browser.js`: 40 fixture renders at 375/1440 pixels,
  minimal/full streams, DOM parity, owner/form gates, accessible labels and
  intrinsic media dimensions; eight real project/service screenshots across
  both widths and themes; stored page-two return with query/category, browser
  Back/Forward, no-JS native inquiry/gallery/chart and blocked storage.
- `scripts/verify-task-082-forms.js`: both registered specialized tuples,
  required fields/consent, conditional email, IDs, request ID and receipt-based
  success/failure. Parser-time test DOM enables only a mocked endpoint; POST is
  intercepted. Production submission configuration stays disabled.
- `scripts/verify-task-082-gallery.js`: 1/2/7 images, arrows and thumbnail
  selection, Escape/backdrop, Tab containment/return, scroll restoration,
  hover/focus, mobile touch and reduced motion. Chromium page scale confirms
  200% zoom; Escape closes the zoomed modal.
- `scripts/verify-task-082-content.js`: all ten types in sequential visual/DOM
  order at 375/1440, no persistent side panel, headings/lists/quote/footnote,
  ECharts canvas and actual pointer tooltip, native table, demo/draft gates,
  delayed emitted image decoding and frame geometry, all five service URLs
  and local article media decoding with response monitoring.

## Results and artifacts

All scenarios pass with zero captured page errors. Emitted/local resources have
zero HTTP 404s. Slow-loading media frames retain their height within one pixel.
MDX/JSON DOM is identical after normalizing ECharts canvas/instance metadata;
this is the only allowed parity difference. Semantic footnote `aside` and the
temporary gallery overlay remain permitted in the single reading flow.

Local artifacts in `output/playwright/task-082/` include scenario copies,
`browser-results.txt`, `forms-results.txt`, `gallery-results.txt`,
`content-results.txt`, eight `after-*.png` screenshots, `zoom-modal.png` and
`touch-zoom.png`, plus the isolated build and loopback server. They are ignored
by Git. This report and scenario sources are the committed evidence.

Astro check: zero errors/warnings, one existing Zod `.finite()` deprecation
hint. Changed source style passes the 80-column rule. Production schema/MDX,
project/service migration, publication and content invariant checks pass.
Normal production build contains 38 HTML routes with no acceptance routes;
the built-quality checker passes both normal and isolated builds.

## Limits

- Remote demo media/CSS are stubbed in the layout/parity scenario. A separate
  real-media run encountered an undecodable external Picsum demo URL; local
  optimized assets pass real HTTP/decode checks. Remote availability, rights
  and field performance are not asserted by these tests.
- Touch and page-scale zoom are Chromium emulation, not physical-device or
  screen-reader speech testing. Native modal semantics, accessible names,
  keyboard containment and live state are checked. Playwright's `tap` hit test
  at page scale 2 intercepted the close button; zoom closure uses Escape.
- The current category dataset has fewer than a page of matching projects.
  The return link preserves page 2/query/category; the catalog legitimately
  clamps an empty filtered result to page 1 while retaining query/category.
  Back/Forward preserves that normalized state.
- Empty tables/charts/galleries are rejected by the production schema, rather
  than rendered as empty widgets. Minimal articles omit optional wrappers;
  filtered drafts and demo streams are checked separately. Publication-policy
  tests cover draft-owner exclusion without changing real catalog content.
- The deferred ECharts bundle still produces the documented >500 kB warning.
  A production origin remains unset; the test origin is not release approval.
- Windows sandbox prevented pnpm startup; equivalent installed Node/Astro
  binaries ran the checks. Playwright required its approved elevated prefix
  to create browser daemon files in the user profile.
