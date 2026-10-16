# 091 — Unit-test infrastructure

Дата: 2026-10-16. Статус: planned.

## Задача

Подготовить маленький общий слой для unit-тестов: builders для доменных
fixtures, DOM/browser mocks, reset helpers и versioned fixtures в
`tests/fixtures/content/`.

## Границы

Не менять production-компоненты и не добавлять бизнес-сценарии. Не смешивать
Astro render tests с browser E2E.

## Готово, когда

- helpers работают в текущем Vitest/jsdom setup;
- storage, timers, observers и fetch изолируются между тестами;
- fixtures проходят текущие schemas;
- `pnpm test`, `pnpm check` и `pnpm verify:component-tests` проходят.

Зависимости: нет. Следующие задачи: 092–112.

## Implementation

Added tests/helpers/fixtures.ts and tests/helpers/browser.ts, plus isolated browser cleanup in tests/setup.ts.

## Verification

- pnpm check (passes; existing Zod deprecation hint remains).
- node node_modules/vitest/vitest.mjs run (71 files, 219 tests passed).
