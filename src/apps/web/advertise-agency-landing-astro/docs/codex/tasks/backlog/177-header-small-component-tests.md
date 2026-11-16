# 177 - Test the small header components

**Status:** backlog

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

1. Read task 171 and the current `Header`, `Button` and contact-menu tests.
2. Add synthetic props covering the normal and address edge branches.
3. Run the two focused suites and `pnpm verify:component-tests`.
4. Review that no test depends on production contact data or external assets.

## Acceptance

- Both components have colocated, behavior-focused suites.
- Tests prove keyboard-relevant attributes, native `tel:` and hash links,
  address fallback rendering and icon-bearing controls.
- Focused tests and component colocation checks pass without enabling delivery.

## Dependencies

Task 171 is archived and supplies the current component contracts. Do not
depend on task 173; callback delivery remains disabled.

