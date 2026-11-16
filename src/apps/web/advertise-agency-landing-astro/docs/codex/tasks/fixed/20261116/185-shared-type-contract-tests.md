# 185 - Complete shared TypeScript contract tests

**Status:** fixed

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

Update these checkboxes during execution using the
[task checklist rules](../../rules/workflow.md#task-checklists).

- [x] Read the source type declarations, `Button` props and existing contract
  fixtures before adding cases.
- [x] Add positive and negative fixtures for each public branch and barrel path.
- [x] Run `pnpm test:types` and the nearest `Button`/gallery component suites.
- [x] Review that diagnostics are expected and not filtered or suppressed.
- [x] Record changed files, verification commands/results and resolved review
  findings in this task's handoff; reconcile all checkboxes before completion.

## Acceptance

- [x] Button.test.ts covers accepted native button/anchor props and invalid
  discriminated variants.
- [x] Gallery type fixtures cover required dimensions/alt text and optional
  captions.
- [x] Positive cases use satisfies; negative cases use explained immediate @ts-
  expect-error.
- [x] Nearest Button/gallery component suites pass without suppressed
  diagnostics.
- [x] Shared button and gallery contracts have versioned type fixtures with
  clear
  expected failures.
- [x] `pnpm test:types` passes under the existing strict configuration.
- [x] No production source, runtime content or component behavior changes.

## Dependencies

None. This task complements, but does not replace, the component suites in
tasks 175, 176 and 178.

## Handoff

- Implementation: `/root/task185_impl` (Luna high) added compile-only gallery
  cases and a Button discriminant negative case; no runtime files changed.
- `pnpm test:types` passed with positive `satisfies` cases and expected
  diagnostics for missing alt text, width and height.
- `pnpm exec vitest run src/components/ui/Button.test.ts
  src/components/content/ImageGalleryTiles.test.ts
  src/components/content/ImageGalleryLightbox.test.ts
  src/components/content/ImageGallery.test.ts` passed (4 files, 19 tests).
- `pnpm check:style` and `git diff --check` passed.
- Changed files: `src/components/ui/Button.test.ts` and
  `tests/fixtures/content/type-contracts/image-gallery.ts`.
- Independent test stage: `pnpm test:types` passed. The nearest render suites
  passed with `pnpm exec vitest run src/components/ui/Button.test.ts
  src/components/content/ImageGallery.test.ts
  src/components/content/ImageGalleryTiles.test.ts
  src/components/content/ImageGalleryLightbox.test.ts` (4 files, 19 tests;
  the type-only module has no runtime test file). Inspected the fixture:
  positive cases use `satisfies`; each missing alt/width/height has an
  immediate explained `@ts-expect-error`; no casts or suppression directives
  are used. Button negatives cover invalid button/link discriminants and
  incompatible native props. No implementation edits were needed.
- Review: Luna high worker `/root/task185_review` reported no contract
  findings and flagged the inaccurate test command above; corrected it to the
  four suites actually run.
- Worker IDs (Luna high): `/root/task185_impl`, `/root/task185_test`,
  `/root/task185_review`.
- Commit worker: `/root/task185_commit` (Luna high).
