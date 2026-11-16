# 180 - Test simple content exports

**Status:** todo

**Priority:** normal

**Created:** 2026-11-15

**Scope:** `src/content/about.ts`, `src/content/action-rail.ts`,
`src/content/icons.ts`, `src/content/legal.ts`,
`src/content/project-catalog.ts`

## Goal

Add colocated tests for the small typed content/config modules currently
covered only indirectly by consumers or validation suites.

## Scope

- Add matching test files for all five modules.
- Assert exported shapes, preserved authored values, strict action-rail parsing,
  legal document pairing, icon registry keys and positive catalog page size.
- Use the existing fixture alias and versioned synthetic fixtures where a
  malformed boundary is needed; never modify `data/content/`.
- Keep schema validation assertions separate from publication or page claims.

## Execution

- Skills: `ponytail`.
- Primary executor: Luna, medium; these are deterministic module contracts.
- Delegation: none.

### Checklist

Update these checkboxes during execution using the
[task checklist rules](../../rules/workflow.md#task-checklists).

- [x] Read the source types, validators and relevant fixture files before
  writing
  expectations.
- [x] Add one colocated suite per source module, including at least one boundary
  or failure assertion for parsed settings.
- [x] Run the five focused suites and `pnpm test:types` if type fixtures change.
  No type-contract fixture changed, so the type check is not applicable.
- [x] Review that tests do not assert incidental JSON ordering.
- [x] Record changed files, verification commands/results and resolved review
  findings in this task's handoff; reconcile all checkboxes before completion.

## Handoff

- Added colocated suites for `about`, `action-rail`, `icons`, `legal` and
  `project-catalog`; no runtime content or source changed.
- `pnpm exec vitest run src/content/about.test.ts
  src/content/action-rail.test.ts src/content/icons.test.ts
  src/content/legal.test.ts src/content/project-catalog.test.ts` passed
  (5 files, 6 tests).
- `pnpm check:style` passed for all five changed files.
- No type-contract fixture changed; `pnpm test:types` was not applicable.
- Independent test stage: `pnpm exec vitest run
  src/content/about.test.ts src/content/action-rail.test.ts
  src/content/icons.test.ts src/content/legal.test.ts
  src/content/project-catalog.test.ts` passed (5 files, 6 tests);
  `pnpm check:style` passed for the five changed files.
- Initial test-stage finding: `icons.test.ts` compared
  `Object.keys(icons.menu)` to an ordered array, asserting incidental key
  order. The repair below resolves this finding.
- Repair cycle: changed the nested menu key assertion to order-independent
  `expect.arrayContaining(["open", "close"])`; no runtime or fixture changes.
- Repair verification: all five focused suites passed (5 files, 6 tests), and
  `pnpm check:style` passed for five changed files.
- Independent post-repair test stage: `pnpm exec vitest run
  src/content/about.test.ts src/content/action-rail.test.ts
  src/content/icons.test.ts src/content/legal.test.ts
  src/content/project-catalog.test.ts` passed (5 files, 6 tests);
  `pnpm check:style` passed. Confirmed the expected icon keys are compared
  without order dependence. Vitest emitted a non-fatal warning for an invalid
  `--localstorage-file` path.
- Review: Luna high worker `/root/task180_review` reported no findings.
- Worker IDs (Luna high): `/root/task180_impl`, `/root/task180_test`,
  `/root/task180_repair`, `/root/task180_retest`, `/root/task180_review`.

## Acceptance

- [x] All five exports preserve authored values and expose their expected
  shapes.
- [x] Strict action-rail parsing rejects malformed settings.
- [x] Legal document pairing, icon keys and positive catalog page size are
  asserted.
- [x] Every listed module has a matching colocated test with observable contract
  assertions.
- [x] Tests cover export shape and the strict/positive boundaries owned by each
  module without duplicating consumer behavior.
- [x] Focused tests and applicable type checks pass.

## Dependencies

None. Existing validation and publication suites remain the deeper schema
coverage.
