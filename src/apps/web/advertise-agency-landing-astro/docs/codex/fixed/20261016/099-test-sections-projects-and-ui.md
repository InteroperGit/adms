# 099 — Покрыть sections, projects и оставшиеся UI

## Цель

Закрыть тестами все оставшиеся Astro-компоненты.

## Объём

Добавить тесты для всех компонентов в `sections/` и `projects/`, а также для
`CarouselControl`, `ImageCarousel`, `ImageCarouselSlide`, `Logo`, `MaxLogo`,
`MobileMenuDialog`, `NavLinks`, `ServiceVisual`, `Settings`, `ThemeInit`,
`ThemeToggle` и `YandexReviews`.

Проверить props, defaults, empty states, ссылки, ARIA, keyboard/focus,
theme/menu state, disabled/fallback варианты и безопасное отсутствие внешних
ресурсов при отключённых настройках.

## Приёмка

Все 60 `.astro`-компонентов имеют соседние тесты. Client-state тесты также
проверяют cleanup, повторную инициализацию и reduced-motion поведение.

## Зависимости

096, 097, 098.

## Completion

Status: completed on 2026-10-16.

Added colocated contracts for all sections, projects, remaining UI components, and shared shell components. Section loader tests use isolated fixture mocks where production content is unavailable in Vitest. Validation: full suite reached 70 passing files and 215 passing tests before the focused final fix; focused PricingExamples test and pnpm check passed.
