# 175 - Add Card component tests

**Status:** todo

**Priority:** normal

**Created:** 2026-11-15

**Scope:** `src/components/cards/Card.astro`

## Goal

Replace the missing colocated suite with behavior assertions for the shared
catalog card. Keep the task limited to the card contract and its existing
image/link children.

## Scope

- Add `src/components/cards/Card.test.ts`.
- Cover title and description output, optional image and metadata, category
  colors, linked and unlinked titles, action labels, project markers and
  missing `href` branches.
- Use minimal synthetic props and the existing Astro render helper.
- Do not change card markup, styling, content data or child components unless
  a test exposes a real contract defect.

## Execution

- Skills: `astro-best-practices`, `ponytail`.
- Primary executor: Luna, medium; the contract is local and deterministic.
- Delegation: none.

### Checklist

Update these checkboxes during execution using the
[task checklist rules](../../rules/workflow.md#task-checklists).

- [x] Read the rules index, testing and verification rules, then inspect `Card`
  and
  `ContentImage` contracts.
- [x] Add meaningful DOM assertions for every optional branch and the accessible
  heading relationship.
- [x] Run `pnpm test -- src/components/cards/Card.test.ts` and the component
  test
  placement check.
- [x] Review the diff and record any unrelated existing failures.
- [ ] Record changed files, verification commands/results and resolved review
  findings in this task's handoff; reconcile all checkboxes before completion.

## Acceptance

- [x] Title, description and article/heading relationships are asserted.
- [x] Optional image, metadata and category colors have assertions.
- [x] Linked/unlinked titles, missing href, action labels and project markers
  are covered.
- [x] The suite is colocated beside `Card.astro` and has no import-only
  assertion.
- [x] Tests prove semantic article/heading output, optional media and metadata,
  native links, accessible action names and `data-project-link` behavior.
- [x] The focused test and `pnpm verify:component-tests` pass.

## Dependencies

None. The existing `Link` component from task 174 is the current child API.

## Handoff

- Implementation: Luna high worker added `Card.test.ts`; no runtime source
  changed.
- Test: Luna high worker verified `pnpm test --
  src/components/cards/Card.test.ts` (108 files, 788 tests passed),
  `pnpm exec vitest run src/components/cards/Card.test.ts` (4 tests passed),
  and `pnpm verify:component-tests` (passed).
- The requested `pnpm test -- ...` invocation ran the full suite; no unrelated
  failures were observed.
