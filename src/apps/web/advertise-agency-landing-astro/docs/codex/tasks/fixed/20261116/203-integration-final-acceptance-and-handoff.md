# 203 - Reconcile coverage and accept integration improvements

- **Executor:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `high`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `high`.

**Status:** complete

**Created:** 2026-11-16

**Parent:** [195](../../todo/195-automate-integration-test-improvements.md)

**Dependency:** [202](../fixed/20261116/202-integration-measured-runtime-optimization.md)

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

- [x] All integration suites pass and all original contracts remain traceable.
- [x] The functional matrix has no unexplained or unowned integration gaps.
- [x] Focused gates pass; timing results and unrun full gates are reported.
- [x] Every child is accepted before parent archival; links resolve after moves.

## Handoff

Actual reconciliation, verification and review: Luna (`gpt-6-luna`), high,
per user override. No source behavior changed, no delegation or escalation.

Updated `docs/codex/tasks/fixed/20261116/196-integration-baseline-and-coverage-map.md`
to replace stale pre-split suite references, mark child-owned integration gaps
complete, cite exact browser ownership and record final case counts. Earlier
baseline inventory and measurements remain identified as historical evidence.
`tests/integration/catalog.test.ts` received only a Prettier formatting change
after the required changed-file check found a mismatch in the earlier task
output. No behavior, assertion, application source, package, runtime content,
versioned fixture or dependency changed.

Final suite inventory: `shell-home-legal.test.ts` 17,
`catalog.test.ts` 13, `articles-content.test.ts` 30, `inquiry.test.ts` 5,
`crawler-routes.test.ts` 8. The original 59 baseline cases are preserved
according to task 197's assertion comparison and child handoffs; final count is
73 after scoped additions. Browser-only focus, storage, navigation, search,
media failure, CAPTCHA and delivery behavior point to the exact E2E specs in
the reconciled 196 matrix. Delivery remains disabled; no server endpoint exists
and no external request was made.

Required checks on Windows, Node 25.7.0, pnpm 10.7.0, Vitest 4.0.18; process
`TEMP`/`TMP` pointed to ignored `output/task195`:

- `pnpm test:integration`: five files, 73/73 passed after the formatting
  correction, 65.23s.
- `pnpm exec prettier package.json tests/helpers/page-contract.ts
  tests/integration/shell-home-legal.test.ts tests/integration/catalog.test.ts
  tests/integration/articles-content.test.ts
  tests/integration/inquiry.test.ts --check`: passed.
- `pnpm lint`: passed after the formatting correction.
- `pnpm check:style`: passed after the formatting correction.
- `pnpm verify:boundaries`: passed.
- `pnpm verify:content`: passed (20 files).
- `pnpm check`: passed, 375 files, zero errors/warnings, one existing Zod
  deprecation hint at `src/validation/content-blocks.ts:129`.
- Performance baselines, cache-cleared/warm comparison, fixed-seed shuffle
  and individual suite results are in task 202.

No full verification matrix, browser run, build, coverage or manual visual
checks were requested or run. No changed helper/source requires a colocated
suite rerun beyond the final combined integration run.
