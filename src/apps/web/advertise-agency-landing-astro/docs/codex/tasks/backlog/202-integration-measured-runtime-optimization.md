# 202 - Optimize integration setup using measurements

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

**Status:** backlog

**Created:** 2026-11-16

**Parent:** [195](../todo/195-automate-integration-test-improvements.md)

**Dependency:** [201](../fixed/20261116/201-integration-inquiry-and-fallback-contracts.md)

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

- [ ] Read AGENTS.md and rules index, workflow, style, testing, verification.
- [ ] Read parent, dependency evidence and affected source/callers.
- [ ] Move this file backlog -> todo; update status and all task links.
- [ ] Implement the scoped outcomes and record changed files.
- [ ] Run checks named in Scope; record commands and actual results.
- [ ] Review diff and resolve findings without weakening assertions.
- [ ] Reconcile acceptance and execution; record evidence and limitations.
- [ ] On accepted automatic execution archive to fixed/yyyyMMdd and update
  parent, sibling links and .codex/TASKS.md using Europe/Moscow date.

## Acceptance

- [ ] Before/after measurements are reproducible and contracts are preserved.
- [ ] Different ordering and individual suite runs show no state leakage.
- [ ] Any retained optimization has measured benefit and no reduced assertions.

## Handoff

Not started. Record files, checks/results, models and remaining risks here.
