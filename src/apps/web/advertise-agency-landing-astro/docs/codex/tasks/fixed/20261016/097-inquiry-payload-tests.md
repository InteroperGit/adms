# 097 — Server inquiry payload

Дата: 2026-10-16. Статус: completed.

## Задача

Создать colocated unit tests для `src/server/inquiry-payload.ts`.

## Сценарии

Homepage и lettering payloads, required/optional fields, all length/type limits,
email/phone/date/numeric checks, consent, UUID, project/service allow-lists,
unexpected fields, unsafe URLs, credentials, normalized values и rejection
without any network call.

## Готово, когда

Каждый rejection reason имеет отдельный test case, positive output проверен
точно, coverage файла не ниже 95%.

Зависимость: 091.

## Implementation — 2026-10-16

Completed without subagents. Added a colocated server validator suite and
synthetic versioned homepage/lettering fixtures. Tests assert exact normalized
output, input immutability, required and optional fields, all field type and raw
length ceilings, configurable homepage limits, control characters, consent, UUID
version/variants, email and phone boundaries, context detection, service/project
allow-lists, choice fields, conditional email, numeric syntax, calendar dates,
file URL protocols/credentials and distinct aggregated errors. A throwing fetch
stub verifies validation performs no network requests. Production code and
runtime content were not changed.

## Verification

- Focused suite: 169 tests pass.
- Validator coverage: 100% statements, branches, functions and lines.
- Full regression suite: 99 files and 584 tests pass.
- Astro type checking: no errors; existing Zod finite() hint remains.
- Changed-file 80-column style check and component colocation gate pass.
- Git diff whitespace check passes.

[Corresponding plan](../../plan/20261016_031828_unit-test-suite-plan.md).
