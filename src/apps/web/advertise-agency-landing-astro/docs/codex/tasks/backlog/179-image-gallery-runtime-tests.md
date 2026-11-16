# 179 - Test the image gallery browser module

**Status:** backlog

**Priority:** high

**Created:** 2026-11-15

**Scope:** `src/scripts/image-gallery.ts`,
`src/scripts/image-gallery.test.ts`, `tests/helpers/browser.ts`

## Goal

Create a focused jsdom suite for gallery enhancement behavior without moving
browser interaction assertions into component tests or E2E prematurely.

## Scope

- Add `src/scripts/image-gallery.test.ts` and extend browser mocks only where
  the module needs stable dialog, focus, scroll or layout behavior.
- Cover missing-markup fallback, opening from each tile, body overflow lock,
  image/caption/announcement updates, current markers, previous/next wrapping,
  thumbnail selection, Escape/backdrop close, focus restoration and cleanup.
- Cover single-image hiding of directional controls and the Tab focus boundary.
- Reset DOM, listeners, timers and browser globals between tests.
- Do not weaken timeouts, skip failure paths or change the runtime for test
  convenience.

## Execution

- Skills: `ponytail`, `playwright` only if a browser diagnosis is required.
- Primary executor: Luna, high; the module has several interacting DOM states.
- Escalate to Sol only if jsdom behavior conflicts with the native dialog
  contract; record the concrete failure and decision in the task.
- Delegation: none.

### Checklist

1. Read testing rules, `image-gallery.ts`, gallery markup and existing browser
   helpers.
2. Build one minimal gallery fixture and exercise each public state transition.
3. Run `pnpm test -- src/scripts/image-gallery.test.ts` and inspect failures.
4. Run the component suite if helper changes affect shared DOM state.

## Acceptance

- Every public interaction and cleanup branch has a meaningful assertion.
- Native links remain intact when initialization prerequisites are absent.
- Focused tests pass with isolated mocks and no production-content dependency.

## Dependencies

Task 178 defines the server markup expected by the runtime. Keep this task
independent of full E2E gallery coverage.

