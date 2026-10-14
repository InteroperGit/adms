# VCB-05 — TableBlock

Дата: 2026-10-14. Статус: completed (2026-10-14).

## Задача

Зависимости: VCB-01, VCB-02. Сделать desktop header, zebra, row hover/focus,
числовое выравнивание и локальный scroll. Спроектировать mobile key-value
стек с явными column labels без двойного чтения screen reader.

## Ограничение общего потока

Статья остаётся единым линейным текстом: этот renderer не оформляется как
отдельная карточка с обязательным фоном, рамкой, скруглением или тенью.
Локальная surface допускается только вокруг смысловой группы, если это прямо
описано в задаче (например gallery, media, chart или form), и не должна
создавать ощущение набора разрозненных карточек.
Готово, когда тесты покрывают 2, 4 и 8 колонок и все данные доступны на mobile.





## Implementation and verification

Implemented without subagents. Desktop retains native table/caption/column
header semantics, with a contrasting theme-colored header, zebra rows,
hover and keyboard row focus, tabular numeric columns and keyboard-accessible
local scrolling. Numeric alignment is inferred only for columns containing
plain signed numbers, grouped decimals or percentages; mixed text and dates
remain text. Authored strings and the existing contract are unchanged.

Below 768 px, each row becomes a native definition list with explicit labels.
Tinted bold labels have an accent rule and a 10% neutral fill distinct from
the row background. Every field and row has a quiet 1 px horizontal separator;
unshaded odd rows also have a thin perimeter border as requested. No enclosing
table card, shadow or client JavaScript is added. CSS display:none excludes the
inactive representation from accessibility and keyboard order. Print uses
one native comparison table.

All 18 Chromium matrix cases pass: 320/768/1440 px, light/dark, 100%/200%
root text, plus no-JavaScript at every width in both themes. Tests cover 2,
4 and 8 columns, exact value/label preservation, escaped markup, numbers,
all-row separators, header widths, zebra, hover/focus and page containment.
Accessibility snapshots expose each sampled value exactly once and exclude
the inactive tree. Native keyboard arrows scroll the wide desktop table;
print exposes a single view. Physical screen-reader speech is not tested.
Twelve screenshots and results are in `output/playwright/vcb-05/`.

Production and focused builds pass. Changed-file code style passes.
`pnpm check` is blocked by the existing missing `article-cases.json` and
`publication.json` fixtures (three diagnostics). `test:content-blocks` is
blocked by missing `content-blocks.valid.json`. These files are unrelated
to this renderer and were not recreated.

The private fixture validates data with the production table schema, renders
the real TableBlock and imports shared global CSS at the article reading
measure. Its authored JSON is `data/content/fixtures/table-visual.json`;
this remains local under the repository's ignored runtime-content policy.
Repeat from the project root:

```powershell
pnpm build --config scripts/table-acceptance.config.mjs
node scripts/serve-content-acceptance.mjs
# In another terminal:
npx.cmd --yes --package @playwright/cli playwright-cli `
  open http://127.0.0.1:54382/__table-check/
npx.cmd --yes --package @playwright/cli playwright-cli `
  run-code --filename scripts/verify-table-browser.js
```
