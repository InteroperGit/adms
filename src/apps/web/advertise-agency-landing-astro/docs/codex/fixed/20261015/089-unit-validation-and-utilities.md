# 089 — Unit-тесты валидации и утилит

## Цель

Status: completed 2026-10-15 without subagents.

Покрыть чистую логику и валидаторы контрактными unit-тестами.

## Объём

Проверить `src/validation/*`, `resolve-image`, каталог проектов, payload
inquiry, publication policy, форматирование цены и категорий, pagination,
URL-фильтры и `initializeInquiry`. Для каждого API покрыть валидные данные,
обязательные поля, границы, пустые коллекции, draft/demo/unpublished и ошибки
типов. Для формы добавить required/type/length, conditional email,
`aria-invalid`, ошибки сети и очистку ошибки при изменении поля.

## Приёмка

Тесты детерминированы, используют fixtures из `tests/fixtures/content/`,
проходят в node/jsdom и фиксируют baseline coverage чистой логики 90%+.

## Implementation and verification

- Added 114 deterministic unit tests in eight files for validators,
  publication policy, image resolution, pricing/categories, payloads,
  catalog search/URL/pagination and accessible inquiry validation/delivery.
- Versioned synthetic JSON lives in `tests/fixtures/content/`. Vitest aliases
  the category registry to a fixture, avoiding runtime content dependencies.
- Moved conditional email requirements from the lettering Astro script to
  `initializeInquiry`, preserving change/reset behavior and label updates.
- A Russian search regression exposed a broken replacement; `ё` now
  normalizes to `е` as intended.
- Coverage scope is explicit in `vitest.config.ts`, including unimported
  validators. Reports are excluded from TypeScript input. Project-wide
  coverage thresholds and CI remain task 095.
- `pnpm test --coverage`: 115 tests including the existing component smoke
  test; 99.21% lines, 98.06% statements, 95.34% branches, 99.28% functions
  within the declared task scope. Validators: 99.60% lines, 98.46% branches.
- Content boundaries/invariants and production build passed. Type checking
  reports only the existing Zod `.finite()` deprecation hint.
- Generated HTML quality audit reports existing markup findings: duplicate
  section/heading IDs on 27 project pages and missing `loading` on the
  homepage Yandex reviews placeholder. This task changes only client script
  wiring in Astro; the affected rendered markup is unchanged. Task 095
  records these findings for the all-gates acceptance requirement.

Repeat with `pnpm test:unit`, `pnpm test --coverage`, and `pnpm check`.
Local HTML/LCOV coverage reports are generated under ignored `coverage/`.
