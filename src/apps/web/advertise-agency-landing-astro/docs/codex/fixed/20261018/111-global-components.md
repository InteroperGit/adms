# 111 — Global components

Дата: 2026-10-16. Статус: completed 2026-10-18.

## Модель и оценка

Рекомендуемая модель: `gpt-6.1-sol`; reasoning effort: `high`.
Оценка: 2026-10-18, с приоритетом экономии ресурсов.

Footer и CookieBanner имеют локальные контракты для Luna. Header требует
согласовать несколько меню, focus и lifecycle events, поэтому его
композицию и связанное поведение лучше поручить Sol.

## Подзадачи для отдельных запусков

- [x] 111.a — `gpt-6-luna`, medium: Footer.
  Проверить legal/contact links, logo и year из управляемого site fixture.
- [x] 111.b — `gpt-6-luna`, high: CookieBanner.
  Проверить accepted/declined, blocked storage, dismissal, ResizeObserver,
  body padding, cleanup и отсутствие focus trap на контролируемом DOM.
- [x] 111.c — `gpt-6.1-sol`, high: Header composition и browser behavior.
  Проверить desktop/mobile, Settings/dialog exclusivity, scroll, focus,
  hashchange/pageshow; зафиксировать границу controlled child mocks.

Шаги независимы и завершаются собственными meaningful DOM suites.
Header suite должен проверять координацию детей, сохраняя child behavior
в задачах 101/102/106.

Общий порядок работы и условия перехода на более сильную модель:
[оценка моделей][model-assessment].

[model-assessment]: ../plan/20261018_todo-model-assessment.md

## Задача

Полностью протестировать `Header.astro`, `Footer.astro` и `CookieBanner.astro`.

## Сценарии

Header desktop/mobile composition, Settings/dialog exclusivity, scroll
hide/show, focus, hashchange/pageshow; Footer legal/contact/year output;
CookieBanner accepted/declined, storage failure, dismissal, ResizeObserver body
padding, cleanup and no focus trap.

## Готово, когда

Composition tests use controlled child fixtures/mocks, while child behavior
остается в задачах 101/102/106. Import-only tests заменены meaningful DOM tests.

Зависимость: 102, 106.

## Результат и проверка

Заменены smoke tests на render assertions для Footer и Header. Header script
проверяется в отдельном jsdom с контролируемыми scroll position, animation
frames, ResizeObserver и input events; site data приходит из versioned test
fixture.

CookieBanner проверяет saved/blocked storage, оба выбора, body padding,
ResizeObserver updates/cleanup, fallback без ResizeObserver и отсутствие
focus trap. По этим сценариям исправлена очистка observer при скрытии и
pagehide; сохранённая настройка больше не создаёт лишнее наблюдение.

Проверки:

- 17 global component tests passed; вместе с Settings и MobileMenuDialog —
  42 tests passed.
- Focused ESLint, Prettier, content boundaries/invariants и component
  colocation passed.
- `pnpm check` passed: 309 files, zero errors, zero warnings, one existing
  Zod deprecation hint.
- `pnpm build` passed for 39 routes. Build сохраняет предупреждение о chunk
  больше 500 kB.
