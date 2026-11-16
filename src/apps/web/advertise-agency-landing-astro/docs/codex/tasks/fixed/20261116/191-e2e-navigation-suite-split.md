# 191 - Split navigation suites

**Status:** fixed

**Created:** 2026-11-16

## Goal

Split navigation suites while preserving observable E2E contracts.
Run after task 190.

## Scope

Split tests/e2e/navigation/navigation.spec.ts into mobile-drawer.spec.ts,
header-settings.spec.ts, contact-menu.spec.ts and callback-dialog.spec.ts.
Map actual test groups before moving; document any necessary adjustment.
Preserve titles, steps, assertions, viewports and per-test isolation.
Do not introduce a general Page Object.

Production code, runtime content and tasks 161-173 are outside this series.
Preserve unrelated changes. No new dependencies or automatic commits.

## Execution

Parent: [188](188-automate-e2e-refactor.md).
Read AGENTS.md, rules index, workflow, code-style, testing and verification.
Skills: ponytail; playwright for browser diagnosis.
Primary owns integration and acceptance; no delegation by default.
Luna medium for scoped edits/checks; Sol medium for cross-file fixture
contracts or systemic diagnosis. Record actual model/effort and escalation
evidence. Preserve external blocking, isolated preview on 4327 and fixtures.

- [x] Read applicable rules and sources; record initial worktree constraints.
- [x] Map every existing navigation test to one destination file.
- [x] Move scenarios without changing behavior; delete the original only
  after all cases are accounted for.
- [x] Compare pnpm test:e2e navigation --list with the baseline map.
- [x] Run pnpm test:e2e navigation --repeat-each=2 --retries=0
  across all configured browsers.
- [x] Check changed-file formatting, links and full diff; resolve review.
- [x] Record files, commands/results, evidence and limitations in Handoff;
  reconcile checklists and update links/TASKS.md on archival.

## Acceptance

- [x] Every scoped outcome has evidence; required checks pass.
- [x] Original contracts, network isolation and browser matrix are preserved.
- [x] No unresolved failures or review findings are marked complete.
- [x] Handoff allows the next task to resume without guessing.

## Handoff

Mapped the original 8 scenarios without changing titles or steps:
`mobile-drawer.spec.ts` has the four drawer/navigation scenarios;
`header-settings.spec.ts` has the mobile theme/settings and tablet header
scenarios; `contact-menu.spec.ts` has the desktop contacts scenario;
`callback-dialog.spec.ts` has the mobile contact sheet and callback form
scenario. The desktop and mobile contact scenarios combine multiple surfaces;
each remained whole to preserve per-test isolation and assertions.

The original `navigation.spec.ts` was removed after all 8 scenarios were
accounted for. `pnpm test:e2e navigation --list` matched the baseline by
project and full title: 24/24 pairs, with no missing or duplicate cases.
`pnpm test:e2e navigation --repeat-each=2 --retries=0` passed 48/48 across
Chromium, Firefox and WebKit using 2 workers. Prettier, `node
scripts/check-code-style.mjs` and `git diff --check` passed. No `only`, `skip`
or `fixme` markers were found in the split directory. Review confirmed no
steps, assertions, viewport choices or test titles changed.
