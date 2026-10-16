# 094 — Basic domain validation

Дата: 2026-10-16. Статус: planned.

## Задача

Покрыть небольшую группу независимых схем: `business-solutions.ts`, `faq.ts`,
`introduction.ts`, `ordering-process.ts`, `reviews.ts`, `service-articles.ts`.

## Сценарии

Проверить required/optional fields, approval states, media, IDs, empty arrays,
text limits, article source formats, duplicate review IDs и malformed values.

## Готово, когда

У каждого файла есть отдельный colocated test suite, fixtures минимальны и
versioned, а group logic coverage не ниже 90%.

Зависимость: 092, 093.

## Implementation

Added separate colocated suites for business solutions, FAQ, introduction, ordering process, reviews, and service article schemas using versioned contract fixtures.

## Verification

- 19 targeted tests passed.
- Group coverage: 100% statements, 93.75% branches, 100% functions, 100% lines.
- pnpm check passed with the existing Zod deprecation hint.
