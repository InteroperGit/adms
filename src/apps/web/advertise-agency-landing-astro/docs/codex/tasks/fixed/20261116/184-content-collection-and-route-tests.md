# 184 - Test content collection and route handlers

**Status:** fixed

**Priority:** normal

**Created:** 2026-11-15

**Scope:** `src/content.config.ts`, `src/pages/robots.txt.ts`,
`src/pages/sitemap.xml.ts`

## Goal

Cover the application-level TypeScript modules that define content collection
boundaries and generated crawler routes.

## Scope

- Add `src/content.config.test.ts` and underscore-prefixed route suites:
  `src/pages/_robots.txt.test.ts` and `src/pages/_sitemap.xml.test.ts`.
- Verify collection names/loaders, E2E fixture root selection and metadata
  schemas without depending on generated declarations.
- Verify robots behavior with and without a configured site, XML content type,
  URL escaping, base-origin resolution, published route inclusion and empty
  site output.
- Mock imported content/publication modules at the route boundary; do not
  change route implementation or runtime content.

## Execution

- Skills: `ponytail`.
- Primary executor: Luna, medium; route behavior is pure and bounded.
- Delegation: none.

### Checklist

Update these checkboxes during execution using the
[task checklist rules](../../rules/workflow.md#task-checklists).

- [x] Read content config, route handlers, publication helpers and existing
  route
  integration coverage.
- [x] Add node or jsdom-independent tests for response bodies, headers and XML
  escaping, plus collection registration assertions.
- [x] Run the three focused suites, `pnpm test:types` and `pnpm check`.
- [x] Confirm tests never assert production-specific URL counts.
- [x] Record changed files, verification commands/results and resolved review
  findings in this task's handoff; reconcile all checkboxes before completion.

## Acceptance

- [x] Collection names, loaders, metadata schemas and E2E fixture roots are
  asserted.
- [x] Robots responses cover configured-site and no-site cases.
- [x] Sitemap responses cover XML content type, URL escaping and base-origin
  resolution.
- [x] Published route inclusion and empty-site output use isolated route mocks.
- [x] Focused suites, pnpm test:types and pnpm check pass.
- [x] All three modules have matching colocated suites.
- [x] Crawler output is tested for secure no-site defaults, configured origins,
  escaping and publication filtering.
- [x] Collection registration and fixture-root behavior are covered without
  weakening Astro diagnostics.

## Dependencies

Task 183 owns the deeper `projects` and `services` aggregate contracts used by
the sitemap. Existing route integration tests remain complementary.

## Handoff

- Added `src/content.config.test.ts`, `src/pages/_robots.txt.test.ts` and
  `src/pages/_sitemap.xml.test.ts`; no route, collection, schema or runtime
  content code changed.
- Focused suites passed: 3 files, 8 tests.
- `pnpm test:types` passed.
- `pnpm check` passed across 366 files with zero errors and zero warnings;
  one existing Zod deprecation hint remains. The style gate passed for all
  three changed test files.
- Collection tests mock `astro:content` and `astro/loaders`, assert metadata
  schema registration and loader roots for normal/E2E content roots. Robots
  covers configured and missing site origins. Sitemap uses isolated published
  path mocks and covers no-site output, origin resolution, XML escaping, and
  published route inclusion without production URL counts.
- Initial check failures were test-only: schema instance identity after module
  resets, Astro's collection config union typing, and two long lines. Resolved
  with runtime schema registration assertions, `Reflect.get` test access,
  schema behavior checks and structural XML namespace assertions; final focused
  and static checks passed.
- Independent test stage: `pnpm exec vitest run src/content.config.test.ts
  src/pages/robots.txt.test.ts src/pages/sitemap.xml.test.ts` passed (3 files,
  8 tests); `pnpm test:types` passed; `pnpm check` passed across 366 files
  with zero errors/warnings and the existing Zod deprecation hint. Confirmed
  configured/no-site robots behavior, XML headers/escaping/origin and
  publication filtering, empty sitemap, and normal/E2E collection roots.
  No production-specific URL counts are asserted.
- Review: Luna high worker `/root/task184_review` reported no findings;
  changed-file style passed.
- Worker IDs (Luna high): `/root/task184_impl`, `/root/task184_test`,
  `/root/task184_review`.
- Commit worker: `/root/task184_commit` (Luna high).
- Final verification found Astro attempted to prerender the original
  route test files as generated pages, importing Vitest outside a test suite.
  Astro ignores underscore-prefixed files in `src/pages`, so route tests use
  `_robots.txt.test.ts` and `_sitemap.xml.test.ts` while staying beside their
  handlers. No route or runtime code changed.
- Repair verification: the renamed robots/sitemap suites passed (2 files,
  6 tests); Prettier and `pnpm check:style` passed. `pnpm build` passed and
  generated only the intended `/robots.txt` and `/sitemap.xml` routes.
- `pnpm test:e2e` completed with 304 passed and two existing WebKit failures:
  the video 404 fallback did not observe its fulfilled request, and the
  desktop contact alignment case timed out. Neither failure involves route
  generation or the renamed tests.
- Independent post-repair verification: `pnpm exec vitest run
  src/pages/_robots.txt.test.ts src/pages/_sitemap.xml.test.ts` passed (2 files,
  6 tests); `pnpm build` generated 39 routes without test routes;
  `pnpm verify:quality` passed for all 39 built routes. Confirmed `dist`
  contains `robots.txt` and `sitemap.xml` and no `.test` artifacts.
