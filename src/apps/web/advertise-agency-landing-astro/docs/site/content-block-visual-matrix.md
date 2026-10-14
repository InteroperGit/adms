# Content block visual matrix — VCB-02

The private `/__visual-check/{long,optional,form,demo}/` routes render all ten
current block types through the production `ContentBlocks` component. Fixture
content lives in `data/content/fixtures/visual-blocks.json` and is validated
at build time. These routes exist only with `CONTENT_ACCEPTANCE=true` and are
always noindex. Video joins this fixture after its contract in VCB-10–12.

`long` exercises headings, captions, unbroken strings, a ten-item numbered
list, comparison data, zero values and local images. `optional` omits optional
text and image captions: blank strings are invalid by design. `form` supplies
a synthetic published owner for the existing specialized form; `demo` supplies
an unpublished owner. Neither variant changes delivery configuration or
production content. Ownerless variants use the general inquiry link.

## Reproduce

Run from the project root in PowerShell:

```powershell
$env:CONTENT_ACCEPTANCE = 'true'
pnpm build
Remove-Item Env:CONTENT_ACCEPTANCE
node scripts/serve-content-acceptance.mjs
```

Keep the loopback server running and use another terminal:

```powershell
New-Item -ItemType Directory -Force output/playwright/vcb-02
npx.cmd --yes --package @playwright/cli playwright-cli `
  open http://127.0.0.1:54382/__visual-check/long/
npx.cmd --yes --package @playwright/cli playwright-cli `
  run-code --filename scripts/verify-visual-blocks.js |
  Tee-Object -FilePath output/playwright/vcb-02/results.txt
```

Stop the acceptance server with Ctrl+C. The ordinary development server is
independent. Acceptance output stays in `output/playwright/task-080/dist` to
reuse the existing isolated build convention; never deploy it.

## Matrix and evidence

Verified with Chromium on 2026-10-14. All 36 matrix records pass, as do
keyboard gallery activation, visible focus, Escape and focus return under
reduced motion. No captured page errors or document overflow.

| Scenario | Widths | Themes | Evidence |
| --- | --- | --- | --- |
| Four variants, ten types each | 320/768/1440 | light/dark | 24 PNGs |
| 200% root text, unchanged viewport | 320/768/1440 | light/dark | 6 PNGs |
| Fresh contexts with JavaScript disabled | 320/768/1440 | light/dark | 6 PNGs |
| Keyboard gallery with reduced motion | 1440 | light | 1 PNG |

Artifacts and the CLI result are saved under `output/playwright/vcb-02/`.
Captures hide fixed site navigation so it cannot cover article content.
Local images are decoded before ordinary captures. No-JS checks verify the
static chart rows, real full-image resource and general inquiry link.
External layout assets are stubbed; local fixture images remain real.

This is a baseline for the following renderer tasks, not final visual
acceptance. The mobile table still uses its current native layout; VCB-05
owns its key-value redesign. Reduced motion is emulated and gallery behavior
checked; animation timing, physical devices and screen-reader speech are not
asserted. The 200% run enlarges root text rather than browser page scale.
Form error/delivery interactions remain in the existing task-082 scenarios
and VCB-13. The screenshot matrix preserves the linear article flow without
adding cards around every block.

Astro check and isolated/normal builds pass. Existing block fixtures,
publication-policy and content invariant checks pass. Astro reports the
existing Zod `.finite()` hint; build reports the existing large chart chunk.

## Paragraph refinement — VCB-03

Completed 2026-10-14. Paragraphs inherit the 68ch reading measure and theme
text color, with 1.7 leading, balanced headings and responsive paragraph gaps.
Sections with headings now have accessible labels even without authored IDs;
the stream supplies stable IDs so MDX and JSON render identically.

Plain HTTP(S) URLs become native underlined links in the same tab. Sentence
punctuation stays outside the URL. Credential-bearing/malformed URLs and
other schemes remain plain text; all text is escaped by Astro. The content
schema remains plain strings, without HTML or Markdown interpretation.

The private `/__visual-check/paragraph/` fixture includes long paragraphs,
unbroken URLs, repeated headings without IDs, absent headings and hostile
HTML text. Long fixture strings use fragments joined by the fixture loader
to satisfy the 80-column rule; production contracts are unchanged.

After starting the isolated server as above, run:

```powershell
node scripts/test-paragraph-links.mjs
New-Item -ItemType Directory -Force output/playwright/vcb-03
npx.cmd --yes --package @playwright/cli playwright-cli `
  run-code --filename scripts/verify-paragraph-browser.js |
  Tee-Object -FilePath output/playwright/vcb-03/results.txt
```

Four link safety/text-preservation fixtures pass. All 14 browser records
pass: 320/768/1440 px in light/dark at 100%/200% text, plus no-JS at 320 px in
both themes. Keyboard Tab reaches the URL with visible focus. Twelve article
screenshots and computed results are in `output/playwright/vcb-03/`.
The runner waits for computed theme/text-size changes before reading styles.
Minimum text contrast: 16.08:1 light, 14.43:1 dark; link contrast: 6.06:1 light,
8.04:1 dark. Labels resolve uniquely, escaped markup remains text, prose has
no card surface, and document overflow is absent. Astro check, both builds,
content-block fixtures, publication policy and content invariants pass.
