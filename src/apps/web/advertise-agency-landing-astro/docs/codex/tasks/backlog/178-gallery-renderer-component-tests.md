# 178 - Test the gallery renderer components

**Status:** backlog

**Priority:** normal

**Created:** 2026-11-15

**Scope:** `src/components/content/ImageGalleryTiles.astro`,
`src/components/content/ImageGalleryLightbox.astro`

## Goal

Add the missing renderer suites for the two gallery children. Preserve the
native-link fallback and the modal's accessible server-rendered shell.

## Scope

- Add `ImageGalleryTiles.test.ts` and `ImageGalleryLightbox.test.ts`.
- Cover tile order, full-size `href`, first-tile priority, `aria-current`,
  thumbnail metadata, dialog label, close/navigation controls, live
  announcement, image dimensions and empty image input.
- Use minimal synthetic `GalleryImage` values; keep the parent contract in
  `ImageGallery.test.ts` and browser interactions in task 179.
- Do not add client logic or alter gallery styling.

## Execution

- Skills: `astro-best-practices`, `ponytail`.
- Primary executor: Luna, medium.
- Delegation: none.

### Checklist

1. Read task 174's `Link` contract and the existing `ImageGallery` tests.
2. Add one suite per source file with normal, optional and empty branches.
3. Run the focused component suites and `pnpm verify:component-tests`.
4. Review link semantics and ensure no production media is imported as a test
   fixture.

## Acceptance

- Both missing colocated suites assert observable HTML rather than imports.
- Native gallery links remain usable without JavaScript and the lightbox has
  labeled controls, dimensions and an `aria-live` region.
- Focused tests and component colocation verification pass.

## Dependencies

Task 174 supplies the current `Link` API. Task 179 may build on these markup
assertions but is otherwise independent.

