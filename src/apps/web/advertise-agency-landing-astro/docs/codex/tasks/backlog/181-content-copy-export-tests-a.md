# 181 - Test content copy exports A

**Status:** backlog

**Priority:** normal

**Created:** 2026-11-15

**Scope:** `src/content/about-carousel.ts`,
`src/content/business-solutions.ts`, `src/content/faq.ts`,
`src/content/introduction.ts`, `src/content/offers.ts`

## Goal

Test the typed parse-and-export boundary for the first group of content copy
modules, including the derived enabled-offer view.

## Scope

- Add matching colocated tests for all five modules.
- Assert the parser receives valid fixture data, exported values retain their
  source order and IDs, and `enabledOffers` filters without reordering.
- Add malformed fixture cases only through `tests/fixtures/content/` when the
  existing parser contract cannot be exercised in memory.
- Do not duplicate validator internals, publication policy or rendered section
  assertions.

## Execution

- Skills: `ponytail`.
- Primary executor: Luna, medium.
- Delegation: none.

### Checklist

1. Read each source module, its schema test and the fixture alias in Vitest.
2. Add focused export tests with valid, empty/optional and invalid boundaries
   owned by the module.
3. Run the five focused suites and the related validation tests.
4. Review fixture placement and changed-file formatting.

## Acceptance

- All five source modules have matching colocated suites.
- Tests prove normalized output, order preservation, optional fields and the
  enabled-offer projection without relying on production content snapshots.
- Focused tests and style checks for changed files pass.

## Dependencies

Task 180 establishes the simple content export testing pattern but no code
dependency is required.

