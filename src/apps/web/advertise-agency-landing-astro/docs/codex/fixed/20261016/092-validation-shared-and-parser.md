# 092 — Shared validation и parser

Дата: 2026-10-16. Статус: planned.

## Задача

Покрыть только `src/validation/shared.ts` и `src/validation/parse-content.ts`.

## Сценарии

- text/id/mediaSource boundaries;
- uniqueValues и uniqueIds, включая duplicate и empty cases;
- parse success;
- parse failure с source и диагностикой;
- безопасные/небезопасные media schemes.

## Готово, когда

Есть colocated tests с boundary fixtures и не менее 95% line/branch coverage
для этих двух файлов. Не расширять задачу на domain schemas.

Зависимость: 091.

## Implementation

Added colocated boundary suites for shared schemas, uniqueness refinements, and parseContent diagnostics.

## Verification

- Targeted Vitest coverage: 100% statements, branches, functions, and lines.
- pnpm check passed with the existing Zod deprecation hint.
