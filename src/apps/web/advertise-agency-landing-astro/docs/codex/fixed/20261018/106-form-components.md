# 106 — Form Astro components

Дата: 2026-10-16. Статус: planned.

## Модель и оценка

Рекомендуемая модель: `gpt-6-luna`; reasoning effort: `medium`.
Оценка: 2026-10-18, с приоритетом экономии ресурсов.

Задача ограничена серверным HTML двух форм; client state уже вынесен
в отдельный модуль и отдельные тесты.

## Подзадачи для отдельных запусков

- [ ] 106.a — `gpt-6-luna`, medium: LedLettersForm.
  Проверить default service, hidden project/service context, required поля,
  conditional email, consent, initial submit и endpoint/status attributes.
- [ ] 106.b — `gpt-6-luna`, medium: OrderInquiry.
  Проверить general shell, unavailable delivery, context и live status.

Каждый шаг даёт отдельный render suite с доступными labels и связями ARIA.
Не дублировать submit/retry/timeout сценарии initializeInquiry из 099.

Общий порядок работы и условия перехода на более сильную модель:
[оценка моделей][model-assessment].

[model-assessment]: ../plan/20261018_todo-model-assessment.md

## Задача

Полностью протестировать `forms/LedLettersForm.astro` и
`sections/OrderInquiry.astro`.

## Сценарии

Default service, project/service hidden context, required name/phone/consent,
conditional email, disabled initial submit, endpoint/status attributes, general
form shell, unavailable delivery и accessible live status.

## Готово, когда

Server-rendered form contracts проверены отдельно от `initializeInquiry`, а
client interactions остаются в задаче 099.

Зависимость: 099, 105.

## Completion — 2026-10-18

Expanded the colocated render suites for the lettering and general inquiry
forms. Assertions cover default and supplied service context, project hidden
fields, required controls, conditional email, consent and legal links,
disabled initial submission, endpoint/status attributes, accessible hints and
error associations, and the general form shell.

Validation: five focused Vitest tests pass. Changed-file code style and
component colocation pass; client submission behavior remains covered by the
existing order-inquiry module suite.
