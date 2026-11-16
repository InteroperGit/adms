# 175 - Add Card component tests

**Status:** backlog

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

1. Read the rules index, testing and verification rules, then inspect `Card` and
   `ContentImage` contracts.
2. Add meaningful DOM assertions for every optional branch and the accessible
   heading relationship.
3. Run `pnpm test -- src/components/cards/Card.test.ts` and the component test
   placement check.
4. Review the diff and record any unrelated existing failures.

## Acceptance

- The suite is colocated beside `Card.astro` and has no import-only assertion.
- Tests prove semantic article/heading output, optional media and metadata,
  native links, accessible action names and `data-project-link` behavior.
- The focused test and `pnpm verify:component-tests` pass.

## Dependencies

None. The existing `Link` component from task 174 is the current child API.

