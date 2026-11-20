# Codex Task Handoff

Updated: 2026-11-20

`.codex/TASKS.md` is a compact handoff, not a historical task journal. Detailed
scope and verification belong to the linked task files.

## Active tasks

Task [232 - Group components by feature](../docs/codex/tasks/todo/232-group-components-by-feature.md)
is in `todo`. See its handoff for implementation and verification results.

Task 174 is implemented; verification follow-up is pending the user's explicit
request to run the full checks.
UI task 171 is archived; delivery is deferred to task 173.
Task [213](../docs/codex/tasks/todo/213-mobile-bottom-navigation.md) is
implemented and browser-checked; `pnpm check` fails in `@emnapi`, and colocated
component tests remain outstanding.

## Recent completed work

- Tasks [212](../docs/codex/tasks/fixed/20261120/212-responsive-agency-footer.md),
  [229](../docs/codex/tasks/fixed/20261120/229-extract-reusable-section-components.md)
  and [235](../docs/codex/tasks/fixed/20261120/235-move-article-renderers-to-features.md)
  are accepted and archived; verification results are in their handoffs.
- [234 - Remove validation and bundle warnings](../docs/codex/tasks/fixed/20261119/234-remove-build-warnings.md): focused tests, Astro checks, build and Chromium chart/no-JavaScript checks passed.
- [214][task214], [230][task230] and [231][task231]:
  implemented and accepted; focused checks are recorded in their handoffs. Full
  verification was not requested.

[task214]:
  ../docs/codex/tasks/fixed/20261119/214-offers-carousel-neighbor-previews.md
[task230]:
  ../docs/codex/tasks/fixed/20261119/230-create-cylinder-carousel.md
[task231]:
  ../docs/codex/tasks/fixed/20261119/231-simplify-mobile-header-contacts.md

- [233 - Shared media and catalog card](../docs/codex/tasks/fixed/20261119/233-extract-shared-media-and-catalog-card.md):
  complete; 75 focused unit/integration tests and 26 Chromium scenarios passed;
  Astro, types, boundaries, test placement and build passed.

- [228 - Home section refactor](../docs/codex/tasks/fixed/20261119/228-home-section-refactor-master.md):
  complete; children 216–227 accepted in separate commits. Focused component,
  integration, Astro, boundary and Chromium checks passed. Full verification was
  not requested.

- [215 - Reorganize components by responsibility](../docs/codex/tasks/fixed/20261120/215-reorganize-components-by-responsibility.md):
  implemented; 369 focused unit/integration tests passed, Astro and architecture
  checks passed. Targeted E2E passed after fixing WebKit theme event handling;
  Preferences rerun passed 24/24 across three browsers. Complete and archived.

- [171 - Header navigation and contact menu](../docs/codex/tasks/fixed/20261115/171-header-navigation-and-contact-menu.md):
  UI complete; menus, keyboard navigation and callback modal verified; global
  verification limitations recorded; delivery deferred to task 173.
- [160 - Optimize scripts](../docs/codex/tasks/fixed/20261114/160-optimize-maintained-scripts.md):
  implemented; 19 maintained scripts; formatting/E2E limitations recorded.

- [159 ? Compact development rules](../docs/codex/tasks/fixed/20261113/159-compact-and-restructure-project-rules.md):
  implemented; known E2E/format failures recorded.

- [158 — Section headings](../docs/codex/tasks/fixed/20261105/158-unify-section-headings-and-subtitles.md):
  complete.
- [155 — Services section](../docs/codex/tasks/fixed/20261105/155-improve-services-section-visual-ux-and-code.md):
  complete.

## Task index

- [236 — Общий каталог и пагинация][task236] завершена и перенесена в `fixed`;
  полный verification прошёл.
- [195 - Integration test automation](../docs/codex/tasks/fixed/20261116/195-automate-integration-test-improvements.md):
  complete; children 196-203 accepted and committed separately. Integration:
  73/73 passed; focused static gates passed. Timing and full-verification
  limits are recorded in parent 195. Remaining roles used Luna High.

