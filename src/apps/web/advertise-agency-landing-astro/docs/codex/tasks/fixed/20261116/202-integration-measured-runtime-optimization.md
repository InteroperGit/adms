# 202 - Optimize integration setup using measurements

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

**Status:** complete

**Created:** 2026-11-16

**Parent:** [195](195-automate-integration-test-improvements.md)

**Dependency:** [201](201-integration-inquiry-and-fallback-contracts.md)

## Goal

Optimize integration setup using measurements for tests/integration/.

## Scope

- After functional tasks pass, profile integration suites and shared render
  setup.
- Compare with 196 using three identical runs and median wall time, per-file
  time, case count and environment.
- Separate cold/warm behavior.
- Optimize only measured repeated container/DOM construction, fixtures or module
  resets whose lifecycle remains correct.
- Avoid a shared container or broad global state unless isolation is
  demonstrated; retain window cleanup and real module composition.
- Add no dependencies or timing sleeps.
- Run changed suites independently, all integration suites and reversed or
  seeded ordering with a supported installed Vitest option.
- Record the seed.
- Revert unsuccessful complexity; retaining existing code is acceptable with
  measured evidence.
- No numeric speedup promise or CI time threshold.
- Runtime content stays in data/content/; synthetic fixtures belong in
  tests/fixtures/content/.
- Production behavior changes require a separate explicit scope decision.
- Preserve unrelated work and existing test gates.

## Execution

Skills: ponytail; Astro skill if changing .astro; playwright only for browser
diagnosis. Primary owns review and acceptance. No delegation. Luna
(`gpt-6-luna`), high, for execution and review per user override. Record
actual routing and evidence in Handoff.

- [x] Read AGENTS.md and rules index, workflow, style, testing, verification.
- [x] Read parent, dependency evidence and affected source/callers.
- [x] Move this file backlog -> todo; update status and all task links.
- [x] Implement the scoped outcomes and record changed files.
- [x] Run checks named in Scope; record commands and actual results.
- [x] Review diff and resolve findings without weakening assertions.
- [x] Reconcile acceptance and execution; record evidence and limitations.
- [x] On accepted automatic execution archive to fixed/yyyyMMdd and update
  parent, sibling links and .codex/TASKS.md using Europe/Moscow date.

## Acceptance

- [x] Before/after measurements are reproducible and contracts are preserved.
- [x] Different ordering and individual suite runs show no state leakage.
- [x] Any retained optimization has measured benefit and no reduced assertions.

## Handoff

Actual profiling and review: Luna (`gpt-6-luna`), high, per user override.
No code changes, delegation or escalation. Measurements did not identify a
repeatable optimization opportunity, so the existing per-render AstroContainer
and JSDOM lifecycle remains in place.

No source or test files changed; this task record is the only task-specific
change. The current five suites contain 73 cases, compared with 196's 59 cases
in two suites. The earlier total-wall reduction is not a speedup claim because
case count and suite count changed and run variation is similar in size.

Environment: Windows x64, Node 25.7.0, pnpm 10.7.0, Vitest 4.0.18. Same
`pnpm test:integration` command and fixture contents for each comparable run.
PowerShell `Stopwatch` measures command wall time; Vitest reports aggregate and
per-file test time. Process `TEMP`/`TMP` pointed to ignored `output/task195`.

Three identical runs passed 5 files/73 tests each:

| Run | crawler | inquiry | catalog | articles | shell/legal | Vitest | wall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 532 ms | 813 ms | 1,999 ms | 3,500 ms | 2,627 ms | 43.11 s | 48.899 s |
| 2 | 571 ms | 1,175 ms | 3,029 ms | 4,786 ms | 3,727 ms | 46.15 s | 51.931 s |
| 3 | 543 ms | 796 ms | 1,872 ms | 3,257 ms | 2,417 ms | 42.97 s | 48.771 s |
| Median | 543 ms | 813 ms | 1,999 ms | 3,500 ms | 2,627 ms | 43.11 s | 48.899 s |

All three runs followed prior Vitest use and are warm-cache observations. For
a cache contrast, `pnpm exec vitest run --clearCache` cleared Vitest results
and filesystem module caches. The following run passed 73/73 in 39.38 s Vitest
and 45.724 s wall; its immediate warm repeat passed 73/73 in 37.95 s Vitest
and 43.319 s wall. The 2.405 s wall difference is smaller than the 3.160 s
range in the three identical runs; clearing Vitest caches did not produce a
measurable penalty here. OS/package caches were warm, so this is not a cold
machine measurement.

Order/state checks:

- `pnpm exec vitest run tests/integration --sequence.shuffle
  --sequence.seed=20261116`: 5 files/73 tests passed; Vitest 41.07 s.
- Individual suites passed: crawler 8/8, inquiry 5/5, catalog 13/13,
  articles/content 30/30, shell/home/legal 17/17. Separate process startup
  dominated their durations; these are isolation evidence, not comparable
  performance measurements.
- No shared container, DOM reuse or module-reset changes were justified by
  stable evidence. No timing thresholds/sleeps or assertion changes added.

No full verification matrix or browser run was requested or performed.
