# 197 - Split composition suites by domain

- **Executor:** Sol (`gpt-6.1-sol`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

**Status:** complete

**Created:** 2026-11-16

**Parent:** [195](../../todo/195-automate-integration-test-improvements.md)

**Dependency:** [196](196-integration-baseline-and-coverage-map.md)

## Goal

Split composition suites by domain for tests/integration/.

## Scope

- After 196, split tests/integration/page-compositions.test.ts into focused
  shell/home, catalog, articles/content and inquiry suites as its contract map
  requires.
- Keep crawler-routes.test.ts focused on endpoint composition.
- Update imports and the existing route inventory assertion so every Astro page
  remains accounted for.
- Keep mocks local to their consuming domains; extract helpers only for actual
  repeated contracts.
- Reuse tests/helpers/.
- Preserve reset/restore behavior, fixture aliases and module isolation.
- Remove --passWithNoTests from package.json test:integration so empty discovery
  fails.
- Check this guard without deleting maintained tests.
- Run pnpm test:integration and compare all cases/assertions with 196.
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

- [x] All baseline contracts survive with a documented old-to-new mapping.
- [x] Domain suites run independently and together without leaked overrides.
- [x] The integration command fails when its selected tests are absent.

## Handoff

Implemented by the scoped executor: Sol (`gpt-6.1-sol`), medium,
including focused checks and local diff review. Coordinator retains final
acceptance, planned Luna review and archive ownership. No escalation was needed.
The coordinator delegated this bounded child implementation; no nested agents.
The task was already in todo with active links when this worker started.

Changed files: replaced `tests/integration/page-compositions.test.ts` with
`shell-home-legal.test.ts`, `catalog.test.ts`,
`articles-content.test.ts` and `inquiry.test.ts` in the same directory;
extracted repeated full-document assertions into
`tests/helpers/page-contract.ts`; removed `--passWithNoTests` from
`package.json`. Crawler suite, runtime code/data, fixtures and dependencies
were untouched. Existing render/fixture helpers and fixture aliases remain.
Service/legal/offers overrides reset locally in shell; project overrides reset
locally in catalog; service overrides reset locally in articles; inquiry needs
no overrides. Existing shared afterEach restoration remains in tests/setup.ts.

### Baseline redistribution

All groups below originate in `page-compositions.test.ts` from 196.
Case titles, parameter inputs and assertions were preserved. An AST comparison
against the pre-split file verified the identical multiset of all 130 complete
`expect`/matcher chains (including repeated metadata/document assertions).
Only two pre-existing single-line conditionals gained explicit braces.

| Old case groups | Destination | Expanded cases |
| --- | --- | ---: |
| Header, homepage section order, cookie choices; Layout defaults/override; LegalLayout dated/minimal; privacy/terms normal/minimal; homepage offers on/off; 404 services on/off; complete Astro route inventory | shell-home-legal | 16 |
| Catalog component pieces; index/numbered native links; both empty routes; five query normalization inputs | catalog | 10 |
| Service component; rich blocks and empty stream; approved project and demo/empty/nested-demo projects; service static paths/typed props; five service IDs across approved/demo/empty states | articles-content | 23 |
| Disabled inquiry/no-JS; published order-form owner and mismatch fallback | inquiry | 2 |
| Existing eight endpoint cases, unchanged | crawler-routes | 8 |

The route inventory remains exhaustive for all eight Astro page files in the
shell suite. Total remains 51 page cases plus 8 crawler cases = 59.

### Verification

Environment: Windows, Node v25.7.0, pnpm10.7.0, Vitest4.0.18. Commands ran
from application root with process-local TEMP/TMP pointing to ignored
`output/197`. First pnpm invocation hit a bootstrap EPERM resolving the user
temp directory; rerunning with this local temp directory succeeded. No
maintained environment/config change was made.

- `pnpm exec vitest run tests/integration/inquiry.test.ts`: 2/2 pass.
- `pnpm exec vitest run tests/integration/catalog.test.ts`: 10/10 pass.
- `pnpm exec vitest run tests/integration/articles-content.test.ts`:
  23/23 pass.
- `pnpm exec vitest run tests/integration/shell-home-legal.test.ts`:
  16/16 pass.
- `pnpm test:integration`: five files, 59/59 pass, 69.70s.
- `pnpm test:integration --exclude "tests/integration/**"`: expected
  exit1, "No test files found"; no maintained test was removed. An initial
  unmatched positional filter still ran all59 because Vitest combines file
  filters; the exclusion command above is the actual guard evidence.
- Focused ESLint on the four new suites and shared helper: pass.
- Focused Prettier check on those files and package.json: pass.
- `pnpm format:check`: pass across the repository.
- `git -c safe.directory=D:/Projects/adms diff --check`: pass.
- `pnpm check:style`: pass, six changed source files.
- `pnpm check`: pass, 375 files, zero errors/warnings, one existing Zod
  deprecation hint in src/validation/content-blocks.ts.

Independent runs overlapped and the combined run overlapped static checks;
the durations are verification evidence, not comparable performance claims.
No full verification matrix, browser run or live inquiry delivery was run.
Ignored output/197 contains only one-off split/comparison evidence. Planned
coordinator Luna review and archival remain outside this worker's ownership.

Independent acceptance review: Luna (`gpt-6-luna`), medium. Reviewed the four
new integration suites, `tests/helpers/page-contract.ts`, `package.json`, and
the original suite retrieved from `HEAD` with
`git -c safe.directory=D:/Projects/adms show
HEAD:src/apps/web/advertise-agency-landing-astro/tests/integration/page-compositions.test.ts`.
Ran `node output/197/compare.cjs`; it confirmed all 130 complete
`expect`/matcher chains (including shared document/metadata/canonical checks)
match the saved original multiset. The explicit `it.each` expansion counts
match the handoff: 16 shell/legal + 10 catalog + 23 article/content + 2
inquiry + 8 unchanged crawler = 59. Each consuming suite owns and resets its
own module overrides; the inquiry suite has none, and shared mock/browser
cleanup remains in `tests/setup.ts`. The route inventory still enumerates all
eight Astro page files. Package script now selects `tests/integration`
without `--passWithNoTests`; Sol's recorded exclude-all check exits 1 with
"No test files found" without deleting tests. `git diff --check` passed for
the package and integration/helper files. Review found no assertion loss,
isolation leak, route-inventory gap, or other blocking finding. Reused Sol's
recorded independent/combined suite, style, lint, formatter and check evidence;
no checks were rerun during review.

