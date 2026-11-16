# 181 - Test content copy exports A

**Status:** fixed

**Priority:** normal

**Created:** 2026-11-15

**Scope:** `src/content/about-carousel.ts`,
`src/content/business-solutions.ts`, `src/content/faq.ts`,
`src/content/introduction.ts`, `src/content/offers.ts`

## Goal

Test the typed parse-and-export boundary for the first group of content copy
modules, including the derived enabled-offer view.

## Scope

- Add matching colocated tests for all five modules.
- Assert the parser receives valid fixture data, exported values retain their
  source order and IDs, and `enabledOffers` filters without reordering.
- Add malformed fixture cases only through `tests/fixtures/content/` when the
  existing parser contract cannot be exercised in memory.
- Do not duplicate validator internals, publication policy or rendered section
  assertions.

## Execution

- Skills: `ponytail`.
- Primary executor: Luna, medium.
- Delegation: none.

### Checklist

Update these checkboxes during execution using the
[task checklist rules](../../rules/workflow.md#task-checklists).

- [x] Read each source module, its schema test and the fixture alias in Vitest.
- [x] Add focused export tests with valid, empty/optional and invalid boundaries
  owned by the module.
- [x] Run the five focused suites and the related validation tests.
- [x] Review fixture placement and changed-file formatting.
- [x] Record changed files, verification commands/results and resolved review
  findings in this task's handoff; reconcile all checkboxes before completion.

## Acceptance

- [x] Valid, empty/optional and invalid module boundaries are covered.
- [x] Normalized values preserve source IDs and authored order.
- [x] enabledOffers filters disabled items without reordering enabled items.
- [x] All five source modules have matching colocated suites.
- [x] Tests prove normalized output, order preservation, optional fields and the
  enabled-offer projection without relying on production content snapshots.
- [x] Focused tests and style checks for changed files pass.

## Dependencies

Task 180 establishes the simple content export testing pattern but no code
dependency is required.

## Handoff

- Added colocated suites for `about-carousel`, `business-solutions`, `faq`,
  `introduction` and `offers`; no runtime source or fixture files changed.
- The five focused suites and their related schema tests passed:
  `pnpm exec vitest run src/content/about-carousel.test.ts
  src/content/business-solutions.test.ts src/content/faq.test.ts
  src/content/introduction.test.ts src/content/offers.test.ts
  src/validation/image-carousel.test.ts
  src/validation/business-solutions.test.ts src/validation/faq.test.ts
  src/validation/introduction.test.ts src/validation/offers.test.ts`
  (10 files, 61 tests).
- `pnpm check:style` passed for all five new suites.
- Import-time malformed data is exercised through mocked versioned fixture
  modules; the offers projection uses mixed enabled states to assert filtering
  without reordering. No production content was read or changed.
- Independent test stage: `pnpm exec vitest run
  src/content/about-carousel.test.ts src/content/business-solutions.test.ts
  src/content/faq.test.ts src/content/introduction.test.ts
  src/content/offers.test.ts src/validation/image-carousel.test.ts
  src/validation/business-solutions.test.ts src/validation/faq.test.ts
  src/validation/introduction.test.ts src/validation/offers.test.ts` passed
  (10 files, 61 tests); `pnpm check:style` passed. Confirmed ID/order
  assertions use fixture order, `enabledOffers` filters IDs to `[1, 3]`
  without reordering, and no production content is loaded. Vitest emitted
  non-fatal warnings for an invalid `--localstorage-file` path.
- Review: Luna high worker `/root/task181_review` reported no findings.
- Worker IDs (Luna high): `/root/task181_impl`, `/root/task181_test`,
  `/root/task181_review`.
- Commit: Luna high worker `/root/task181_commit` committed the verified task
  changes as `a374dfc4` (`test: cover content copy export contracts`). The
  staged diff check passed; only the five suites and this task file were
  committed.
