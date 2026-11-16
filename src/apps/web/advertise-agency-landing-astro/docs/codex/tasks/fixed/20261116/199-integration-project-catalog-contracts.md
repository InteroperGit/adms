# 199 - Complete project catalog and route composition

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

**Status:** complete

**Created:** 2026-11-16

**Parent:** [195](195-automate-integration-test-improvements.md)

**Dependency:** [198](198-integration-shell-home-and-legal.md)

## Goal

Complete project catalog and route composition for tests/integration/.

## Scope

- Own catalog integration suites and synthetic catalog fixtures.
- Inspect src/pages/projects/, project-publication and project-catalog with real
  controls/count/grid/empty/pagination components.
- Test route generation, category visibility, result/count consistency,
  first/middle/last page links, empty data, invalid/boundary page inputs
  supported by production, and published/demo/draft article visibility.
- Verify selected filter/search state is passed to the right composition
  boundary where SSR supports it.
- Keep client interaction/history assertions in existing E2E; identify their
  exact specs in the matrix.
- Check metadata and route links agree with the visible catalog and publication
  policy, without duplicating pure tests.
- Run affected files and pnpm test:integration.
- Runtime content stays in data/content/; synthetic fixtures belong in
  tests/fixtures/content/.
- Production behavior changes require a separate explicit scope decision.
- Preserve unrelated work and existing test gates.

## Execution

Skills: ponytail; Astro skill if changing .astro; playwright only for browser
diagnosis. Primary owns review and acceptance. No delegation by default.
Luna medium for inventory, scoped test edits, focused checks and docs;
Sol medium for conflicting cross-module contracts. Record actual routing
and concrete evidence for escalation in Handoff.

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

- [x] Catalog route, visible entries, count and pagination stay consistent.
- [x] Empty and boundary fixtures produce usable output without invalid links.
- [x] Publication decisions and existing client/E2E responsibilities are mapped.

## Handoff

Executor/tester/reviewer: Luna (`gpt-6-luna`), medium for all roles. Task 199
was already in `todo` with active links when this bounded implementation began.
No delegation or escalation was needed. The `ponytail` skill was reused from
the preceding scoped task.

Changed files: `tests/integration/catalog.test.ts` and this handoff. No source,
runtime content, fixture, package or dependency changes were made. The original
10 expanded catalog cases remain; adding the third (last) page route expands
native-link and empty-route tables by one each, and one publication/route
consistency case was added. Total catalog cases: 13.

Route coverage now includes first, middle and last page native links, direction
boundaries, preserved query/category/hash and numbered-path precedence over a
conflicting query. A synthetic mixed set of published, demo, nested-demo and
draft records verifies that visible project IDs and props match static detail
routes; page route IDs match the configured page size; and category options,
result count, cards and detail hrefs agree. Draft exclusion is applied through
the existing visible-project publication helper; colocated unit coverage owns
the pure policy. Existing empty catalogs, invalid query normalization and
search-empty/control composition assertions are preserved.

The controls render hidden with no preselected query/category state in SSR;
the query/category filtering, URL history, reload and JavaScript enhancement
remain browser responsibilities in `tests/e2e/content/catalog.spec.ts`,
`tests/e2e/content/catalog-pagination.spec.ts` and
`tests/e2e/no-javascript.spec.ts`. No interaction behavior was asserted through
AstroContainer.

Verification ran from the application root on Windows with Node `v25.7.0`,
pnpm `10.7.0`, Vitest `4.0.18`. Process-local `TEMP`/`TMP` pointed to ignored
`output/task195` to avoid pnpm's user-temp EPERM; no maintained environment
configuration changed.

- `pnpm exec vitest run tests/integration/catalog.test.ts`: final 13/13 pass,
  45.88 s Vitest duration.
- `pnpm test:integration`: final 5 files, 63/63 pass, 46.27 s Vitest duration.
- `pnpm exec eslint tests/integration/catalog.test.ts --max-warnings 0`:
  passed.
- `pnpm exec prettier --check tests/integration/catalog.test.ts`: passed.
- `pnpm check:style`: passed for changed source files.
- `pnpm check` was not rerun; coordinator directed reuse of the current 375-
  file Astro check until task 203 because this task changes no Astro/runtime
  source.

Luna self-review found no assertion or scope issue. The only initial gate
failures were a Prettier difference and one import line over 80 columns; both
were corrected before final focused and combined runs. No browser or full
verification matrix was run. Coordinator owns archival and linked task/index
updates.
