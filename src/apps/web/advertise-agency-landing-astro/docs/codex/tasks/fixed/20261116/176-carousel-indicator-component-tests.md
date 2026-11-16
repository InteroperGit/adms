# 176 - Add carousel indicator component tests

**Status:** fixed

**Priority:** normal

**Created:** 2026-11-15

**Scope:** `src/components/ui/CarouselDot.astro`,
`src/components/ui/CarouselDots.astro`

## Goal

Add colocated tests for the manual and passive carousel indicator branches,
including the ID and accessibility relationships consumed by the carousel
runtime.

## Scope

- Add `CarouselDot.test.ts` and `CarouselDots.test.ts` beside their sources.
- Cover manual button output, labels, `aria-controls`, index markers, passive
  noninteractive output, group labeling, `aria-hidden`, item order and empty
  item lists.
- Assert the child component receives the expected slide IDs; do not test CSS
  pixels or duplicate `ImageCarousel` integration scenarios.
- Do not alter the public props or carousel runtime.

## Execution

- Skills: `astro-best-practices`, `ponytail`.
- Primary executor: Luna, medium.
- Delegation: none.

### Checklist

Update these checkboxes during execution using the
[task checklist rules](../../rules/workflow.md#task-checklists).

- [x] Read the rules index and inspect `CarouselControl`, `ImageCarousel` and
  the
  existing carousel tests.
- [x] Add focused render tests for manual and automatic-only modes, including
  zero
  and multiple items.
- [x] Run `pnpm test -- src/components/ui/CarouselDot.test.ts
  src/components/ui/CarouselDots.test.ts`.
- [x] Run `pnpm verify:component-tests` and review the complete diff.
- [x] Record changed files, verification commands/results and resolved review
  findings in this task's handoff; reconcile all checkboxes before completion.

## Acceptance

- [x] Manual buttons expose labels, aria-controls and index markers.
- [x] Passive indicators are noninteractive and have the expected aria-hidden
  state.
- [x] Group labels, slide IDs, item order and empty lists are covered.
- [x] Both source files have matching colocated suites with observable HTML
  assertions.
- [x] Manual dots are keyboard controls with stable labels and target IDs;
  passive dots are not exposed as controls.
- [x] Focused tests and component colocation verification pass.

## Dependencies

None. Keep runtime behavior unchanged.

## Handoff

- Implementation: Luna high worker added `CarouselDot.test.ts` and
  `CarouselDots.test.ts`; no runtime source changed.
- Initial `pnpm test -- src/components/ui/CarouselDot.test.ts
  src/components/ui/CarouselDots.test.ts` ran the full suite and failed only
  the two new manual-label expectations because the source literals are
  mojibake while rendered labels are valid Russian. Updated expectations to
  match rendered `Показать: slide 3` and `Выбор изображения`.
- `pnpm exec vitest run src/components/ui/CarouselDot.test.ts
  src/components/ui/CarouselDots.test.ts` passed (2 files, 5 tests).
- Independent test stage: `pnpm test -- src/components/ui/CarouselDot.test.ts
  src/components/ui/CarouselDots.test.ts` passed the full suite (110 files,
  793 tests); `pnpm exec vitest run src/components/ui/CarouselDot.test.ts
  src/components/ui/CarouselDots.test.ts` passed (2 files, 5 tests); and
  `pnpm verify:component-tests` passed. No implementation edits were needed.
- Review: Luna high worker reported no findings; changed-file style check
  passed. The rendered labels asserted by the suite are `Показать: slide 3`
  and `Выбор изображения`.
- Commit: Luna high worker committed the verified task changes as
  `478cabec` (`test: cover carousel indicator render contracts`). The staged
  diff check passed; only the two suites and this task file were committed.
- Worker IDs (Luna high): `/root/task176_impl`, `/root/task176_test`,
  `/root/task176_review`, `/root/task176_commit`.
