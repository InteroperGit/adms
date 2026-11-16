# 182 - Test content copy exports B

**Status:** fixed

**Priority:** normal

**Created:** 2026-11-15

**Scope:** `src/content/order-inquiry.ts`,
`src/content/ordering-process.ts`,
`src/content/production-and-guarantees.ts`, `src/content/reviews.ts`

## Goal

Complete colocated export coverage for the remaining standalone content copy
modules while keeping editorial parsing separate from publication decisions.

## Scope

- Add matching tests for the four listed modules.
- Assert required and optional content fields, stable item order, source-level
  IDs and parser failures for malformed or missing required values.
- Reuse existing fixtures/builders; add only minimal versioned fixtures when a
  boundary is not represented.
- Do not change content JSON, schemas or publication helpers.

## Execution

- Skills: `ponytail`.
- Primary executor: Luna, medium.
- Delegation: none.

### Checklist

Update these checkboxes during execution using the
[task checklist rules](../../rules/workflow.md#task-checklists).

- [x] Inspect each module and its validation/publication counterpart.
- [x] Add one suite per module with success, optional-field and failure cases.
- [x] Run focused tests plus the four related validation suites.
- [x] Check fixture boundaries and review the complete diff.
- [x] Record changed files, verification commands/results and resolved review
  findings in this task's handoff; reconcile all checkboxes before completion.

## Acceptance

- [x] Required and optional fields are covered in all four module exports.
- [x] Source IDs and authored item order are preserved.
- [x] Malformed and missing required values cause parser failures.
- [x] Each listed module has a colocated, non-smoke suite.
- [x] Tests distinguish parser normalization from approval/publication behavior
  and
  preserve authored ordering.
- [x] Focused tests and changed-file style checks pass.

## Dependencies

Task 180 is a useful test pattern; no runtime dependency is introduced.

## Handoff

- Added colocated suites for `order-inquiry`, `ordering-process`,
  `production-and-guarantees` and `reviews`; no runtime content, schemas,
  publication helpers or fixture files changed.
- The four focused suites and four related validation suites passed:
  `pnpm exec vitest run src/content/order-inquiry.test.ts
  src/content/ordering-process.test.ts
  src/content/production-and-guarantees.test.ts src/content/reviews.test.ts
  src/validation/order-inquiry.test.ts
  src/validation/ordering-process.test.ts
  src/validation/production-and-guarantees.test.ts
  src/validation/reviews.test.ts` (8 files, 46 tests).
- Reran the same eight suites after test-title formatting changes; 8 files and
  46 tests passed.
- `pnpm check:style` passed for the four new suites.
- Tests use the versioned `tests/fixtures/content/site/config` alias for
  valid data and in-memory mocked imports for missing required fields. They
  assert source IDs/order and separate parser behavior from publication.
- Independent test stage: the four export suites and four related validation
  suites passed (8 files, 46 tests); `pnpm check:style` passed for the four
  new files. All suites use the versioned fixture alias; no production data is
  changed or imported.
- Acceptance review found a potential gap: each export suite asserts an
  import-time failure for a missing property, but does not separately assert
  failure for a malformed non-missing value. The task acceptance names both
  malformed and missing values. Related validation tests cover malformed
  schema values but do not prove the content module import boundary for them.
  This finding was resolved by adding distinct malformed-value cases below.
- Repair cycle: added import-time parser failures for an unsafe delivery
  endpoint, invalid ordering step ID, unsupported warranty source type, and
  non-positive review image width. These are distinct from missing-property
  cases and use in-memory data mocks; no runtime or fixture files changed.
- Repair verification: the four export suites and four related validation
  suites passed (8 files, 50 tests); `pnpm check:style` and `git diff --check`
  passed. The first style run flagged one long test title; it was shortened,
  then the style check passed for all four changed files.
- Independent post-repair test stage: `pnpm exec vitest run
  src/content/order-inquiry.test.ts src/content/ordering-process.test.ts
  src/content/production-and-guarantees.test.ts src/content/reviews.test.ts
  src/validation/order-inquiry.test.ts
  src/validation/ordering-process.test.ts
  src/validation/production-and-guarantees.test.ts
  src/validation/reviews.test.ts` passed (8 files, 50 tests);
  `pnpm check:style` passed for the four changed suites. Confirmed each
  export module has distinct missing and malformed import-failure cases.
  Vitest emitted a non-fatal warning for an invalid `--localstorage-file`
  path. No source or test files changed during verification.
- Review: Luna high worker `/root/task182_review` reported no findings.
- Worker IDs (Luna high): `/root/task182_impl`, `/root/task182_test`,
  `/root/task182_repair`, `/root/task182_retest`, `/root/task182_review`.
- Commit worker: `/root/task182_commit` (Luna high).
