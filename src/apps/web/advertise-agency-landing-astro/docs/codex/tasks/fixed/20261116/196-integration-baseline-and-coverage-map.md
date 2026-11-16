# 196 - Baseline and functional contract map

- **Executor:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Tester:** Luna (`gpt-6-luna`), reasoning: `medium`.
- **Reviewer:** Luna (`gpt-6-luna`), reasoning: `medium`.

**Status:** complete

**Created:** 2026-11-16

**Parent:** [195](../../todo/195-automate-integration-test-improvements.md)

**Dependency:** [195](../../todo/195-automate-integration-test-improvements.md)

## Goal

Baseline and functional contract map for tests/integration/.

## Scope

- Inspect tests/integration/*.test.ts, tests/helpers/, tests/setup.ts,
  vitest.config.ts, package.json, all src/pages/ routes, src/layouts/, content
  publication and inquiry contracts.
- Compare colocated tests and archived tasks 184, 188-194; do not assume
  historical passes are current.
- Record every expanded integration case and its observable assertions.
- Create a functional matrix in this task: feature -> composition boundary ->
  existing integration test -> unit/E2E evidence -> gap -> owning child.
- Include homepage sections, menus/settings, action rail, cookies/themes,
  projects/search/pagination, services/articles, rich content/media,
  forms/captcha/delivery fallback, legal/404, metadata/robots/sitemap.
- Classify actual browser interactions as E2E responsibilities and reference
  existing specs; do not claim AstroContainer executes client scripts.
- Run pnpm test:integration and capture case count, versions, environment,
  per-file time and three comparable baseline runs.
- Preserve failures and assign their causes; do not label uncovered behavior as
  already covered.
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

- [x] Every site feature has an explicit layer and evidence or a named gap.
- [x] Every original assertion has a destination; baseline failures are recorded.
- [x] Baseline timings use identical command, environment and fixture data.

## Handoff

Inventory and baseline only; no source or test behavior changed. Actual role
routing for this stage: executor/tester/reviewer Luna (`gpt-6-luna`), medium;
no delegation or escalation. Historical task results below are context only.

### Functional matrix

| Feature / boundary | Existing integration evidence | Unit / E2E evidence | Gap / owner |
| --- | --- | --- | --- |
| Header, navigation, settings, action rail | `shell-home-legal.test.ts` checks full-document shared header/footer/settings/action-rail targets and unique IDs. | `tests/e2e/navigation/mobile-drawer.spec.ts`, `header-settings.spec.ts`, `contact-menu.spec.ts`, `callback-dialog.spec.ts`; `preferences.spec.ts` | Static composition is covered; scripts, focus and responsive interactions remain E2E. No required integration gap. |
| Homepage, offers, cookies and theme | `shell-home-legal.test.ts` checks editorial/optional section order, fragment targets, cookie/legal links, shared landmarks, no-JS notice and disabled inquiry. | Colocated section, cookie and settings suites; `tests/e2e/preferences/preferences.spec.ts`, `tests/e2e/no-javascript.spec.ts` | Persistence, theme switching, reveal and responsive behavior remain in component/E2E layers. No required integration gap. |
| Project catalog/search/pagination | `catalog.test.ts` checks route variants, counts/cards/controls, first/middle/last native links, query/hash preservation, empty and invalid/bounded page states. | `src/content/project-catalog.test.ts`, `src/scripts/project-catalog.test.ts`, catalog component tests; `tests/e2e/content/catalog.spec.ts`, `catalog-pagination.spec.ts`, `tests/e2e/no-javascript.spec.ts` | Typing, filtering, history and browser navigation remain E2E. No required integration gap. |
| Project/service articles and rich content | `articles-content.test.ts` checks publication, metadata/canonical, route generation, sitemap consistency, nested restricted content, links/media fallbacks and project/service form owner propagation. | Content publication/block colocated suites; `tests/e2e/content/content-media.spec.ts`, `content-table.spec.ts`, `media/gallery.spec.ts` | Media activation, playback and browser failure behavior remain E2E. No required integration gap. |
| Inquiry/forms/captcha/fallback | `inquiry.test.ts` (5 cases) checks disabled/enabled SSR state, field/consent/status/privacy wiring, project/service owner IDs, general fallback and disabled callback form. `articles-content.test.ts` covers page -> block -> specialized form propagation. | `src/content/order-form-registry.test.ts`, `src/content/article-context.test.ts`, `src/components/forms/order-inquiry.test.ts`, `src/components/forms/smart-captcha.test.ts`; E2E `tests/e2e/inquiry/inquiry-validation.spec.ts`, `inquiry-delivery.spec.ts`, `led-letters.spec.ts`, and callback navigation specs. | AstroContainer does not execute submission scripts. Validation, CAPTCHA mocks, errors/retries/input preservation stay E2E; no delivery API exists and no live request is made. No required integration gap. |
| Legal pages, metadata and 404 | `shell-home-legal.test.ts` checks privacy/terms normal and minimal states, links/dates/section order, metadata/canonical, 404 recovery, document semantics and fragment integrity. | `src/content/legal.test.ts`; E2E no-JS legal navigation and responsive route checks. | Interactive navigation remains E2E. No required integration gap. |
| Robots/sitemap | `crawler-routes.test.ts` checks robots no-site/configured origins; sitemap no-site, static paths and publication filtering, XML escaping/namespace/parser validity and absolute URL round-trip. `articles-content.test.ts` compares generated article routes, rendered metadata and sitemap inclusion under shared fixture scenarios. | `src/pages/_robots.txt.test.ts`, `_sitemap.xml.test.ts`, content publication tests. | Current endpoint/publication boundaries have integration evidence; no required gap. |
| Runtime publication/content boundaries | Integration uses the Vitest alias to versioned synthetic config, cloned fixtures and per-suite overrides. `tests/setup.ts` resets browser state/mocks; each suite owns its module reset and fixture cleanup. | Content schema/publication suites and fixture validation scripts. | Runtime content remains untouched; fixture isolation verified in tasks 197-203. |
| Runtime publication/content boundaries | Integration uses fixture data, explicit isolated overrides and real publication decisions at page/endpoint boundary. `vitest.config.ts` aliases `@/data/content/config` to versioned fixture config; `tests/setup.ts` resets browser state and mocks after each test. | Content schema/publication suites and fixture validation scripts. | Runtime data is not edited or treated as test fixture. Keep tests synthetic. |

### Expanded integration case inventory

At baseline, `page-compositions.test.ts` reported 51 expanded cases. The 9 initial cases
assert: header shell/mobile menu/navigation/settings; disabled inquiry/noscript;
service article structure/actions; homepage editorial order and optional section
absence; content block rendering/ownership/safe links/lists; empty article
stream; published order form owner and mismatch fallback; catalog component
pieces; cookie choices/legal links. Four shared route helpers then assert
document doctype/lang/landmarks/headings/cookie/no-JS-safe links, metadata and
canonical URL/OG URL contracts.

The expanded full-document cases are: 2 Layout cases (default/no-site URL;
noindex override/canonical), 2 LegalLayout cases (dated sections/lists;
minimal document/native back link), 4 legal-route cases (privacy/terms normal
and minimal), 2 homepage cases (offers shown/withheld), and 2 404 cases
(services shown/withheld). Catalog contributes 2 native-page-link cases (index
and numbered page), 2 empty-catalog cases (index and numbered page), and 5
query normalization cases (`0`, `-1`, invalid, decimal, over-limit). Projects
contribute 1 approved article and 3 publication/content edge cases (demo,
empty, nested demo). Route inventory and service static-path typing add 2
cases. Five service IDs each expand across approved, demo and empty/unapproved
states: 15 cases. Total: 51. These case groups correspond to the individual
`it`/`it.each` declarations in `tests/integration/page-compositions.test.ts`.
That source file was split by task 197. Final suite counts after tasks 198-201
are `shell-home-legal.test.ts` 17, `catalog.test.ts` 13,
`articles-content.test.ts` 30, `inquiry.test.ts` 5 and
`crawler-routes.test.ts` 8, for 73 cases total. Task 203 ran all 73 together,
each suite independently and a fixed-seed shuffled run; see child handoffs.

`crawler-routes.test.ts` reports 8 expanded cases: robots no-site deny (1),
configured sitemap URL forms (3), sitemap no-site empty (1), static-only
sitemap (1), publication filtering (1), and XML escaping/absolute URL
round-trip (1). Total suite baseline is 59 (51 + 8), not the source declaration
count. No baseline assertion was removed or edited in this stage; child 197
owns preservation/redistribution as suites are reorganized.

### Baseline runs

Environment: Windows (`win32-x64`), Node `v25.7.0`, pnpm `10.7.0`, Vitest
`4.0.18`; project root `D:\Projects\adms\src\apps\web\advertise-agency-landing-astro`.
Identical command, current fixture files and local machine for all runs:
`pnpm test:integration` (`vitest run tests/integration --passWithNoTests`).
Each run passed 2 files / 59 tests; no failures. Per-file Vitest test time:

| Run | crawler-routes | page-compositions | Vitest duration | PowerShell wall |
| --- | ---: | ---: | ---: | ---: |
| 1 | 500 ms | 3442 ms | 42.77 s | 50.897 s |
| 2 | 427 ms | 3182 ms | 45.25 s | 51.514 s |
| 3 | 447 ms | 3297 ms | 43.41 s | 49.869 s |

Durations vary with local transform/import and machine load. The command has
`--passWithNoTests`, so a future empty integration directory would pass; the
baseline confirms the present two suites execute. AstroContainer renders HTML
without running browser scripts or fetching media. No runtime/full verification
matrix, dependency changes, or real inquiry delivery was part of this task.

Historical context inspected: tasks 184 and 188-194. Task 184 added dedicated
collection/robots/sitemap coverage (8 tests at its completion); 188-194 record
an E2E refactor and browser baseline/contract split. Their old pass counts are
not treated as current results. Current E2E files cited in the matrix were
inspected as ownership evidence. Current unit references are colocated suites
listed in the matrix.

Files inspected include all current `tests/integration/*.test.ts`, helpers,
setup/config/package scripts, Astro pages/layouts, relevant content,
publication, component and form contracts, E2E specs, and historical task
records 184, 188-194. Only this task record was edited. `git status` showed
pre-existing user changes; they were preserved. No sound notification was
played because this worker did not make a user-action request; coordinator owns
the primary-agent notification protocol.
