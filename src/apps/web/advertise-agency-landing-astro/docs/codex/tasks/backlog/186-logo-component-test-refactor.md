# 186 - Replace logo smoke tests with render assertions

**Status:** backlog

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

1. Read both components and their callers to identify the observable contract.
2. Replace the smoke assertions with minimal DOM render assertions.
3. Run both focused suites, `pnpm verify:component-tests` and changed-file
   formatting.
4. Review that tests do not depend on remote assets or production copy.

## Acceptance

- Neither logo suite is import-only.
- Tests prove accessible rendered output, local asset usage and relevant
  optional behavior for both components.
- Focused tests and component-test colocation verification pass.

## Dependencies

None. This task is independent of the new header component suites.

