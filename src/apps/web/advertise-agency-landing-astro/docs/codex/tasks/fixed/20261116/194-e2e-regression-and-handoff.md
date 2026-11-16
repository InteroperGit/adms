# 194 - Regression and handoff

**Status:** fixed

## Goal

Verify integration after tasks 189-193.

## Scope

Compare baseline and final behavior maps. Update current E2E documentation
and commands where paths changed. Preserve historical plans and archives.
Keep fixtures.ts as the shared test/expect entry point and network boundary.
No production changes, new dependencies or runtime content edits.

## Execution

Parent: [188](188-automate-e2e-refactor.md). Start after task 193.
Read rules index, workflow, testing, code-style and verification.
Skills: ponytail; playwright for diagnosis. Primary owns acceptance.
Luna medium for checks/docs; Sol medium for cross-file failures.
No delegation by default; record actual models and escalation evidence.

- [x] Read applicable rules and record worktree constraints.
- [x] Compare final list and baseline map: every original contract must
  remain covered in each browser, allowing documented path changes.
- [x] Review diff for weakened assertions, only/skip/fixme, external sends,
  fixture leaks and runtime reads; resolve all findings.
- [x] Run pnpm format:check, pnpm lint, pnpm verify:boundaries,
  pnpm check and pnpm test:e2e --retries=0; record each result.
- [x] Verify Vitest excludes tests/e2e/**, CI commands resolve new paths,
  and fixture preview startup/shutdown and artifacts remain correct.
- [x] Update current usage docs only as needed; preserve one rule owner.
- [x] Record comparable before/after metrics and limitations; check links,
  formatting and full diff; reconcile checklists and update TASKS.md.

## Acceptance

- [x] Every original browser contract is accounted for.
- [x] Required checks pass with no unresolved review findings.
- [x] Measurements and evidence limits are explicit; focused checks are
  not described as the full verification suite.
- [x] Tasks are ready for automatic archival by 188.

## Handoff

Final contract map is in ignored `output/e2e-refactor/final-test-list.txt`.
It lists 309 tests: the 306 baseline title/project pairs remain present after
suite/path changes, and the desktop settings heading/spacing assertion adds
one test to each of Chromium, Firefox and WebKit. `pnpm test:e2e --retries=0`
passed 309/309 (103 per browser), with two workers, no retries, skips or
unexpected outcomes. Wall time was 7.3 minutes versus 533.6 seconds at
baseline. These are single local Windows runs; machine load and startup time
make the elapsed-time difference indicative, not a stable performance claim.
The unchanged project configuration uses `reuseExistingServer: false` and
the isolated preview at 127.0.0.1:4327.

Required checks passed: `pnpm format:check`; `pnpm lint`; `pnpm
verify:boundaries`; `pnpm check` (371 Astro files, 0 errors, 0 warnings and
one existing deprecation hint at `src/validation/content-blocks.ts:129`);
`pnpm test:e2e --retries=0` (309/309). Formatting and boundary checks noted
the existing LF-to-CRLF warning for the user's modified
`docs/codex/rules/workflow.md`; that file was preserved.

Review found no `only`, `skip` or `fixme` markers under `tests/e2e`. External
requests are blocked by the shared fixture, except the test that confirms
blocking and the local Yandex Captcha stub. Fixture runtime data comes from
versioned `tests/fixtures/content/`; the server builds under ignored
`output/playwright/content`, restores shared `.astro` files in `finally`, and
Playwright owns and stops its isolated preview. Vitest excludes `tests/e2e/**`;
CI invokes the package script without stale file paths. No current usage doc
needed an update; historical plans and task records retain their original
paths by design. The baseline lists live in ignored
`output/e2e-refactor/baseline/`.

All required acceptance evidence is complete. Broader gates from
`verification.md` were not run because task 188 reserves them for explicit
user request. Task 194 and parent 188 were reconciled and archived on
2026-11-16 (Europe/Moscow).
