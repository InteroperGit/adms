# 093 — Content-block validation

Дата: 2026-10-16. Статус: planned.

## Задача

Покрыть `src/validation/content-blocks.ts`.

## Сценарии

Проверить все 11 block types, discriminated union, block IDs, provenance,
paragraph links, lists, tables, charts, content images, galleries, video,
order forms, quotes и footnotes. Для каждого типа добавить valid, boundary,
missing, unknown-key и unsafe-URL cases.

## Готово, когда

Fixtures находятся в `tests/fixtures/content/`, schema output проверяется через
`satisfies`, coverage файла не ниже 90%, а content checks проходят.

Зависимость: 092.

## Implementation

Added versioned content-block boundary fixtures and colocated coverage for all block schemas, discriminated unions, strict keys, IDs, provenance, media, tables, forms, and publication checks.

## Verification

- Targeted Vitest: 30 tests passed.
- Coverage: 98.14% statements, 91.66% branches, 100% functions, 98.07% lines.
- pnpm check passed with the existing Zod deprecation hint.
