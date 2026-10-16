# 099 — Inquiry browser module

Дата: 2026-10-16. Статус: completed.

## Задача

Покрыть `src/components/forms/order-inquiry.ts`.

## Сценарии

Required/type/length errors, conditional email, `aria-invalid`, inline errors,
first-error focus, disabled delivery, duplicate submit, FormData, retry UUID,
success, HTTP/network failure, timeout, abort, preserved message и reset only
after confirmed acceptance.

## Готово, когда

Fetch, timers и AbortController контролируются тестами;
success/error/unavailable status accessible; client-state coverage не ниже 85%.

Зависимость: 091, 097.

## Implementation — 2026-10-16

Implemented without subagents. Expanded the colocated suite from 18 to 42 tests
using synthetic form markup and versioned feedback fixtures. Added textarea
length and URL validity cases, missing-markup guards, all-error marking and
first-error focus, unavailable status/focus, missing inline error and
conditional label handling, and exact FormData/context/fetch options.

Acceptance cases now cover primitive, empty and malformed responses, strict
accepted/receiptId checks, draft preservation and reset only after the response
body confirms receipt. Tests verify in-flight duplicate prevention, retry UUID
reuse, new UUIDs after edits and successful acceptance, HTTP, network, JSON,
abort and UUID failures, accessible focused outcomes, timeout boundaries, abort
signals, timer cancellation and restored controls.

Fetch is mocked throughout; fake timers and AbortController spies control
timeout behavior. Production code and runtime content were not changed.

## Focused verification

- 42 tests pass (24 additional tests).
- Inquiry module: 100% statements, functions and lines; 96.1% branches.
- Type/style, component colocation and content checks pass.
- Full regression suite: 100 files and 628 tests pass.
- Changed-file 80-column and diff whitespace checks pass.
- Production build: 39 pages; existing large-chunk warning remains.
- Astro type checking: no errors; existing Zod finite() hint remains.

[Corresponding plan](../../plan/20261016_031828_unit-test-suite-plan.md).
