# 193 - Measured runtime optimization

**Status:** fixed

**Created:** 2026-11-16

## Goal

Measured runtime optimization while preserving observable E2E contracts.
Run after task 192.

## Scope

Use baseline evidence to inspect responsive, preferences, media, content
and navigation suites for redundant browser round trips or setup.
Review incidental geometry assumptions; keep intended viewport contracts.
There are currently no waitForTimeout/networkidle calls to remove.
Do not reduce route/viewport/theme/browser coverage, merge isolated contexts,
increase timeouts, change workers/retries or weaken assertions.
If no worthwhile optimization is evidenced, document that result.

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
- [x] Select a measured bottleneck and record the hypothesis and affected specs.
- [x] Apply the smallest evidence-backed improvement; preserve meaningful
  waits and focus, history, storage and media fallback assertions.
- [x] Measure the same workload before and after at least twice with equal
  workers, browsers, retries=0 and machine conditions. Separate
  build/server/test costs; do not claim gains within measurement noise.
- [x] Run affected specs with --repeat-each=2 --retries=0 in all browsers.
- [x] Check changed-file formatting, links and full diff; resolve review.
- [x] Record files, commands/results, evidence and limitations in Handoff;
  reconcile checklists and update links/TASKS.md on archival.

## Acceptance

- [x] Every scoped outcome has evidence; required checks pass.
- [x] Original contracts, network isolation and browser matrix are preserved.
- [x] No unresolved failures or review findings are marked complete.
- [x] Handoff allows the next task to resume without guessing.

## Handoff

Inspected `responsive.spec.ts`, `preferences/preferences.spec.ts`, `media/`,
`content/` and `navigation/`. Baseline measurements are in
`output/e2e-refactor/baseline/report.json` and
`output/e2e-refactor/baseline/behavior-map.txt`. The largest per-test aggregate
costs were gallery 279.5 s/120 runs, responsive 201.9 s/81, content table
139.4 s/57, inquiry delivery 127.4 s/30 and navigation 114.5 s/24. These sums
are concurrent worker durations across three browsers, not elapsed suite time.
The four slowest individual runs and two repeats each were recorded in task
189; all 24 repeats passed.

The hypothesis was that high-cost specs might contain redundant round trips or
generic waiting. Inspection found no `waitForTimeout` or `networkidle` calls.
Repeated navigations, reloads, isolated contexts and browser-specific waits
assert distinct route, history, theme, media fallback, or accessibility
contracts. Removing these would reduce coverage. There is no runtime or
configuration change within scope that safely removes those costs, so no code
optimization was justified. The measured result is therefore “no change”;
before/after timing and affected-spec repeats do not apply, and no performance
gain is claimed. The comparable passing baseline remains the reference.

Preserved all browser, route, viewport and theme combinations, workers,
timeouts, retries and assertions. No code or test behavior changed. Prettier
and source-style checks had no changed source to scan; local task links and the
handoff were checked before archival.
