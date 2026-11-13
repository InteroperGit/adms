# 160 - Optimize maintained scripts

Status: implemented on 2026-11-14. Full-gate limitations are recorded below.

## Outcome

Reduced `scripts/` from 49 to 19 maintained files: 17 entrypoints/configs and
two helpers. Removed 30 obsolete files and four orphaned acceptance JSON
fixtures. Preserved useful regression assertions in maintained tests. No runtime
content, archived tasks, dependencies or production rendering behavior was
changed.

[Workflow](../../../rules/workflow.md) now requires one-off scripts in ignored
`output/<task>/`, without force-adding them. Permanent tooling cannot load
source code from output; generated data/build artifacts remain legitimate
inputs. Existing `.gitignore` already covers output. No new framework was
introduced.

## Retained inventory

Paths are relative to `scripts/`. Package commands document regular invocations.

| File                              | Consumer, inputs and effects                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `check-code-style.mjs`            | check/check:style; changed Git sources; read-only                                                            |
| `check-component-tests.mjs`       | verify:component-tests; component/test paths; read-only                                                      |
| `clean-temp.mjs`                  | clean:temp variants; generated directories; preview by default, explicit apply deletes                       |
| `clean-temp.test.mjs`             | test:clean-temp; creates/removes isolated scratch directories and symlinks                                   |
| `generate-content-catalog.mjs`    | generate:content with --source/--output; validates packages, atomically writes requested output              |
| `test-content-catalog.mjs`        | test:content-catalog; synthetic packages and isolated scratch outputs                                        |
| `test-content-block-fixtures.mjs` | test:content-blocks; versioned JSON/MDX, actual restricted compiler; in-memory compilation                   |
| `test-publication-policy.mjs`     | test:publication-policy; synthetic owner/block fixtures; in-memory compilation                               |
| `verify-content-boundaries.mjs`   | verify:boundaries/CI; Git paths, templates and manifest; read-only                                           |
| `verify-content-invariants.mjs`   | verify:content/CI; runtime JSON; read-only                                                                   |
| `verify-coverage-thresholds.mjs`  | verify:coverage/CI; generated coverage JSON; read-only                                                       |
| `verify-built-quality.mjs`        | verify:quality/CI; built HTML, assets, sitemap and optional origin; read-only                                |
| `verify-release-metadata.mjs`     | verify:release; dist and required PUBLIC_SITE_URL; read-only release gate                                    |
| `verify-external-assets.mjs`      | verify:external; runtime asset URLs; remote availability/type requests                                       |
| `prepare-ci-content.mjs`          | CI=true only; versioned fixtures; provisions runtime config on CI checkout                                   |
| `e2e-server.mjs`                  | Playwright webServer; versioned site/override fixtures; writes ignored synthetic content/build, owns preview |
| `e2e.config.mjs`                  | E2E build/preview; normal Astro config plus synthetic content alias/output                                   |
| `lib/import-typescript.mjs`       | retained content regressions; loads actual TS contracts in memory                                            |
| `lib/compile-mdx.mjs`             | retained content regressions; uses the actual restricted production compiler                                 |

## Removed inventory and decisions

- Completed migrations/report without current consumers:
  `migrate-content-headings.mjs`, `migrate-project-articles.mjs`,
  `measure-article-assets.mjs`. Never ran migrations during cleanup.
- Broken migration regressions: `test-service-articles.mjs`,
  `test-project-articles.mjs`; both failed ENOENT for absent
  services-before-blocks/projects-before-blocks snapshots. Removed their package
  commands and orphan `lib/legacy-project-content.ts`. Did not reconstruct
  historical or production-derived data. Updated verification command guidance.
- Superseded standalone tests: `test-inquiry-payload.mjs`,
  `test-paragraph-links.mjs`, `test-service-publication.mjs`.
- Historical/manual callbacks: `verify-article-browser.js`,
  `verify-block-browser.js`, `verify-browser-coverage.js`, `verify-faq.mjs`,
  `verify-list-browser.js`, `verify-paragraph-browser.js`,
  `verify-table-browser.js`, `verify-visual-blocks.js`,
  `verify-task-073-fixture.mjs`, `verify-task-082-browser.js`,
  `verify-task-082-content.js`, `verify-task-082-forms.js`,
  `verify-task-082-gallery.js`.
- Their private infrastructure: `table-acceptance.config.mjs`,
  `serve-content-acceptance.mjs`, `lib/article-acceptance-integration.mjs`,
  `lib/acceptance-blocks.ts`, `fixtures/AcceptanceBlocks.astro`,
  `fixtures/article-acceptance.astro`, `fixtures/table-blocks.astro`,
  `fixtures/visual-blocks.astro`. Removed the normal Astro config's
  CONTENT_ACCEPTANCE switch/task-080 output and obsolete ESLint exceptions.
