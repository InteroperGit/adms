# VCB-03 — ParagraphBlock

Дата: 2026-10-14. Статус: completed (2026-10-14).

## Задача

Зависимости: VCB-01. Настроить measure строки, heading rhythm, абзацы, ссылки,
переносы URL и mobile spacing.

## Ограничение общего потока

Статья остаётся единым линейным текстом: этот renderer не оформляется как
отдельная карточка с обязательным фоном, рамкой, скруглением или тенью.
Локальная surface допускается только вокруг смысловой группы, если это прямо
описано в задаче (например gallery, media, chart или form), и не должна
создавать ощущение набора разрозненных карточек.
Готово, когда длинный текст не вызывает overflow, heading связан с секцией,
контраст и line-height проходят обе темы.




## Реализация и проверка

ParagraphBlock использует measure 68ch, line-height 1.7, responsive paragraph
spacing, balanced headings и общие theme/focus tokens без карточной обводки.
Заголовки без authored ID получают доступную связь с секцией; ContentBlocks
передаёт стабильные label IDs. HTTP(S) URLs отображаются нативными ссылками
с подчёркиванием; прочий текст экранируется, небезопасные URL остаются текстом.

Добавлены paragraph fixture и Playwright CLI scenario. Все 14 browser cases
проходят: 320/768/1440 px, обе темы, 100%/200% text и два no-JS сценария.
Keyboard focus, label uniqueness, measure и отсутствие overflow проверены.
Контраст текста >=14.43:1, ссылок >=6.06:1; 12 screenshots сохранены.

`pnpm check`, isolated/normal `pnpm build`, link safety fixtures,
content-block fixtures, publication policy и content invariants проходят.
Существующие Zod hint и chart chunk warning остаются.

[Повторный запуск и evidence](../../../site/content-block-visual-matrix.md#paragraph-refinement--vcb-03).
