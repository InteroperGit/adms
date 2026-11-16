# 180 - Test simple content exports

**Status:** backlog

**Priority:** normal

**Created:** 2026-11-15

**Scope:** `src/content/about.ts`, `src/content/action-rail.ts`,
`src/content/icons.ts`, `src/content/legal.ts`,
`src/content/project-catalog.ts`

## Goal

Add colocated tests for the small typed content/config modules currently
covered only indirectly by consumers or validation suites.

## Scope

- Add matching test files for all five modules.
- Assert exported shapes, preserved authored values, strict action-rail parsing,
  legal document pairing, icon registry keys and positive catalog page size.
- Use the existing fixture alias and versioned synthetic fixtures where a
  malformed boundary is needed; never modify `data/content/`.
- Keep schema validation assertions separate from publication or page claims.

## Execution

- Skills: `ponytail`.
- Primary executor: Luna, medium; these are deterministic module contracts.
- Delegation: none.

### Checklist

1. Read the source types, validators and relevant fixture files before writing
   expectations.
2. Add one colocated suite per source module, including at least one boundary
   or failure assertion for parsed settings.
3. Run the five focused suites and `pnpm test:types` if type fixtures change.
4. Review that tests do not assert incidental JSON ordering.

## Acceptance

- Every listed module has a matching colocated test with observable contract
  assertions.
- Tests cover export shape and the strict/positive boundaries owned by each
  module without duplicating consumer behavior.
- Focused tests and applicable type checks pass.

## Dependencies

None. Existing validation and publication suites remain the deeper schema
coverage.

