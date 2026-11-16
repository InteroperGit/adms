# 185 - Complete shared TypeScript contract tests

**Status:** backlog

**Priority:** normal

**Created:** 2026-11-15

**Scope:** `src/components/ui/Button.astro`,
`src/components/ui/Button.test.ts`,
`src/components/content/image-gallery.types.ts`,
`tests/fixtures/content/type-contracts/image-gallery.ts`

## Goal

Make the shared UI and gallery type-only modules executable in the project's
strict type-contract suite instead of leaving their public shapes implicit.

## Scope

- Keep Button's compile-time cases in `Button.test.ts`, because the standalone
  type-contract compiler cannot resolve types exported from `.astro` files.
- Add or extend the gallery type-contract fixture; add
  `image-gallery.types.test.ts` only if the module exposes runtime values that
  can be tested without casting.
- Cover accepted native button/anchor props, discriminated variants, required
  gallery dimensions and alt text, optional captions and invalid negative cases.
- Use `satisfies` for positive fixtures and immediate `@ts-expect-error` for
  intentional diagnostics.
- Do not weaken `tsconfig.type-contracts.json` or introduce runtime casts.

## Execution

- Skills: `ponytail`.
- Primary executor: Luna, medium; this is a strict fixture-only change.
- Delegation: none.

### Checklist

1. Read the source type declarations, `Button` props and existing contract
   fixtures before adding cases.
2. Add positive and negative fixtures for each public branch and barrel path.
3. Run `pnpm test:types` and the nearest `Button`/gallery component suites.
4. Review that diagnostics are expected and not filtered or suppressed.

## Acceptance

- Shared button and gallery contracts have versioned type fixtures with clear
  expected failures.
- `pnpm test:types` passes under the existing strict configuration.
- No production source, runtime content or component behavior changes.

## Dependencies

None. This task complements, but does not replace, the component suites in
tasks 175, 176 and 178.

