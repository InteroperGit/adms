# Plan: Unit Tests — Part 2: UI Components

**Status**: pending (blocked by Part 1 Task 0)
**Date**: 2026-03-15
**Series**: 2 of 4 (`20260315_unitTests_part1.md` → `_part2.md` → `_part3.md` → `_part4.md`)
**Prerequisite**: Part 1 Task 0 (test infrastructure) must be completed first.

## Goal

Add unit tests for all reusable UI components in `src/components/ui/`, plus layout, analytics, and banner components. These are the building blocks used by section and page components tested in Part 3.

**Convention:** one test file per component, co-located next to the source file (`ComponentName.test.tsx`).

---

## Task 5: Base UI Components — `src/components/ui/` (DONE 2026-03-20)

**Model**: Claude Haiku 4.5

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `Badge.test.tsx` | `Badge` | renders with text, applies variant classes (default, secondary, outline), merges custom className | ✅
| `Button.test.tsx` | `Button` | renders children, applies variant/size classes, renders as child element with `asChild`, handles click | ✅
| `Card.test.tsx` | `Card` + subcomponents | renders Card/CardHeader/CardTitle/CardContent/CardDescription/CardFooter, accepts className | ✅
| `Input.test.tsx` | `Input` | renders, accepts value/onChange, applies className | ✅
| `Textarea.test.tsx` | `Textarea` | renders, accepts value/onChange | ✅
| `Separator.test.tsx` | `Separator` | renders horizontal by default, renders vertical | ✅
| `Skeleton.test.tsx` | `Skeleton` | renders with pulse class, accepts className | ✅
| `ItemCard.test.tsx` | `ItemCard` | renders children, applies hover classes, merges className, has `group` class | ✅ ✅

**Validation:** `pnpm test src/components/ui/Badge src/components/ui/Button` (etc. per file)

---

## Task 6: UI Section Utilities — `src/components/ui/section/` (DONE 2026-03-20)

**Model**: Claude Haiku 4.5

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `SectionBadge.test.tsx` | `SectionBadge` | renders label text, light variant classes, dark variant classes | ✅
| `SectionHeader.test.tsx` | `SectionHeader` | renders label badge + title + description, renders highlight span, omits description when absent | ✅
| `SectionIconBox.test.tsx` | `SectionIconBox` | renders icon, applies size class, has hover-primary animation class | ✅
| `SectionDivider.test.tsx` | `SectionDivider` | renders SVG, applies color gradient | ✅
| `FadeInSection.test.tsx` | `FadeInSection` | renders children, applies `id` attribute, calls `useFadeIn` | ✅

**Validation:** `pnpm test src/components/ui/section`

---

## Task 7: Navigation UI — `src/components/ui/navigation/` (DONE 2026-03-20)

**Model**: Claude Sonnet 4.6

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `BreadCrumbs.test.tsx` | `BreadCrumbs` | renders crumb items, last item is not a link, renders separator between items | ✅
| `BackButton.test.tsx` | `BackButton` | renders button, clicking calls `navigate(-1)` | ✅
| `ScrollToTop.test.tsx` | `ScrollToTop` | hidden initially, visible after scroll threshold, clicking scrolls to top | ✅
| `SkipToContent.test.tsx` | `SkipToContent` | renders hidden link, has correct `href` | ✅
| `HomeHashScroll.test.tsx` | `HomeHashScroll` | calls `scrollIntoView` when hash matches an element | ✅

**Mocking notes:**
- Mock `window.scrollTo`, `window.scrollY`, `element.scrollIntoView`
- Wrap in `MemoryRouter` for Link-based components

**Validation:** `pnpm test src/components/ui/navigation`

---

## Task 8: Logo, SocialLinks, OptimizedImage — `src/components/ui/` (DONE 2026-03-21)

**Model**: Claude Sonnet 4.6

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `Logo.test.tsx` | `Logo` | renders `<a>` with `href="/"`, renders `<img>` with alt from config | ✅
| `SocialLinks.test.tsx` | `SocialLinks` | renders correct number of links, each has `target="_blank"`, applies size variant | ✅
| `OptimizedImage.test.tsx` | `OptimizedImage` | renders `<img>` with alt, generates srcSet, shows Skeleton while loading, hides Skeleton after load, respects `priority` (no lazy) | ✅

**Also fixed:** `ScrollProgress.tsx` — SSR crash (`window is not defined`) in `useState` initializer; used `typeof window !== 'undefined'` guard.

**Validation:** `pnpm test src/components/ui/Logo src/components/ui/SocialLinks src/components/ui/OptimizedImage`

---

## Task 9: Testimonial Components — `src/components/ui/testimonial/` (DONE 2026-03-21)

**Model**: Claude Sonnet 4.6

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `StarRating.test.tsx` | `StarRating` | renders correct number of filled stars, renders 5 stars total | ✅
| `TestimonialCard.test.tsx` | `TestimonialCard` | renders author name, quote text, star rating, avatar image | ✅

**Validation:** `pnpm test src/components/ui/testimonial`

---

## Task 10: Portfolio UI Components — `src/components/ui/portfolio/` (DONE 2026-03-21)

**Model**: Claude Sonnet 4.6

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `PortfolioThumbnail.test.tsx` | `PortfolioThumbnail` | renders image when provided, renders gradient fallback, shows category badge | ✅
| `PortfolioCard.test.tsx` | `PortfolioCard` | renders title, description, tags, link href, thumbnail | ✅

**Validation:** `pnpm test src/components/ui/portfolio`

---

## Task 11: Image Gallery — `src/components/ui/imageGallery/`