- Now-unreferenced data under `tests/fixtures/content/`: `article-cases.json`,
  `paragraph-visual.json`, `table-visual.json`, `visual-blocks.json`.

Decisions used package/CI/config/import consumers and actual execution, not just
absence from package scripts. Historical task mentions remain untouched.

## Coverage preservation

- Inquiry email-label boundaries and empty project allowlist behavior moved to
  `src/server/inquiry-payload.test.ts`; paragraph JSON fixtures/text
  preservation to `src/content/paragraph-links.test.ts`; card/article
  independence to `src/content/service-publication.test.ts`.
- FAQ validation negatives moved to `src/validation/faq.test.ts`. Existing tests
  already cover approval/publication gates; historical copy/count checks
  retired.
- Missing useful compiler rejection cases moved to maintained content-block
  fixtures; legacy-field strictness and blank fallback reasons to existing
  project/service article schema tests. Existing suites cover ownership, form
  categories, publication gates and JSON/MDX source contracts.
- Table data/label parity, one accessible responsive representation, print,
  no-JS, row focus and native keyboard scroll now run in `content-table.spec.ts`
  using a synthetic wide table in e2e-overrides.json.
- Gallery touch/reduced-motion, body scroll lock and backdrop focus return,
  persisted pagehide chart survival and 200% text reflow in both themes now run
  in maintained gallery/content-media/responsive specs.
- Existing renderer, content, navigation, preferences, carousel, inquiry,
  catalog and no-JS suites cover the remaining current behavior. Retired copied
  application algorithms, obsolete private-page assertions and decorative
  measurements instead of preserving duplicate implementations.

## Verification and limits

- PASS: lint, boundaries, content invariants, Astro/style, type contracts,
  component-test placement and changed-file formatting/diff checks.
- PASS: initial full Vitest 101 files/776 tests; final full coverage run after
  followup edits 101 files/778 tests. Focused schema followup: 26 tests.
- PASS: coverage gate; lines logic 99.80%, client state 91.96%, components
  90.26%, overall 95.07%.
- PASS: build and generated quality checks for 39 routes. No private acceptance
  routes in normal output. Maintained Node syntax and deleted-file references
  checked across scripts, source, tests, package/configs and CI.
- PASS: content-catalog, content-blocks (including new rejections), publication
  policy and all five clean-temp tests. Generator CLI produced 21 files from
  versioned templates into output/task-160/catalog; cleanup preview deleted
  none.
- Full E2E Chromium/Firefox/WebKit: 292 passed, five failed. All new browser
  scenarios/assertions passed. Failures were existing scenarios: Firefox
  delivery timeout, corrected lettering inquiry and responsive page setup;
  WebKit carousel timeout and video 404 fallback.
- Focused diagnostic of those scenarios in Firefox/WebKit with one worker and
  unchanged assertions/timeouts: nine passed, one failed. Only WebKit video 404
  fallback reproduced; the same failure was recorded before this task in 159.
  This does not turn the failing full matrix into a passing gate.
- Global format:check still fails on unchanged data/templates/README.md and
  src/components/sections/Introduction.astro, as recorded before this task.
- CI provisioning was not run locally because it writes runtime config. Live
  external availability and configured release-origin checks were not exercised;
  consumers, source inputs and syntax were inspected. No deployment was
  performed.

Raw logs/evidence are ignored under output/task-160 and output/playwright. No
tests, thresholds, accessibility checks or publication rules were weakened.

## Skills, models and checklist

`ponytail` guided minimal changes; `grilling` established the original task
scope. Luna medium performed the initial read-only audit. Primary Codex owned
scope, shared configs, integration and gates. Two Sol medium workers handled
independent cross-contract migrations: standalone Node checks and historical
browser checks. The missing-snapshot execution failure triggered a bounded
followup with the same Sol worker; its evidence and decision are above. No Astra
or duplicate review.

- [x] Read applicable rules/skills; inspect consumers and script side effects.
- [x] Record keep/remove decisions for every original script file.
- [x] Preserve useful assertions before deleting obsolete tools and fixtures.
- [x] Update commands/configs/docs; keep one-off code/evidence in ignored
      output.
- [x] Exercise safe retained entrypoints; document conditional-tool limits.
- [x] Run required gates and diagnostics; record failures without hiding them.
- [x] Review final diff/links, archive by Europe/Moscow date, update handoff.
