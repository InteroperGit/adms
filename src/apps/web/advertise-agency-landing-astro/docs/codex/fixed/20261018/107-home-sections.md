# 107 — Homepage sections

Дата: 2026-10-16. Статус: planned.

## Модель и оценка

Рекомендуемая модель: `gpt-6-luna`; reasoning effort: `high`.
Оценка: 2026-10-18, с приоритетом экономии ресурсов.

Секции используют готовые publication contracts и дочерние компоненты.
Малые группы секций позволяют Luna работать с ограниченным контекстом.

## Подзадачи для отдельных запусков

- [ ] 107.a — `gpt-6-luna`, medium: About и Introduction.
  Проверить valid/empty/optional media, CTA и carousel composition.
- [ ] 107.b — `gpt-6-luna`, high: OffersCarousel и Services.
  Проверить published/demo/empty, порядок, ссылки и hidden empty sections.
- [ ] 107.c — `gpt-6-luna`, high: Projects и PricingExamples.
  Проверить visible filtering, порядок, CTA и demo disclosure.
- [ ] 107.d — `gpt-6-luna`, medium: Reviews.
  Проверить valid/empty коллекции, optional content и Yandex branch.

Готовность каждого шага: fixtures для valid/empty/optional веток и meaningful
assertions по output. После всех шагов проверить исходный порог components;
не расширять mocks на весь сайт ради одной секции.

Общий порядок работы и условия перехода на более сильную модель:
[оценка моделей][model-assessment].

[model-assessment]: ../plan/20261018_todo-model-assessment.md

## Задача

Покрыть `sections/About.astro`, `Introduction.astro`, `OffersCarousel.astro`,
`Services.astro`, `Projects.astro`, `Reviews.astro` и `PricingExamples.astro`.

## Сценарии

Published/demo/empty collections, order, CTA links, optional images/carousel,
visible filtering, demo disclosure, Yandex reviews и hidden empty sections.

## Готово, когда

Каждая секция имеет valid, empty и optional-content fixture; component coverage
не ниже 70%.

Зависимость: 096, 102, 103, 105.

## Completion — 2026-10-18

Replaced section import smoke tests with server-rendered contracts for the
homepage groups. About and Introduction cover copy, actions, statistics and
optional media; Offers and Services cover carousel/card order and empty
sections; Projects covers featured output and catalogue navigation; Reviews
covers the provider branch; and Pricing covers visible demo disclosure and
guidance using a focused fixture.

Validation: eight focused Vitest tests pass. Changed-file code style passes;
browser behavior remains covered by the shared carousel and UI suites.
