# 177 - Test the small header components

**Status:** fixed

**Priority:** normal

**Created:** 2026-11-15

**Scope:** `src/components/ui/HeaderMenuOpener.astro`,
`src/components/ui/MobileHeaderContacts.astro`

## Goal

Cover the two header components introduced by the recent navigation work with
small SSR suites that lock down control semantics and contact destinations.

## Scope

- Add matching `HeaderMenuOpener.test.ts` and `MobileHeaderContacts.test.ts`.
- Assert the menu button type, accessible name, dialog relationship, initial
  expanded state and both icon markers.
- Assert phone normalization, contact-menu attributes, address splitting,
  labels and native links for spaced and comma-free addresses.
- Keep tests at the component boundary; header coordination remains in
  `Header.test.ts` and browser navigation remains in E2E tests.
- Do not change callback delivery, contact values or visual CSS.

## Execution

- Skills: `astro-best-practices`, `ponytail`.
- Primary executor: Luna, medium.
- Delegation: none.

### Checklist

Update these checkboxes during execution using the
[task checklist rules](../../rules/workflow.md#task-checklists).

- [x] Read task 171 and the current `Header`, `Button` and contact-menu tests.
- [x] Add synthetic props covering the normal and address edge branches.
- [x] Run the two focused suites and `pnpm verify:component-tests`.
- [x] Review that no test depends on production contact data or external assets.
- [x] Record changed files, verification commands/results and resolved review
  findings in this task's handoff; reconcile all checkboxes before completion.

## Acceptance

- [x] Menu button type, name, dialog relationship, expanded state and both icons
  are asserted.
- [x] Phone normalization, contact-menu attributes and native tel/hash links are
  covered.
- [x] Spaced and comma-free addresses exercise splitting and fallback labels.
- [x] Both components have colocated, behavior-focused suites.
- [x] Tests prove keyboard-relevant attributes, native `tel:` and hash links,
  address fallback rendering and icon-bearing controls.
- [x] Focused tests and component colocation checks pass without enabling
  delivery.

## Dependencies

Task 171 is archived and supplies the current component contracts. Do not
depend on task 173; callback delivery remains disabled.

## Handoff

- Added `HeaderMenuOpener.test.ts` and `MobileHeaderContacts.test.ts` with
  synthetic phone/address values; no runtime source changed.
- Initial focused run exposed an ambiguous query matching all three named
  contact links. Replaced it with a direct native phone-anchor assertion.
- `pnpm exec vitest run src/components/ui/HeaderMenuOpener.test.ts
  src/components/ui/MobileHeaderContacts.test.ts` passed (2 files, 4 tests).
- `pnpm check:style` passed for both changed files.
- Independent test stage: `pnpm test --
  src/components/ui/HeaderMenuOpener.test.ts
  src/components/ui/MobileHeaderContacts.test.ts` passed the full suite
  (112 files, 797 tests); `pnpm verify:component-tests` passed. No source or
  test edits were needed during verification.
- Review: Luna high worker reported no findings; the changed-file style check
  passed.
- Worker IDs (Luna high): `/root/task177_impl`, `/root/task177_test`,
  `/root/task177_review`.
- Commit: Luna high worker committed the verified task changes as
  `187a33bd` (`test: cover compact header component contracts`). The staged
  diff check passed; only the two suites and this task file were committed.
- Commit worker: `/root/task177_commit` (Luna high).
