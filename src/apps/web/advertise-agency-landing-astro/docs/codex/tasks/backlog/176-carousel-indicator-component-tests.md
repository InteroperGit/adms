# 176 - Add carousel indicator component tests

**Status:** backlog

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

1. Read the rules index and inspect `CarouselControl`, `ImageCarousel` and the
   existing carousel tests.
2. Add focused render tests for manual and automatic-only modes, including zero
   and multiple items.
3. Run `pnpm test -- src/components/ui/CarouselDot.test.ts
   src/components/ui/CarouselDots.test.ts`.
4. Run `pnpm verify:component-tests` and review the complete diff.

## Acceptance

- Both source files have matching colocated suites with observable HTML
  assertions.
- Manual dots are keyboard controls with stable labels and target IDs;
  passive dots are not exposed as controls.
- Focused tests and component colocation verification pass.

## Dependencies

None. Keep runtime behavior unchanged.

