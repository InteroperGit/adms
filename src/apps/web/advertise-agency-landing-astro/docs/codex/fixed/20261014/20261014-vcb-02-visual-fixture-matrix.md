# VCB-02 — Fixture и матрица визуальной проверки

Дата: 2026-10-14. Статус: completed (2026-10-14).

## Задача

Зависимости: VCB-01. Создать fixture со всеми типами, длинными значениями,
пустыми optional-полями, двумя темами и viewport 320/768/1440 px. Добавить
keyboard, 200% text, reduced-motion и no-JS проверки.

## Ограничение общего потока

Статья остаётся единым линейным текстом: этот renderer не оформляется как
отдельная карточка с обязательным фоном, рамкой, скруглением или тенью.
Локальная surface допускается только вокруг смысловой группы, если это прямо
описано в задаче (например gallery, media, chart или form), и не должна
создавать ощущение набора разрозненных карточек.
Готово, когда fixture запускается повторно и сохраняет representative evidence.




## Реализация и проверка

Добавлены JSON fixture в `data/content/fixtures/visual-blocks.json`,
приватный Astro renderer и повторяемый Playwright CLI сценарий.
Все 10 текущих типов проверяются в long/optional/form/demo вариантах.
Пустые optional text-поля опущены: схема запрещает пустые строки.
Video добавляется после VCB-10–12, когда появится его контракт.

36 browser matrix cases: 24 базовых, 6 с 200% text, 6 no-JS;
keyboard/focus/Enter/Escape и reduced-motion gallery проходят.
Ошибок страницы и document overflow нет. Сохранены 37 screenshots и CLI
results в `output/playwright/vcb-02/`. Проверены реальные локальные media;
внешние layout assets изолированы. Общий поток статьи сохранён.

`pnpm check`, acceptance/production `pnpm build`, content-block fixtures,
publication policy и content invariants проходят. Существующие Zod hint и
предупреждение о размере chart chunk остаются.

[Повторный запуск и границы проверки](../../../site/content-block-visual-matrix.md).
