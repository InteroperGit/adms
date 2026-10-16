# 095 — Commerce и catalog validation

Дата: 2026-10-16. Статус: completed.

## Задача

Покрыть `offers.ts`, `order-inquiry.ts`, `pricing.ts`,
`production-and-guarantees.ts`, `project-catalog.ts`, `projects.ts` и
`services.ts`.

## Сценарии

Проверить цены и даты, approval, project paths, inquiry endpoint/fields,
published paths, category allow-list, project/service article sources,
focal-point/image rules, duplicate IDs и unknown keys.

## Готово, когда

Boundary fixtures покрывают все public schema exports, а group coverage не ниже
90%. `order-inquiry` не смешивать с browser form behavior.

Зависимость: 092–094.

## Implementation — 2026-10-16

Added seven colocated suites using versioned unit-contracts.json fixtures.
Every public schema export is exercised, including record-source factories
and offer presentation/focal-point re-exports. Boundary cases cover dates,
prices, approvals, route allow-lists, inquiry fields/endpoints, image metadata,
uniqueness, publication evidence and article form ownership.

## Verification

- Targeted suites: 72 tests pass.
- Seven scoped modules: 100% statements, branches, functions and lines.
- pnpm test: 87 files and 363 tests pass.
- pnpm check: passes; existing Zod finite() deprecation hint remains.
- Component test colocation check: passes.
- Production validators and runtime content were not changed.

[Corresponding plan](../../plan/20261016_031828_unit-test-suite-plan.md).
