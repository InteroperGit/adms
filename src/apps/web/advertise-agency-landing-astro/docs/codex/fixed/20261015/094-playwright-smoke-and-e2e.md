# 094 — Playwright smoke и E2E

## Цель

Расширить browser-проверки реальными Chromium, Firefox и WebKit сценариями.

## Объём

После `pnpm build` проверить keyboard navigation, focus trap, themes/reload,
blocked storage, carousel, gallery, inquiry success/error/unavailable,
search/filter/pagination/back-forward, responsive routes, media fallback и
no-JS HTML. Для inquiry перехватывать endpoint fixture и проверять timeout,
rejection, duplicate request ID, receipt и reset после успеха.

## Приёмка

Smoke-flow запускается существующей инфраструктурой browser coverage,
не дублирует unit/component тесты и проходит на поддерживаемых браузерах.

## Выполнение — 2026-10-15

Расширен существующий `docs/development/browser-coverage.js` flow. Добавлены
проверки первоначального и циклического focus поведения mobile menu, поиска,
фильтра, browser back, responsive service route, media fallback и mobile
landmark. Существующие проверки cookie/theme persistence, reduced-motion
carousel и unavailable inquiry сохранены.

Production `pnpm build` завершился успешно. Playwright CLI Chromium flow
прошёл 21 проверку. Стиль и синтаксис helper проходят. В репозитории нет
Playwright test-runner или установленных Firefox/WebKit runtime; CLI coverage
остаётся Chromium-only согласно существующей инфраструктуре.
