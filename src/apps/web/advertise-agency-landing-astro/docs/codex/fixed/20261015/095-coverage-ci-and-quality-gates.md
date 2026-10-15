# 095 — Coverage, CI и quality gates

## Цель

Закрепить пороги покрытия и порядок запуска тестов в CI.

## Объём

Настроить coverage thresholds: чистая логика 90%+, client state 85%+,
компоненты 80%+, общий проект 80%. Добавить быстрые unit/component проверки
на pull request и полный Playwright после build на pull request и push в
основную ветку. Обновить verification-документацию и команды проекта.

## Приёмка

Task 089 baseline (2026-10-15): 99.21% lines and 95.34% branches across
the explicit validation/utility/inquiry/catalog scope in `vitest.config.ts`.
Expand that scope before enforcing project-wide thresholds. The generated
HTML audit currently reports duplicate section/heading IDs on 27 project
pages and missing `loading` on the homepage Yandex reviews placeholder.
These findings concern unchanged markup and must be resolved for all gates
to pass.

Последовательно проходят `pnpm verify:boundaries`, `verify:content`,
`check`, `test`, `test:coverage`, `build` и `verify:quality`; CI публикует
понятный отчёт о падении тестов и coverage.

## Выполнение — 2026-10-15

Добавлен JSON coverage report и `pnpm verify:coverage` с порогами 90% для
логики, 85% для client state, 80% для компонентов и 80% общего покрытия.
Workflow теперь выполняет полный порядок gates, быстрые unit/component
проверки на pull request и Playwright smoke после build на pull request и
push. Исправлены duplicate IDs в rendered content blocks и добавлен lazy
loading для homepage Yandex placeholder.

Проверки: 164 Vitest tests passed, coverage 98.19% lines, all custom
thresholds passed, 39 generated routes passed `verify:quality`, content and
boundary checks passed, `pnpm build` passed. Existing browser coverage remains
Chromium-only because the repository has no Firefox/WebKit runtime setup.
