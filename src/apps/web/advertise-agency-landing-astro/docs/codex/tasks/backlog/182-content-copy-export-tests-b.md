# 182 - Test content copy exports B

**Status:** backlog

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

1. Inspect each module and its validation/publication counterpart.
2. Add one suite per module with success, optional-field and failure cases.
3. Run focused tests plus the four related validation suites.
4. Check fixture boundaries and review the complete diff.

## Acceptance

- Each listed module has a colocated, non-smoke suite.
- Tests distinguish parser normalization from approval/publication behavior and
  preserve authored ordering.
- Focused tests and changed-file style checks pass.

## Dependencies

Task 180 is a useful test pattern; no runtime dependency is introduced.