- [188 - E2E refactor automation](../docs/codex/tasks/fixed/20261116/188-automate-e2e-refactor.md):
  complete; all E2E refactor tasks 189-194 passed acceptance. Final run:
  309/309 across Chromium, Firefox and WebKit; baseline contracts preserved.

- [172 - Action rail and persistent chat](../docs/codex/tasks/fixed/20261116/172-action-rail-visibility-and-chat.md):
  archived; see task handoff for acceptance and limitations.
- [173](../docs/codex/tasks/backlog/173-enable-callback-delivery.md): backlog;
  awaiting owner decisions; keep delivery disabled.
- [174 - Link component and anchor migration](../docs/codex/tasks/fixed/20261116/174-create-link-component-and-migrate-anchors.md):
  archived; E2E follow-up records one WebKit video fallback failure.
- Test backlog 175-186 covers missing colocated Astro component suites,
  gallery runtime behavior, content exports, async aggregates, route handlers
  and shared type contracts. Start with 175-179 for component/runtime work,
  then 180-186 for TypeScript, content boundaries and smoke-test refactors.
- [187 - Orchestrate test backlog 175-186](../docs/codex/tasks/fixed/20261116/187-automate-test-backlog-175-186.md):
  complete; tasks 175-186 and all final verification gates passed.
- [204 - Content migration automation](../docs/codex/tasks/fixed/20261117/204-automate-content-migration-161-170.md):
  complete; tasks 161-170 have separate commits. Full Vitest: 881/881;
  build: 39 pages; Chromium E2E: 22/22. Full verification was not requested.
- [205 - Content refactor](../docs/codex/tasks/fixed/20261117/205-content-refactor-master.md):
  complete; tasks 206-211 accepted in separate local commits. Focused checks,
  15-route build quality and Chromium E2E 48/48 passed; full verification was
  not requested.
- [206 - Content audit and baseline](../docs/codex/tasks/fixed/20261117/206-content-audit-baseline.md):
  accepted; synthetic build and article timing evidence recorded.
- Content migration: task 169 moved pages and normalized JSON filenames to
  camelCase with 30 SHA-256 matches; focused tests, isolated provisioning,
  E2E, check and build passed.
  Skip external asset reachability checks per the user's regional-access note.
  [Migration plan](../docs/codex/tasks/plan/20261114_site-content-structure-migration-plan.md)
- Plans and UI decisions:
  [component review](../docs/codex/tasks/plan/20261022-ui-components-review.md)
- Active tasks: `docs/codex/tasks/todo/`
- Deferred tasks: `docs/codex/tasks/backlog/`
- Completed tasks: `docs/codex/tasks/fixed/yyyyMMdd/`
- Project rules: `AGENTS.md` and `docs/codex/rules/workflow.md`

## Test backlog

- 175: `docs/codex/tasks/fixed/20261116/175-card-component-tests.md`
- 176: `docs/codex/tasks/fixed/20261116/176-carousel-indicator-component-tests.md`
- 177: `docs/codex/tasks/fixed/20261116/177-header-small-component-tests.md`
- 178: `docs/codex/tasks/fixed/20261116/178-gallery-renderer-component-tests.md`
- 179: `docs/codex/tasks/fixed/20261116/179-image-gallery-runtime-tests.md`
- 180: `docs/codex/tasks/fixed/20261116/180-simple-content-export-tests.md`
- 181: `docs/codex/tasks/fixed/20261116/181-content-copy-export-tests-a.md`
- 182: `docs/codex/tasks/fixed/20261116/182-content-copy-export-tests-b.md`
- 183: `docs/codex/tasks/fixed/20261116/183-async-content-aggregate-tests.md`
- 184: `docs/codex/tasks/fixed/20261116/184-content-collection-and-route-tests.md`
- 185: `docs/codex/tasks/fixed/20261116/185-shared-type-contract-tests.md`
- 186: `docs/codex/tasks/fixed/20261116/186-logo-component-test-refactor.md`
- 187: `docs/codex/tasks/fixed/20261116/187-automate-test-backlog-175-186.md`

[task236]: ../docs/codex/tasks/fixed/20261120/236-extract-shared-catalog.md
