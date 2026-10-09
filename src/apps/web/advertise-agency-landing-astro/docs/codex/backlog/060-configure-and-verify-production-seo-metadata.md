# Configure and verify production domain and SEO metadata

**Status:** Backlog — pending

**Moved to backlog:** 2026-10-10, at user request

**Priority:** Priority 3

**Created:** 2026-10-09

**Plan:** [Sales and SEO improvement plan](../plan/sales-and-seo-plan.md).

**Depends on:** Task 050 and confirmed production hosting/domain; coordinate with 059.

## Goal

Finish deployment SEO configuration using the existing metadata routes.

## Scope

- Confirm the HTTPS production origin and set PUBLIC_SITE_URL in the real
  build/deployment configuration; Astro site already reads this variable.
- Review existing Layout canonical/Open Graph output, sitemap.xml.ts, and
  robots.txt.ts. Adapt the hard-coded sitemap inventory to approved indexable
  routes; exclude demo/noindex/removed routes.
- Verify canonical URLs, robots behavior, sitemap content/type, redirects, and
  accessible HTTPS responses on the deployed host; keep preview hosts safe.
- Use the existing verify:release script and add focused checks only where
  its current coverage misses publication or route consistency.
- Document environment setup, approved sharing assets if available, validation
  evidence, and rollback. Do not replace working SEO plumbing without need.

## Acceptance

- Production pages use the confirmed origin; sitemap lists only canonical
  indexable routes and agrees with the deployed robots/indexing policy.
- Release checks pass with the real configuration; deployed behavior is
  verified. A local example-origin build does not establish production setup.

## Execution notes

Read project instructions, task-management guidance, and applicable rules
before implementation. Record missing agency inputs or external access as
dependencies. This task file authorizes no external publication or messages.
Archive only after acceptance, with evidence and updated plan/status links.
