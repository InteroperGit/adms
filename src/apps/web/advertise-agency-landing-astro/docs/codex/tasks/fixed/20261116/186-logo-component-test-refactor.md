# 186 - Replace logo smoke tests with render assertions

**Status:** fixed

**Priority:** normal

**Created:** 2026-11-15

**Scope:** `src/components/ui/Logo.astro`,
`src/components/ui/Logo.test.ts`, `src/components/ui/MaxLogo.astro`,
`src/components/ui/MaxLogo.test.ts`

## Goal

Replace the two import-only smoke tests with assertions about the rendered logo
markup and accessible image behavior.

## Scope

- Keep one colocated suite per component and remove `toBeDefined()`-only tests.
- Assert stable wrapper/classes, local asset references, dimensions or SVG
  output, decorative versus informative alt behavior and any caller props.
- Cover the meaningful variant or fallback branch exposed by each component;
  do not assert generated CSS or duplicate header composition tests.
- Do not change logo assets or public component APIs unless a test demonstrates
  an actual regression.

## Execution

- Skills: `astro-best-practices`, `ponytail`.
- Primary executor: Luna, medium.
- Delegation: none.

### Checklist

Update these checkboxes during execution using the
[task checklist rules](../../rules/workflow.md#task-checklists).

- [x] Read both components and their callers to identify the observable
  contract.
- [x] Replace the smoke assertions with minimal DOM render assertions.
- [x] Run both focused suites, `pnpm verify:component-tests` and changed-file
  formatting.
- [x] Review that tests do not depend on remote assets or production copy.
- [x] Record changed files, verification commands/results and resolved review
  findings in this task's handoff; reconcile all checkboxes before completion.

## Acceptance

- [x] Both render suites assert stable wrappers and local asset references.
- [x] Dimensions or SVG output and decorative/informative alt behavior are
  covered.
- [x] Caller props and meaningful variant/fallback branches are covered.
- [x] Neither logo suite is import-only.
- [x] Tests prove accessible rendered output, local asset usage and relevant
  optional behavior for both components.
- [x] Focused tests and component-test colocation verification pass.

## Dependencies

None. This task is independent of the new header component suites.

## Handoff

- Replaced the import-only assertions with render assertions in `Logo.test.ts`
  and `MaxLogo.test.ts`; no component or asset changed.
- The Logo suite verifies the local butterfly asset, dimensions, decorative
  alt behavior and header/footer variants. The MaxLogo suite verifies its
  inline SVG shape, dimensions and decorative accessibility attributes.
- `pnpm exec vitest run src/components/ui/Logo.test.ts
  src/components/ui/MaxLogo.test.ts` passed (2 files, 3 tests).
- `pnpm verify:component-tests` passed.
- Prettier check and `pnpm check:style` passed for both changed test files.
- `git diff --check` passed. Tests use only local markup and contain no remote
  asset or production-copy dependency.
- Independent test stage: `pnpm exec vitest run
  src/components/ui/Logo.test.ts src/components/ui/MaxLogo.test.ts` passed
  (2 files, 3 tests); `pnpm verify:component-tests` passed; Prettier and
  `pnpm check:style` passed. Confirmed local asset URL, dimensions, decorative
  alt/aria behavior, header/footer variant, SVG output, and no import-only
  assertions or remote dependencies. No source/test changes were needed.
- Review: Luna high worker `/root/task186_review` reported no findings;
  formatting and style checks passed.
- Worker IDs (Luna high): `/root/task186_impl`, `/root/task186_test`,
  `/root/task186_review`.
- Commit worker: `/root/task186_commit` (Luna high).
