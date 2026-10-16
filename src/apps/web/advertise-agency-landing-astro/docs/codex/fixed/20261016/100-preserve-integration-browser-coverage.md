# 100 — Сохранить integration и browser coverage

## Цель

Разделить локальные component-контракты и проверки реальных композиций.

## Изменения

- Оставить `tests/integration/page-compositions.test.ts` централизованным.
- Добавить только недостающие composition-сценарии для страниц, статей,
  каталога, форм и CookieBanner.
- Не дублировать локальные component-тесты в integration-наборе.
- Сверить browser coverage для reload, history, focus trap, no-JS,
  responsive и внешних fallback-сценариев.

## Приёмка

`pnpm test:integration` и существующий Playwright flow проходят. Границы
между unit, integration и browser тестами описаны в документации.

## Зависимости

097, 098, 099.

## Completion

Status: completed on 2026-10-16.

Kept `tests/integration/page-compositions.test.ts` as the centralized
composition suite and added the missing published service-form ownership
scenario, including its safe fallback when the context does not match.
The existing Playwright smoke flow remains the browser boundary for reload,
history, focus trap, reduced motion, responsive layout, and media fallback.

Validation: the integration suite passed 7 tests, the full Vitest suite passed
71 files and 219 tests, Astro check reported 0 errors and 0 warnings, the
production build generated 39 pages, and the code-style check passed.
