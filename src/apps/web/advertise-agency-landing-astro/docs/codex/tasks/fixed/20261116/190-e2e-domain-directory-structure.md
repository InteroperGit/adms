# 190 - Domain directory structure

**Status:** fixed

**Created:** 2026-11-16

## Goal

Domain directory structure while preserving observable E2E contracts.
Run after task 189.

## Scope

Move catalog, catalog-pagination, content-table and content-media specs
to tests/e2e/content/; carousel and gallery to media/; inquiry-delivery,
inquiry-validation and led-letters to inquiry/; navigation to navigation/;
preferences to preferences/. Move theme-styles.ts to support/.
Keep fixtures.ts, responsive, no-javascript and network specs at the root.
Keep the shared fixture entry point and use ../fixtures in nested specs.
Do not change browser configuration or behavior.

Production code, runtime content and tasks 161-173 are outside this series.
Preserve unrelated changes. No new dependencies or automatic commits.

## Execution

Parent: [188](../../todo/188-automate-e2e-refactor.md).
Read AGENTS.md, rules index, workflow, code-style, testing and verification.
Skills: ponytail; playwright for browser diagnosis.
Primary owns integration and acceptance; no delegation by default.
Luna medium for scoped edits/checks; Sol medium for cross-file fixture
contracts or systemic diagnosis. Record actual model/effort and escalation
evidence. Preserve external blocking, isolated preview on 4327 and fixtures.

- [x] Read applicable rules and sources; record initial worktree constraints.
- [x] Move files and update every relative import, including theme helpers.
- [x] Search package scripts, CI, current docs and tasks for old paths; update
  active callers. Preserve historical archives.
- [x] Compare pnpm test:e2e --list with baseline by title/project;
  allow expected path changes only, with no missing or duplicate cases.
- [x] Run moved directories and root theme-helper consumers using
  pnpm test:e2e with --retries=0 across all configured browsers.
- [x] Check changed-file formatting, links and full diff; resolve review.
- [x] Record files, commands/results, evidence and limitations in Handoff;
  reconcile checklists and update links/TASKS.md on archival.

## Acceptance

- [x] Every scoped outcome has evidence; required checks pass.
- [x] Original contracts, network isolation and browser matrix are preserved.
- [x] No unresolved failures or review findings are marked complete.
- [x] Handoff allows the next task to resume without guessing.

## Handoff

Moved 11 specs into `content/`, `media/`, `inquiry/`, `navigation/` and
`preferences/`; moved the shared theme assertions to `support/theme-styles.ts`.
Updated nested specs to use `../fixtures` and both theme-helper callers to use
the new support path. Root `fixtures.ts`, `responsive`, `no-javascript` and
`network` remain in place. Current package scripts and CI had no spec paths to
update. Current docs/tasks had no stale callers; historical plans were kept.

Saved the post-move list to ignored `output/e2e-refactor/190-test-list.txt`.
`pnpm test:e2e --list` still reports 306 tests. Comparing project, line and
full title against `output/e2e-refactor/baseline/test-list.txt` found zero
differences; source paths changed only as specified. Ran
`pnpm test:e2e tests/e2e/content tests/e2e/media tests/e2e/inquiry
tests/e2e/navigation tests/e2e/preferences
tests/e2e/no-javascript.spec.ts --retries=0`: 222/222 passed across Chromium,
Firefox and WebKit, with 2 workers. This includes root theme-helper consumers.

Prettier passed for the changed specs and task records; `node
scripts/check-code-style.mjs` passed for 13 changed files. An initial check
found the moved theme-helper import at 81 columns; wrapping it resolved both
checks. The source behavior and browser configuration were preserved. Separately,
the requested homepage title change was committed as `3222f0fb` and its
page-composition test passed (51/51); other page-title expectations remain.
