# 118 — Colocate validation suites

Дата: 2026-10-18. Статус: completed 2026-10-19.

## Цель

Разнести assertions из `tests/unit/validation.test.ts`,
`tests/unit/validator-boundaries.test.ts` и validation-часть
`tests/unit/blocks.test.ts` по модулям в `src/validation/`.

## Объём

- Объединить проверки content blocks с
  `src/validation/content-blocks.test.ts`.
- Распределить smoke-контракты и boundary cases по suite-файлам
  `business-solutions`, `faq`, `introduction`, `offers`, `order-inquiry`,
  `ordering-process`, `pricing`, `production-and-guarantees`,
  `project-catalog`, `projects`, `reviews`, `services` и `parse-content`.
- Перенести проверки `mediaSource` и uniqueness в
  `src/validation/shared.test.ts`.
- Создать `src/validation/image-carousel.test.ts` для оставшихся проверок
  carousel schema.
- Исправить относительные импорты versioned fixtures и сохранить node
  environment там, где он нужен.

## Зависимости

Работа выполняется первой. Финальное удаление исходных файлов выполняется
только в задаче 120 после проверки, что assertions не потеряны.

## Готово, когда

- [x] Validation assertions находятся в suite-файлах рядом со схемами и
  parser-модулями.
- [x] Мигрированные validation cases удалены из `tests/unit`; block
  publication coverage оставлена для задачи 119.
- [x] Нет дублирующих test cases после слияния.
- [x] Целевые suites проходят focused Vitest run: 18 файлов, 176 тестов.

## Выполнение — 2026-10-19

- Перенесены проверки content blocks в `src/validation/content-blocks.test.ts`;
  для image carousel добавлен отдельный colocated suite.
- Проверки smoke contracts, schema boundaries, `mediaSource`, uniqueness и
  `parseContent` сверены с существующими colocated suites; устаревшие
  `tests/unit/validation.test.ts` и `validator-boundaries.test.ts` удалены.
- Сохранена среда Node для validation suites и относительные импорты fixtures.
- Проверка: focused Vitest run для validation suites и оставшихся block
  publication cases — 18 файлов и 176 тестов прошли.

## Модель и оценка

Рекомендуемая модель: `gpt-6-luna`; reasoning effort: `high`.

Задача широкая по числу файлов, но структура каждого переноса локальна и
заранее определена существующими suite-файлами. Высокий effort нужен для
сверки, что при разрезании двух смешанных файлов не потеряны assertions и
граничные случаи; Sol не нужен, пока не появляется новый общий harness или
несогласованность между несколькими схемами.

Подзадачи:

- 118.a — content blocks и shared helpers: Luna medium;
- 118.b — smoke-контракты доменных схем: Luna high;
- 118.c — boundary cases и итоговая сверка validation: Luna high.

Переключиться на `gpt-6.1-sol` с effort `medium`, если диагностика TypeScript
или Vitest выявит системную проблему, затрагивающую несколько suite-групп.
