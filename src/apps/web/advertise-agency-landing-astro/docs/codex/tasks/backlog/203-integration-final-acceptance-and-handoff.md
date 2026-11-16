# 203 - Reconcile coverage and accept integration improvements

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

**Status:** backlog

**Created:** 2026-11-16

**Parent:** [195](../todo/195-automate-integration-test-improvements.md)

**Dependency:** [202](202-integration-measured-runtime-optimization.md)

## Goal

Reconcile coverage and accept integration improvements for tests/integration/.

## Scope

- Reconcile the matrix from 196 with final files and all original assertions.
- Account for every discovered feature and gap using integration evidence or an
  explicit unit/E2E boundary with exact file references.
- An unresolved required integration gap blocks acceptance; do not silently
  defer it.
- Run pnpm test:integration, pnpm exec prettier <changed-files> --check, pnpm
  lint, pnpm verify:boundaries, pnpm verify:content and pnpm check.
- Run affected colocated suites when shared helpers or source changed.
- Review complete diff, fixture isolation, route inventory, imports, mock reset
  order, absent-test guard and comparable performance evidence.
- Do not run the full verification.md matrix unless explicitly requested by the
  user after implementation.
- Record unrun gates as evidence limits.
- Update task handoffs, parent references and .codex/TASKS.md; reconcile every
  execution/acceptance checkbox before automatic archival.
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

- [ ] All integration suites pass and all original contracts remain traceable.
- [ ] The functional matrix has no unexplained or unowned integration gaps.
- [ ] Focused gates pass; timing results and unrun full gates are reported.
- [ ] Every child is accepted before parent archival; links resolve after moves.

## Handoff

Not started. Record files, checks/results, models and remaining risks here.
