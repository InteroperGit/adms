# PDR: Refactor `src/components/ui` — Separate shadcn/ui from Custom Components

**Date:** 2026-04-11
**Status:** Pending
**Branch:** `adv-landing-core`

## Problem

`src/components/ui/` mixes two categories of components:

1. **shadcn/ui primitives** (7 files, flat at root): `button.tsx`, `input.tsx`, `textarea.tsx`, `badge.tsx`, `separator.tsx`, `card.tsx`, `skeleton.tsx`
2. **Custom project components** (~40 files, some in subfolders): navigation, section layouts, image gallery, order form, legal, testimonials, etc.

This makes it unclear which components are vendored (shadcn) vs project-owned, and complicates future shadcn upgrades.

## Proposed Solution

**Keep shadcn/ui at `src/components/ui/` root, move custom components to `src/components/shared/`.**

Rationale:
- `ui/` is the conventional shadcn/ui location — keeping it avoids breaking the shadcn CLI and future component additions
- `shared/` matches the existing `src/types/shared/` naming convention
- Import paths stay readable: `@/components/ui/button` vs `@/components/shared/navigation/BreadCrumbs`

## Target Structure

```
src/components/
├── ui/                          # shadcn/ui only (vendored, flat)
│   ├── button.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   ├── badge.tsx
│   ├── separator.tsx
│   ├── card.tsx
│   └── skeleton.tsx
├── shared/                      # project-owned components
│   ├── navigation/
│   │   ├── BackButton.tsx
│   │   ├── BreadCrumbs.tsx
│   │   ├── HomeHashScroll.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── SkipToContent.tsx
│   ├── section/
│   │   ├── FadeInSection.tsx
│   │   ├── SectionBadge.tsx
│   │   ├── SectionDivider.tsx
│   │   ├── SectionHeader.tsx
│   │   └── SectionIconBox.tsx
│   ├── testimonial/
│   │   ├── StarRating.tsx
│   │   └── TestimonialCard.tsx
│   ├── legal/
│   │   ├── LegalBlockRenderer.tsx
│   │   ├── LegalPageLayout.tsx
│   │   └── LegalSection.tsx
│   ├── imageGallery/
│   │   ├── index.tsx
│   │   ├── ImageGalleryLightbox.tsx
│   │   ├── ImageGalleryNavButtons.tsx
│   │   ├── ImageGalleryPreview.tsx
│   │   └── ImageGalleryThumbnails.tsx
│   ├── orderForm/
│   │   ├── index.tsx
│   │   ├── OrderForm.tsx
│   │   ├── OrderFormConsent.tsx
│   │   ├── OrderFormCustomerFields.tsx
│   │   ├── OrderFormDynamicFields.tsx
│   │   ├── OrderFormField.tsx
│   │   ├── OrderFormProductTabs.tsx
│   │   └── OrderFormSuccess.tsx
│   ├── article/
│   │   └── ArticleThumbnail.tsx
│   ├── yandex/
│   │   └── YandexSmartCaptcha.tsx
│   ├── AnimatedPillTabs.tsx
│   ├── ItemCard.tsx
│   ├── Logo.tsx
│   ├── OptimizedImage.tsx
│   ├── ScrollProgress.tsx
│   ├── SocialLinks.tsx
│   └── WidgetIframe.tsx
```

## Steps

### Phase 1: Move files
1. Create `src/components/custom/` directory
2. Move all non-shadcn files from `src/components/ui/` (and subfolders) to `src/components/custom/` preserving subfolder structure
3. Move all `.test.tsx` files alongside their moved components

### Phase 2: Update imports
4. Update all `@/components/ui/...` import paths in:
   - `src/pages/` (all page components)
   - `src/components/sections/` (all section components)
   - `src/components/banners/`
   - `src/components/layout/`
   - `src/components/portfolio/`
   - `src/components/analytics/`
   - `src/components/banners/`
   - `src/root.tsx`
   - `src/entry.client.tsx`
   - Any other files importing from `@/components/ui/` (excluding the 7 shadcn files)
5. Update any barrel exports or re-exports

### Phase 3: Verify
6. Run `pnpm typecheck` — no type errors
7. Run `pnpm lint` — no lint errors
8. Run `pnpm format` — code formatted
9. Run `pnpm build` — SSG build succeeds
10. Run `pnpm test` — all tests pass (import paths in tests updated)

## Risk Notes
- shadcn CLI (`pnpm dlx shadcn@latest add ...`) writes to `src/components/ui/` — this must remain untouched
- No component logic changes, only file moves + import path updates
- Test files move with their components; import paths in tests must be updated accordingly
- `components.json` (shadcn config) points to `src/components/ui` — verify it still works after the move
