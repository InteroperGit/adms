# 112 — Layouts и pages

Дата: 2026-10-16. Статус: completed on 2026-10-18.

## Модель и оценка

Рекомендуемая модель: `gpt-6.1-sol`; reasoning effort: `high`.
Оценка: 2026-10-18, с приоритетом экономии ресурсов.

Page-level render требует контекста Astro routes/MDX, document head,
publication и fixtures. Sol задаёт общий integration harness; Luna затем
может заполнить ограниченные группы маршрутов по готовому примеру.

## Подзадачи для отдельных запусков

- [x] 112.a — `gpt-6.1-sol`, high: сверить существующие integration tests
  и подготовить недостающий render harness для layouts/pages, полного
  document/head, route params и fixture content. Добавить один образец
  valid/edge-case render; переиспользовать готовую page-compositions suite.
- [x] 112.b — `gpt-6-luna`, medium: на базе a проверить Layout,
  LegalLayout, homepage, legal и 404 pages: metadata, headings и composition.
- [x] 112.c — `gpt-6-luna`, high: на базе a проверить project index,
  detail и pagination: canonical/robots, generated links, empty/demo content.
- [x] 112.d — `gpt-6-luna`, medium: на базе a проверить все пять service
  pages через параметризованную матрицу valid render и relevant edge case.
- [x] 112.e — `gpt-6.1-sol`, medium: сверить покрытие всех routes,
  heading hierarchy, no-JS reading order и publication/metadata invariants.

Порядок: a → b/c/d → e. Все route assertions хранить в tests/integration.
Передача из a: пример запуска, способ подмены content и API render helper;
Luna не должна заново проектировать harness для каждого маршрута.

Общий порядок работы и условия перехода на более сильную модель:
[оценка моделей][model-assessment].

[model-assessment]: ../plan/20261018_todo-model-assessment.md

## Задача

Добавить render/invariant tests для `layouts/Layout.astro`,
`layouts/LegalLayout.astro`, homepage, legal/404 pages, project index/detail/
pagination pages и всех пяти service pages.

## Сценарии

Metadata, canonical/robots, heading hierarchy, layout composition, empty/demo
content, no-JS reading order и generated links.

## Готово, когда

Route-level assertions находятся в `tests/integration`, а не в component suites;
каждый route имеет хотя бы один valid render и relevant edge case.

Зависимость: 107, 108, 109.

## Completion — 2026-10-18

Added a complete Astro document renderer and route-level integration coverage
for both layouts and all 12 page templates. Tests cover metadata, canonical and
robots output, route parameters, project query/path pagination, published/demo/
empty content, no-JavaScript reading order, heading hierarchy, and generated
links. Synthetic page cases are stored in `tests/fixtures/content/`.

Validation: 50 focused integration tests pass; `pnpm check` reports no errors
or warnings (one existing Zod deprecation hint); `pnpm build` generates 39
pages; content, boundary, component-colocation, lint, formatting and whitespace
checks pass. Build retains the existing large-bundle warning.