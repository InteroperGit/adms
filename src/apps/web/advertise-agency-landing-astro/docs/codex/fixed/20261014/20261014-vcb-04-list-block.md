# VCB-04 — ListBlock

Дата: 2026-10-14. Статус: completed (2026-10-14).

## Задача

Зависимости: VCB-01. Развести ordered/unordered визуально, выровнять маркеры,
добавить hanging indent, numbered guide-line для ordered и mobile rhythm.

## Ограничение общего потока

Статья остаётся единым линейным текстом: этот renderer не оформляется как
отдельная карточка с обязательным фоном, рамкой, скруглением или тенью.
Локальная surface допускается только вокруг смысловой группы, если это прямо
описано в задаче (например gallery, media, chart или form), и не должна
создавать ощущение набора разрозненных карточек.
Готово, когда native `ol`/`ul` сохраняют порядок, copy/paste и семантику.




## Implementation and verification

Implemented without subagents. Native `ol`/`ul` and `li` retain authored
order and escaped text. Scoped styles add distinct accent markers, hanging
indents, tabular numbers, a theme-aware ordered guide and responsive gaps.
The numbered gutter grows with the item count; no generated marker text,
client JavaScript or per-list card surface was added.

Code style passes. A focused Astro build and all 14 Chromium browser cases
pass: 320/768/1440 px, light/dark, 100%/200% root text, plus no-JavaScript at
320 px in both themes. Selection preserves item text and order; native
markers remain visible, items align and neither list overflows. Twenty-four
screenshots are in `output/playwright/vcb-04/`. This checks native selection,
not a platform clipboard or screen-reader speech.

Full `pnpm check` is blocked by missing `article-cases.json` and
`publication.json` fixtures. The production build is blocked by existing
invalid `services.json` data; the acceptance build also references missing
article fixtures. `test:content-blocks` lacks `content-blocks.valid.json`.
The existing visual fixture has heading/title keys rejected by the current
schema, and the full renderer imports invalid `order-inquiry.json` data.
These unrelated data issues were left unchanged.

The focused page uses the real ListBlock, shared global CSS and the exact
ContentBlocks style section in a temporary parent. Only list type/items
are taken from the existing visual fixture and validated. Config and page
are saved under `output/playwright/vcb-04/`; repeat with:

```powershell
pnpm build --config output/playwright/vcb-04/astro.config.mjs
node scripts/serve-content-acceptance.mjs
# In another terminal:
npx.cmd --yes --package @playwright/cli playwright-cli `
  open http://127.0.0.1:54382/__visual-check/long/
npx.cmd --yes --package @playwright/cli playwright-cli `
  run-code --filename scripts/verify-list-browser.js
```
