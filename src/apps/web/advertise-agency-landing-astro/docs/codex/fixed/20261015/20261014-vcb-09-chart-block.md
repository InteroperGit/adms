# VCB-09 — ChartBlock

Дата: 2026-10-14. Статус: planned.

## Задача

Зависимости: VCB-01, VCB-02. Улучшить локальную chart surface, legend, series colors,
mobile labels, resize, reduced-motion и раскрываемый data fallback.

## Ограничение общего потока

Статья остаётся единым линейным текстом: этот renderer не оформляется как
отдельная карточка с обязательным фоном, рамкой, скруглением или тенью.
Локальная surface допускается только вокруг смысловой группы, если это прямо
описано в задаче (например gallery, media, chart или form), и не должна
создавать ощущение набора разрозненных карточек.
Готово, когда данные доступны без JS/цвета, canvas не вызывает layout shift.





## Implementation and verification — 2026-10-15

Implemented the chart surface and fallback in `ChartBlock.astro`. Charts now
reserve their canvas footprint, expose a themed multi-series legend, retain
native bar data before enhancement, and provide an expandable semantic table
with every series and label. The fallback remains usable without JavaScript or
canvas support, and wide data scrolls locally on narrow screens.

`chart-runtime.ts` now uses a stable accessible palette, scrollable legends,
responsive axis labels, and `ResizeObserver` updates. ECharts animation follows
`prefers-reduced-motion`; cleanup disposes the instance and observer on page
lifecycle changes.

Verification: `node_modules\\.bin\\astro.cmd build` passed (38 pages),
`node scripts/check-code-style.mjs` passed, and `git diff --check` passed.
`astro check` remains blocked by the existing missing
`article-cases.json`/`publication.json` fixtures and its existing deprecated
Zod hint.
