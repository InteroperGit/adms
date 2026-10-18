# 103 — Card components

Дата: 2026-10-16. Статус: planned.

## Модель и оценка

Рекомендуемая модель: `gpt-6-luna`; reasoning effort: `medium`.
Оценка: 2026-10-18, с приоритетом экономии ресурсов.

Локальные контракты четырёх карточек и готовый render helper дают
достаточно узкий контекст для Luna.

## Подзадачи для отдельных запусков

- [ ] 103.a — `gpt-6-luna`, medium: ServiceCard и ReviewCard.
  Проверить minimal props, escaping, ссылки, отсутствие media и размеры.
- [ ] 103.b — `gpt-6-luna`, medium: ProjectCard.
  Проверить project/category URLs, media и reserved portrait frame.
- [ ] 103.c — `gpt-6-luna`, medium: PricingExample.
  Проверить формат цены, historical date, demo disclosure и optional media.

Каждый шаг завершён, когда его card suites проверяют normal и optional/empty
branches. Шаги можно выполнять отдельно; общий helper менять только при
подтверждённом пробеле.

Общий порядок работы и условия перехода на более сильную модель:
[оценка моделей][model-assessment].

[model-assessment]: ../plan/20261018_todo-model-assessment.md

## Задача

Полностью протестировать `cards/ServiceCard.astro`, `ProjectCard.astro`,
`ReviewCard.astro` и `PricingExample.astro`.

## Сценарии

Normal/minimal props, missing media, escaped text, native links, category and
project URLs, image dimensions, reserved portrait frame, price formatting,
historical date и demo disclosure.

## Готово, когда

Каждая card имеет meaningful fixture и empty/media branch; import-only checks
удалены или заменены.

Зависимость: 091, 096.

## Completion — 2026-10-18

The four colocated card suites now cover normal and empty/media branches,
escaped text, native links, image dimensions and loading policy, project
thumbnail selection, reserved review portraits, pricing formats, historical
dates and demo disclosure. The focused suites pass with 100% statements,
branches, functions and lines for all four card components.

Validation: 18 focused Vitest tests pass. Component test colocation remains
valid; no production component changes were required.