**Model**: Claude Sonnet 4.6

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `ImageGallery.test.tsx` | `ImageGallery` | renders preview image, renders thumbnails, clicking thumbnail changes active image |
| `ImageGalleryPreview.test.tsx` | `ImageGalleryPreview` | renders main image, shows description on hover |
| `ImageGalleryThumbnails.test.tsx` | `ImageGalleryThumbnails` | renders all thumbnails, active thumbnail has active class |
| `ImageGalleryNavButtons.test.tsx` | `ImageGalleryNavButtons` | prev/next buttons call handlers |
| `ImageGalleryLightbox.test.tsx` | `ImageGalleryLightbox` | renders when open, closes on Escape key, shows image, prev/next navigation |

**Mocking notes:**
- Mock `useSwipe` or touch events for gesture tests

**Validation:** `pnpm test src/components/ui/imageGallery`

---

## Task 12: Order Form — `src/components/ui/orderForm/`

**Model**: Claude Haiku 4.5

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `OrderForm.test.tsx` | `OrderForm` | renders product tabs, renders fields for selected product, shows success on submit |
| `OrderFormProductTabs.test.tsx` | `OrderFormProductTabs` | renders all tabs, clicking tab calls onChange, active tab has active style |
| `OrderFormField.test.tsx` | `OrderFormField` | renders text input, select, radio, checkbox, textarea based on type |
| `OrderFormDynamicFields.test.tsx` | `OrderFormDynamicFields` | renders multiple fields from field definitions |
| `OrderFormCustomerFields.test.tsx` | `OrderFormCustomerFields` | renders name, phone, email fields |
| `OrderFormConsent.test.tsx` | `OrderFormConsent` | renders checkbox, renders legal links |
| `OrderFormSuccess.test.tsx` | `OrderFormSuccess` | renders success message, reset button calls handler |

**Validation:** `pnpm test src/components/ui/orderForm`

---

## Task 13: Legal UI — `src/components/ui/legal/`

**Model**: Claude Haiku 4.5

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `LegalBlockRenderer.test.tsx` | `LegalBlockRenderer` | renders paragraph block, unordered list, ordered list, definition list, contact block with company data |
| `LegalPageLayout.test.tsx` | `LegalPageLayout` | renders header, footer metadata, children |
| `LegalSection.test.tsx` | `LegalSection` | renders section with heading and children |

**Mocking notes:**
- Provide mock `legalData` with company info for token substitution

**Validation:** `pnpm test src/components/ui/legal`

---

## Task 14: Layout, Analytics & Banners

**Model**: Claude Haiku 4.5

**Test files:** co-located next to each source file

| Test file | Component | Tests |
|-----------|-----------|-------|
| `src/components/layout/Container.test.tsx` | `Container` | renders children, has max-width class, accepts className |
| `src/components/banners/CookieBanner.test.tsx` | `CookieBanner` | renders when consent not given, hides after accepting, renders privacy link |
| `src/components/banners/CookieActions.test.tsx` | `CookieActions` | accept button calls handler, necessary-only button calls handler |
| `src/components/analytics/MetrikaScript.test.tsx` | `MetrikaScript` | does not inject script without consent, injects script with consent |
| `src/components/ui/ScrollProgress.test.tsx` | `ScrollProgress` | renders progress bar, updates width on scroll, hidden on short pages |
| `src/components/layout/PageTransition.test.tsx` | `PageTransition` | renders children, applies transition class on route change |

**Validation:** `pnpm test src/components/layout src/components/banners src/components/analytics`

---

## Summary — Part 2

| Task | Test Files | Scope | Est. Tests |
|------|-----------|-------|------------|
| 5 | 8 files in `src/components/ui/` | 8 base UI components | ~25 |
| 6 | 5 files in `src/components/ui/section/` | 5 section utilities | ~15 |
| 7 | 5 files in `src/components/ui/navigation/` | 5 navigation components | ~15 |
| 8 | 3 files in `src/components/ui/` | Logo, SocialLinks, OptimizedImage | ~12 |
| 9 | 2 files in `src/components/ui/testimonial/` | StarRating, TestimonialCard | ~6 |
| 10 | 2 files in `src/components/ui/portfolio/` | PortfolioThumbnail, PortfolioCard | ~8 |
| 11 | 5 files in `src/components/ui/imageGallery/` | 5 gallery components | ~15 |
| 12 | 7 files in `src/components/ui/orderForm/` | 7 form components | ~20 |
| 13 | 3 files in `src/components/ui/legal/` | 3 legal components | ~10 |
| 14 | 6 files across layout/banners/analytics | Container, CookieBanner, MetrikaScript, ScrollProgress, PageTransition | ~14 |
| **Subtotal** | **~46 test files** | | **~140 tests** |

## Execution Order

All tasks in Part 2 are independent — they can be done in any order after Part 1 Task 0 is complete.

```
Part 1 Task 0 (setup) ← prerequisite
  ├── Task 5 (base UI) ← start here, simplest components
  ├── Task 6 (section UI)
  ├── Task 7 (navigation UI)
  ├── Task 8 (media UI)
  ├── Task 9 (testimonial UI)
  ├── Task 10 (portfolio UI)
  ├── Task 11 (image gallery)
  ├── Task 12 (order form)
  ├── Task 13 (legal UI)
  └── Task 14 (layout/analytics/banners)
```

## Session Strategy

Each task is designed to be completable in **one Claude session**:

1. **Start session** → Read this plan, identify which task to work on
2. **Run:** `pnpm test` to confirm existing tests pass
3. **Implement** one test file per component, co-located next to the source file
4. **Run:** `pnpm test <path>` to validate
5. **Commit:** `git add <test-files> && git commit -m "test(taskN): add tests for <area>"`

To do **all Part 2 tasks in one session**, work through them in order (5 → 6 → ... → 14), committing after each task passes. Then proceed to Part 3.
