# 101 — Обновить coverage, CI и документацию

## Цель

Закрепить новую структуру тестов в quality gates и документации.

## Изменения

- Обновить `docs/development/verification-and-ci.md` и
  `docs/development/components.md`.
- Описать правило `Component.astro` рядом с `Component.test.ts`.
- Проверить `.github/workflows/quality.yml` и focused commands.
- Обновить coverage include и пороги после полного набора тестов.
- Добавить итоговую проверку отсутствия component-тестов в `tests/components`.

## Приёмка

Проходят `pnpm test:coverage`, `pnpm verify:coverage`, `pnpm check`,
`pnpm build`, `pnpm verify:quality`, `pnpm verify:boundaries` и
`pnpm verify:content`. CI использует те же команды, что и локальная проверка.

## Зависимости

096, 097, 098, 099, 100.

## Completion

Status: completed on 2026-10-16.

Added `verify:component-tests`, which fails if component tests return to
`tests/components`, and made it an unconditional CI quality step. Updated
Vitest coverage comments and the component/CI documentation for colocated
tests. The complete component scope now enforces a 70% line baseline; the
full run currently reaches 73.92% component and 86.46% overall coverage.

Validation: 71 files and 219 tests passed, coverage thresholds passed,
component colocation passed, boundaries/content checks passed, Astro check
reported no errors, the production build generated 39 pages, built quality
passed, and code style passed.
