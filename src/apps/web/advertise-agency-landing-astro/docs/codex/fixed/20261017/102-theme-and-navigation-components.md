# 102 — Theme и navigation components

Дата: 2026-10-16. Статус: completed 2026-10-17.

## Задача

Протестировать `MobileMenuDialog.astro`, `Settings.astro`, `ThemeToggle.astro`,
`ThemeInit.astro`, `ImageCarousel.astro`, `ImageCarouselSlide.astro`,
`ServiceVisual.astro` и `YandexReviews.astro`.

## Сценарии

Dialog open/close, Escape, backdrop, focus trap/return и hash navigation;
settings readiness/outside dismissal/resize; three native radios; saved, invalid
и blocked theme storage; carousel filtering/options/IDs; image loading
policy/focal points; enabled iframe и disabled placeholder.

## Готово, когда

DOM behavior и inline script output проверены отдельно, без E2E browser
зависимости. Не включать Header composition в эту задачу.

Зависимость: 100, 101.

## Completion — 2026-10-17

Replaced import-only smoke tests with semantic render assertions for all
eight components. Dialog behavior runs the actual component script in
isolated jsdom documents: opening, closing, focus boundaries and return,
backdrop clicks, modified navigation, hash targets and resize dismissal.
Native Escape remains unprevented; jsdom supplies modal API test doubles
because it does not implement the browser's native dismissal behavior.

Settings tests cover initial hidden state, positioning, resize, keyboard
focus, Escape, outside pointer dismissal, focus departure and menu opening.
Theme tests execute the rendered inline script and check saved/invalid/
blocked storage, system changes, cross-tab changes, readiness and radios.
Media tests cover enabled filtering, option combinations, IDs, image
loading/crops, optional copy and review iframe/placeholder output.

Validation: full Vitest suite passed (101 files, 680 tests), production
build passed (39 pages), Astro/type/style checks, component-test colocation
guard and focused ESLint passed. The existing Zod deprecation hint and build
chunk-size warning remain. No Header composition or production changes needed.
