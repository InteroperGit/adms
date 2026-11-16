# 195 - Automatically improve site integration tests

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Coordinator:** Luna (`gpt-6-luna`), reasoning: `high`.

**Status:** complete

**Created:** 2026-11-16

## Goal

Execute tasks 196-203 sequentially to improve functional coverage,
maintainability and measured runtime of tests/integration/.

## Scope

- Actual directory: tests/integration/ (the request spelled intergration).
- Final suites: shell-home-legal, catalog, articles-content, inquiry and
  crawler-routes integration tests; the historical starting suites are
  recorded in task 196.
- Cover all site features through a functional contract matrix, preserving
  existing unit, component and E2E responsibilities.
- Reuse test infrastructure and synthetic fixtures.
- No runtime content edits, deployment, live delivery, new dependencies,
  or unrelated production/UI changes.
- Preparation creates this series only; execution begins on a separate
  instruction to start task 195.
- No application tests ran during preparation.

## Execution

Skills: grilling for scope analysis, ponytail for minimal implementation;
Astro/playwright only when the affected step requires them. Primary owns
sequencing, integration, acceptance and archival. No delegation by default.
Actual coordinator and all remaining execution/review roles use Luna
(`gpt-6-luna`), high, per user override. Preserve historic actual routing for
completed children. Record actual models/efforts and evidence for escalation.
Respect sound notifications.

- [x] Read project rules and inspect worktree; preserve unrelated changes.
- [x] Move 195 backlog -> todo and update .codex/TASKS.md.
- [x] Execute and accept [196](196-integration-baseline-and-coverage-map.md).
- [x] Execute and accept [197](197-integration-domain-suite-structure.md).
- [x] Execute and accept [198](198-integration-shell-home-and-legal.md).
- [x] Execute and accept [199](199-integration-project-catalog-contracts.md).
- [x] Execute and accept [200](200-integration-articles-content-and-crawlers.md).
- [x] Execute and accept [201](201-integration-inquiry-and-fallback-contracts.md).
- [x] Execute and accept [202](202-integration-measured-runtime-optimization.md).
- [x] Execute and accept [203](203-integration-final-acceptance-and-handoff.md).
- [x] Before each child, move it backlog -> todo and update references.
- [x] Repair failures and resolve both checklists before advancing.
- [x] Keep blocked work in todo with cause, evidence and next action;
  no child was blocked.
- [x] After accepted children, archive each to fixed/yyyyMMdd automatically;
  preserve filenames and update links/status using Europe/Moscow date.
- [x] Reconcile all child evidence and archive 195 last; update TASKS.md.

Full verification gates run only on explicit user request after
implementation. Child focused checks are required. Run no real submissions.
Changes to task records alone do not establish application verification.

## Acceptance

- [x] Tasks 196-203 satisfy execution and acceptance with passing evidence.
- [x] Every site feature has an explicit test layer and traceable evidence.
- [x] All baseline assertions survive; required integration gaps are closed.
- [x] Independent and combined suite runs preserve fixture/mock isolation.
- [x] Performance claims use comparable measurements; no weakened gates.
- [x] Final focused checks pass and full verification limits are stated.
- [x] Every link resolves and actual state agrees with .codex/TASKS.md.

## Handoff

Remaining execution, testing and review used Luna (`gpt-6-luna`), high, at the
user's routing override. Completed child commits: 196 `f91e0765`, 197
`953daf90`, 198 `58bc1125`, 199 `96804b30`, 200 `80149093`, 201 `14ed0528`,
202 `3fb4ee76`, 203 `6bb887f6`. Primary owns the separate parent commit.

Tasks 196-203 establish and reconcile 73 integration cases in five files,
retaining the 59-case assertion baseline. Inquiry and publication boundaries
use synthetic fixture/config overrides; delivery stays disabled. No runtime
content, live submissions, dependencies or production behavior changed.
Task 202 found no stable setup optimization; three comparable 73-case runs had
median wall time 48.899s, with a fixed-seed shuffled run and individual suites
passing. Task 203's final `pnpm test:integration` passed 73/73 in 65.23s after
a formatting-only correction to the catalog suite.

Final scoped gates passed: changed-file Prettier, lint, boundaries, content,
Astro check and style. Astro check reported 0 errors, 0 warnings and one
existing Zod deprecation hint. The full verification matrix, browser suite,
build, coverage and manual visual checks were not requested or run. Detailed
feature matrix and child evidence are in tasks 196-203.
