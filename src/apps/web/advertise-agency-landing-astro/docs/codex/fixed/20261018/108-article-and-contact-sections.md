# 108 — Article и contact sections

Дата: 2026-10-16. Статус: planned.

## Модель и оценка

Рекомендуемая модель: `gpt-6.1-sol`; reasoning effort: `medium`.
Оценка: 2026-10-18, с приоритетом экономии ресурсов.

ServiceArticle связывает article context, MDX/block stream, publication
и build failure. Этот шаг требует Sol; остальные секции достаточно отдать
Luna. Для выполнения всей задачи одной моделью выбрать Sol.

## Подзадачи для отдельных запусков

- [ ] 108.a — `gpt-6-luna`, medium: OrderingProcess и BusinessSolutions.
  Проверить approved filtering, порядок, optional media и empty output.
- [ ] 108.b — `gpt-6-luna`, medium: ProductionAndGuarantees и Faq.
  Проверить attribution/media, approved/empty и FAQ disclosures.
- [ ] 108.c — `gpt-6-luna`, medium: Contacts.
  Проверить contact info, map iframe и local fallback без network.
- [ ] 108.d — `gpt-6.1-sol`, medium: ServiceArticle.
  Проверить unknown-service/build failure, published/demo/noindex, article
  context и block stream; согласовать render fixtures с готовыми helpers.

Шаги a–c можно выполнять независимо от d. Результат d — реальный render
article и проверки failure/output, без подмены проверяемого article logic.

Общий порядок работы и условия перехода на более сильную модель:
[оценка моделей][model-assessment].

[model-assessment]: ../plan/20261018_todo-model-assessment.md

## Задача

Покрыть `sections/ServiceArticle.astro`, `OrderingProcess.astro`,
`ProductionAndGuarantees.astro`, `BusinessSolutions.astro`, `Faq.astro` и
`Contacts.astro`.

## Сценарии

Unknown service/build failure contract, published/demo/noindex article, block
stream, approved filtering, optional attribution/media, FAQ disclosures, contact
info, map iframe и local map fallback.

## Готово, когда

Article context и empty/filtered collections проверены без обращения к
production network.

Зависимость: 096, 104, 105, 107.

## Completion — 2026-10-18

Replaced the article and contact section smoke tests with server-rendered
contracts. OrderingProcess and BusinessSolutions cover ordered output,
responsibilities, provenance and actions; ProductionAndGuarantees covers
guidance and approval filtering; FAQ covers empty publication output;
Contacts covers native contact links and map output; ServiceArticle covers a
known demo article, block stream, disclosure and unknown-service build failure.

Validation: seven focused Vitest tests pass. Changed-file code style and
component colocation pass; no production network was contacted.
