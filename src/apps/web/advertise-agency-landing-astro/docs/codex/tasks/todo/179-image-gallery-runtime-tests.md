# 179 - Test the image gallery browser module

**Status:** todo

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

Update these checkboxes during execution using the
[task checklist rules](../../rules/workflow.md#task-checklists).

- [x] Read testing rules, `image-gallery.ts`, gallery markup and existing
  browser
  helpers.
- [x] Build one minimal gallery fixture and exercise each public state
  transition.
- [x] Run `pnpm test -- src/scripts/image-gallery.test.ts` and inspect failures.
- [x] Run the component suite if helper changes affect shared DOM state.
  Not applicable: `tests/helpers/browser.ts` was not changed.
- [x] Record changed files, verification commands/results and resolved review
  findings in this task's handoff; reconcile all checkboxes before completion.

## Acceptance

- [x] Opening from each tile locks body overflow and updates image, caption,
  announcement and current markers.
- [x] Previous/next wrapping and thumbnail selection are covered.
- [x] Escape/backdrop closing restores focus and body overflow.
- [x] Single-image controls and forward/backward Tab focus boundaries are
  covered.
- [x] Cleanup resets DOM, listeners, timers and browser globals between tests.
- [x] Every public interaction and cleanup branch has a meaningful assertion.
- [x] Native links remain intact when initialization prerequisites are absent.
- [x] Focused tests pass with isolated mocks and no production-content
  dependency.

## Dependencies

Task 178 defines the server markup expected by the runtime. Keep this task
independent of full E2E gallery coverage.

## Handoff

- Added `src/scripts/image-gallery.test.ts`; no runtime or shared helper changes.
- Covers native-link fallback; opening from each tile; image, caption,
  announcement and current markers; previous/next wrapping; thumbnail
  selection; button, backdrop and cancel closing; focus and overflow restore;
  single-image controls; Tab boundaries; arrow keys; and fresh-DOM setup.
- `pnpm exec vitest run src/scripts/image-gallery.test.ts` passed (12 tests).
- `pnpm test -- src/scripts/image-gallery.test.ts` passed (115 files,
  813 tests). After a test-only adjustment to avoid jsdom navigation logging,
  the focused suite was rerun and passed (12 tests).
- `pnpm check:style` passed for the changed test file.
- Dialog methods and thumbnail scrolling are mocked per fixture. No conflict
  with native dialog behavior was observed; no shared mock changes were needed.
- Initial failures were incorrect relative URL expectations; assertions now
  resolve URLs against `document.baseURI`.
- Independent test worker `/root/task179_test` reran
  `pnpm exec vitest run src/scripts/image-gallery.test.ts`: 1 file and 12
  tests passed. Inspected coverage includes fallback, each tile opener,
  metadata and markers, wrapping, thumbnail selection, all close paths,
  focus/overflow restoration, single-image controls, Tab and arrow keys, and
  DOM/global cleanup. The implementation worker's full package run passed
  115 files and 813 tests; no source edits were needed during verification.
- Review: Luna high worker `/root/task179_review` reported no findings and
  confirmed cleanup coverage; changed-file style check passed.
- Worker IDs (Luna high): `/root/task179_impl`, `/root/task179_test`,
  `/root/task179_review`.
