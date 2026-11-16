# 183 - Test async content aggregates

**Status:** backlog

**Priority:** high

**Created:** 2026-11-15

**Scope:** `src/content/pricing.ts`, `src/content/projects.ts`,
`src/content/services.ts`, `src/content/site.ts`

## Goal

Add focused tests around the modules that combine parsed config, Astro content
collections, publication policy and derived visible lists.

## Scope

- Add matching colocated tests for all four modules.
- Mock `astro:content` at the module boundary with minimal valid, missing,
  mismatched and rendered-entry cases.
- Cover JSON and MDX article paths, missing/mismatched IDs, publication
  filtering, visible category/service lists, pricing route allow-lists and the
  site menu filter based on visible services.
- Keep mocks deterministic and isolated; do not read or rewrite runtime
  content, and do not duplicate schema tests.

## Execution

- Skills: `ponytail`.
- Primary executor: Sol, medium; async module evaluation crosses several local
  contracts.
- Escalate to Astra only after a reproducible unresolved module-mocking or
  publication-contract conflict; record evidence if that occurs.
- Delegation: none.

### Checklist

1. Read the four modules, publication helpers, content config and existing
   async test patterns.
2. Create isolated `astro:content` mocks and synthetic collection entries.
3. Add success, missing-entry, ID-mismatch and publication-boundary tests.
4. Run the four focused suites, related publication tests and `pnpm check`.
5. Review module cache/reset behavior so one suite cannot leak collection data.

## Acceptance

- Each listed module has a matching colocated suite with meaningful async and
  failure assertions.
- Tests prove no silent JSON fallback for invalid article references and no
  unapproved route/category leakage.
- Focused tests, related publication tests and type/check diagnostics pass.

## Dependencies

Tasks 180-182 provide adjacent export coverage. Run this task after them when
sharing fixture helpers, but do not merge their responsibilities.

