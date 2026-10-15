# 093 — Integration-тесты секций

## Цель

Проверить передачу props и взаимодействие компонентов в ключевых композициях.

## Объём

Создать integration-тесты для главной страницы, service/project article,
header с mobile menu/settings/theme, catalog controls/grid/count/empty/
pagination, CookieBanner, media fallbacks и published/demo order forms с
`projectId` и `serviceId`. Использовать минимальные валидные fixtures и не
дублировать дочерние unit-тесты.

## Приёмка

Каждая композиция имеет тест happy path и нужный empty/fallback path; тесты
проходят отдельно через `pnpm test:integration`.

## Выполнение — 2026-10-15

Добавлены шесть integration-тестов в
`tests/integration/page-compositions.test.ts`. Они проверяют композицию
общего header/mobile menu/settings, disabled inquiry/no-JS fallback, service
article ownership and actions, content-block ownership and safe links,
catalog controls/results/empty/pagination, and cookie choices/legal links.

`vitest run tests/integration --passWithNoTests` passes all 6 tests; code-style
check passes.
