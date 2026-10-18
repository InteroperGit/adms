# 104 — Basic content block components

Дата: 2026-10-16. Статус: planned.

## Модель и оценка

Рекомендуемая модель: `gpt-6-luna`; reasoning effort: `medium`.
Оценка: 2026-10-18, с приоритетом экономии ресурсов.

Контракты блоков определены; проверки HTML и mapping можно разделить
без изменения общей архитектуры.

## Подзадачи для отдельных запусков

- [ ] 104.a — `gpt-6-luna`, medium: HeadingBlock и ParagraphBlock.
  Проверить уровни/ID, escaping и разрешённые paragraph links.
- [ ] 104.b — `gpt-6-luna`, medium: ListBlock и TableBlock.
  Проверить ordered/unordered HTML, captions, columns/rows и empty fields.
- [ ] 104.c — `gpt-6-luna`, medium: QuoteBlock и FootnoteBlock.
  Проверить attribution/source, optional fields, target и backlink.
- [ ] 104.d — `gpt-6-luna`, medium: mdx-components.ts.
  Проверить разрешённый mapping и отсутствие лишних экспортов.

У каждого шага свой colocated suite и assertions по observable HTML/API.
Не переносить в эти suites уже проверенную валидацию схем.

Общий порядок работы и условия перехода на более сильную модель:
[оценка моделей][model-assessment].

[model-assessment]: ../plan/20261018_todo-model-assessment.md

## Задача

Покрыть `HeadingBlock.astro`, `ParagraphBlock.astro`, `ListBlock.astro`,
`TableBlock.astro`, `QuoteBlock.astro`, `FootnoteBlock.astro` и
`mdx-components.ts`.

## Сценарии

Heading levels/IDs, plain text escaping и safe paragraph links,
ordered/unordered semantics, captions/columns/rows, quote attribution/source,
footnote target and backlink, а также единственный разрешённый MDX mapping.

## Готово, когда

Semantic HTML, empty/optional fields и unsafe text проверены через
`tests/helpers/render.ts`.

Зависимость: 093, 096.

## Completion — 2026-10-18

Expanded the colocated suites for the six basic content blocks and the MDX
component allowlist. Coverage now verifies heading levels and escaping,
paragraph boundaries and safe links, ordered and unordered lists, table
captions, empty cells and numeric columns, optional quote attribution,
footnote fallback fields and the exact MDX export surface.

Validation: 15 focused Vitest tests pass and changed-file code style passes.
