# 189 - Baseline and contract map

**Status:** fixed

**Created:** 2026-11-16

## Goal

Baseline and contract map while preserving observable E2E contracts.
Run after task 188 starts the series.

## Scope

Inspect every tests/e2e spec, fixtures.ts, theme-styles.ts,
playwright.config.ts, scripts/e2e-server.mjs, vitest.config.ts, package.json
and .github/workflows/quality.yml. Do not edit test behavior.

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
- [x] Record worktree, tool versions and browser availability.
- [x] Save test:e2e --list and a title/project/behavior map under ignored
  output/e2e-refactor/baseline/. Record a concise summary in Handoff.
- [x] Run pnpm test:e2e --retries=0 with a JSON report. Record wall time,
  individual test durations, workers, build/server overhead and conditions.
- [x] Repeat slow or failing cases with --repeat-each=2 --retries=0.
  Diagnose failures before transfers; archived task 187 is context only.
- [x] Check changed-file formatting, links and full diff; resolve review.
- [x] Record files, commands/results, evidence and limitations in Handoff;
  reconcile checklists and update links/TASKS.md on archival.

## Acceptance

- [x] Every scoped outcome has evidence; required checks pass.
- [x] Original contracts, network isolation and browser matrix are preserved.
- [x] No unresolved failures or review findings are marked complete.
- [x] Handoff allows the next task to resume without guessing.

## Handoff

Inspected `tests/e2e/*.spec.ts`, `fixtures.ts`, `theme-styles.ts`,
`playwright.config.ts`, `scripts/e2e-server.mjs`, `vitest.config.ts`,
`package.json` and `.github/workflows/quality.yml`. Initial branch was
`adv-agency-landing-astro`; existing changes were the newly authored tasks
188-194, `.codex/TASKS.md` and `docs/codex/rules/workflow.md`. Tools: Node
v25.7.0, pnpm 10.7.0, Playwright 1.64.1; all configured browsers installed.

Baseline evidence is in ignored `output/e2e-refactor/baseline/`:
`test-list.txt`, `behavior-map.txt`, `report.json` and `slow-repeat.txt`.
`pnpm test:e2e --list` listed 306 tests. `pnpm test:e2e --retries=0
--reporter=json` passed 306/306, 102 per browser, no skips/flakes, with 2
workers and the isolated preview on 127.0.0.1:4327 (`reuseExistingServer:
false`). Measured wall time was 533.6 s; Playwright reported 531.2 s. Summed
individual worker durations were 977.2 s (Chromium 179.2 s, Firefox 278.7 s,
WebKit 519.3 s). The first test began 27.8 s after report start, covering
build/preview startup; the remaining 2.4 s is runner shutdown/measurement
overhead. Conditions: local Windows environment, Node v25.7.0, no retries.

Four test runs exceeded 10 s. Repeated their cases twice across all projects
with `pnpm test:e2e --grep="theme choice synchronizes|desktop contacts
preserve choices|scopes arrow styles across layouts|manual controls select
and announce slides" --repeat-each=2 --retries=0`: 24/24 passed. No baseline
failure requires diagnosis. The four slowest runs were WebKit theme sync
(18.5 s), desktop contacts (17.1 s), carousel layout/theme/viewport (14.5 s)
and carousel controls (11.8 s). This is a local baseline; elapsed time is
machine/load dependent. No test behavior was edited.

Changed-file review: local Prettier check passed for tasks 188, 189 and
`.codex/TASKS.md`; `git diff --check` passed. Task links were checked against
their current paths. No source or test behavior changed.
