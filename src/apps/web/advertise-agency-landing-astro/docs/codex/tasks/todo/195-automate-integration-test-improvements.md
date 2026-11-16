# 195 - Automatically improve site integration tests

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Coordinator:** Luna (`gpt-6-luna`), reasoning: `high`.

**Status:** in progress

**Created:** 2026-11-16

## Goal

Execute tasks 196-203 sequentially to improve functional coverage,
maintainability and measured runtime of tests/integration/.

## Scope

- Actual directory: tests/integration/ (the request spelled intergration).
- Current suites: page-compositions.test.ts and crawler-routes.test.ts.
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
- [x] Execute and accept [196](../fixed/20261116/196-integration-baseline-and-coverage-map.md).
- [x] Execute and accept [197](../fixed/20261116/197-integration-domain-suite-structure.md).
- [x] Execute and accept [198](../fixed/20261116/198-integration-shell-home-and-legal.md).
- [x] Execute and accept [199](../fixed/20261116/199-integration-project-catalog-contracts.md).
- [x] Execute and accept [200](../fixed/20261116/200-integration-articles-content-and-crawlers.md).
- [x] Execute and accept [201](../fixed/20261116/201-integration-inquiry-and-fallback-contracts.md).
- [ ] Execute and accept [202](../backlog/202-integration-measured-runtime-optimization.md).
- [ ] Execute and accept [203](../backlog/203-integration-final-acceptance-and-handoff.md).
- [ ] Before each child, move it backlog -> todo and update references.
- [ ] Repair failures and resolve both checklists before advancing.
- [ ] Keep blocked work in todo with cause, evidence and next action;
  stop dependent execution and avoid endless retries or false acceptance.
- [ ] After accepted children, archive each to fixed/yyyyMMdd automatically;
  preserve filenames and update links/status using Europe/Moscow date.
- [ ] Reconcile all child evidence and archive 195 last; update TASKS.md.

Full verification gates run only on explicit user request after
implementation. Child focused checks are required. Run no real submissions.
Changes to task records alone do not establish application verification.

## Acceptance

- [ ] Tasks 196-203 satisfy execution and acceptance with passing evidence.
- [ ] Every site feature has an explicit test layer and traceable evidence.
- [ ] All baseline assertions survive; required integration gaps are closed.
- [ ] Independent and combined suite runs preserve fixture/mock isolation.
- [ ] Performance claims use comparable measurements; no weakened gates.
- [ ] Final focused checks pass and full verification limits are stated.
- [ ] Every link resolves and actual state agrees with .codex/TASKS.md.

## Handoff

Latest user instruction supersedes the original no-commit exclusion: make a
separate local commit for every accepted task before starting the next.
Primary owns commits and preserves unrelated dirty files. Completed commits:
196 `f91e0765`, 197 `953daf90`, 198 `58bc1125`.

Prepared from repository source on 2026-11-16. Remaining execution uses Luna
(`gpt-6-luna`), high, at the user's routing override.
Known infrastructure: Vitest with AstroContainer, synthetic content alias,
shared render/fixture helpers; test:integration currently tolerates no tests.
Historical tasks 184 and 188-194 are references, not current test evidence.
