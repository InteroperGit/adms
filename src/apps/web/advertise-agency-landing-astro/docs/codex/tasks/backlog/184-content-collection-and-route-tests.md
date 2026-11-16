# 184 - Test content collection and route handlers

**Status:** backlog

**Priority:** normal

**Created:** 2026-11-15

**Scope:** `src/content.config.ts`, `src/pages/robots.txt.ts`,
`src/pages/sitemap.xml.ts`

## Goal

Cover the application-level TypeScript modules that define content collection
boundaries and generated crawler routes.

## Scope

- Add `src/content.config.test.ts`, `src/pages/robots.txt.test.ts` and
  `src/pages/sitemap.xml.test.ts`.
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

1. Read content config, route handlers, publication helpers and existing route
   integration coverage.
2. Add node or jsdom-independent tests for response bodies, headers and XML
   escaping, plus collection registration assertions.
3. Run the three focused suites, `pnpm test:types` and `pnpm check`.
4. Confirm tests never assert production-specific URL counts.

## Acceptance

- All three modules have matching colocated suites.
- Crawler output is tested for secure no-site defaults, configured origins,
  escaping and publication filtering.
- Collection registration and fixture-root behavior are covered without
  weakening Astro diagnostics.

## Dependencies

Task 183 owns the deeper `projects` and `services` aggregate contracts used by
the sitemap. Existing route integration tests remain complementary.

