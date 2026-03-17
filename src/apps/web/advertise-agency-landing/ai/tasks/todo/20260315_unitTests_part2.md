# Plan: Unit Tests — Part 2: UI Components

**Status**: pending (blocked by Part 1 Task 0)
**Date**: 2026-03-15
**Series**: 2 of 4 (`20260315_unitTests_part1.md` → `_part2.md` → `_part3.md` → `_part4.md`)
**Prerequisite**: Part 1 Task 0 (test infrastructure) must be completed first.

## Goal

Add unit tests for all reusable UI components in `src/components/ui/`, plus layout, analytics, and banner components. These are the building blocks used by section and page components tested in Part 3.

---

## Task 5: Base UI Components — `src/components/ui/`

**Test file:** `src/components/ui/base-ui.test.tsx`

| Component | Tests |
|-----------|-------|
| `Badge` | renders with text, applies variant classes (default, secondary, outline), merges custom className |
| `Button` | renders children, applies variant/size classes, renders as child element with `asChild`, handles click |
| `Card` + subcomponents | renders Card/CardHeader/CardTitle/CardContent/CardDescription/CardFooter, accepts className |
| `Input` | renders, accepts value/onChange, applies className |
| `Textarea` | renders, accepts value/onChange |
| `Separator` | renders horizontal by default, renders vertical |
| `Skeleton` | renders with pulse class, accepts className |
| `ItemCard` | renders children, applies hover classes, merges className, has `group` class |

**Validation:** `pnpm test src/components/ui/base-ui`

---

## Task 6: UI Section Utilities — `src/components/ui/section/`

**Test file:** `src/components/ui/section/section-ui.test.tsx`

| Component | Tests |
|-----------|-------|
| `SectionBadge` | renders label text, light variant classes, dark variant classes |
| `SectionHeader` | renders label badge + title + description, renders highlight span, omits description when absent |
| `SectionIconBox` | renders icon, applies size class, has hover-primary animation class |
| `SectionDivider` | renders SVG, applies color gradient |
| `FadeInSection` | renders children, applies `id` attribute, calls `useFadeIn` |

**Validation:** `pnpm test src/components/ui/section`

---

## Task 7: Navigation UI — `src/components/ui/navigation/`

**Test file:** `src/components/ui/navigation/navigation-ui.test.tsx`

| Component | Tests |
|-----------|-------|
| `BreadCrumbs` | renders crumb items, last item is not a link, renders separator between items |
| `BackButton` | renders button, clicking calls `history.back()` |
| `ScrollToTop` | hidden initially, visible after scroll threshold, clicking scrolls to top |
| `SkipToContent` | renders hidden link, has `href="#main"` |
| `HomeHashScroll` | calls `scrollIntoView` when hash matches an element |

**Mocking notes:**
- Mock `window.scrollTo`, `window.scrollY`, `element.scrollIntoView`
- Wrap in `MemoryRouter` for Link-based components

**Validation:** `pnpm test src/components/ui/navigation`

---

## Task 8: Logo, SocialLinks, OptimizedImage — `src/components/ui/`

**Test file:** `src/components/ui/media-ui.test.tsx`

| Component | Tests |
|-----------|-------|
| `Logo` | renders `<a>` with `href="/"`, renders `<img>` with alt from config |
| `SocialLinks` | renders correct number of links, each has `target="_blank"`, applies size variant |
| `OptimizedImage` | renders `<img>` with alt, generates srcSet, shows Skeleton while loading, hides Skeleton after load, respects `priority` (no lazy) |

**Validation:** `pnpm test src/components/ui/media-ui`

---

## Task 9: Testimonial Components — `src/components/ui/testimonial/`

**Test file:** `src/components/ui/testimonial/testimonial-ui.test.tsx`

| Component | Tests |
|-----------|-------|
| `StarRating` | renders correct number of filled stars, renders 5 stars total |
| `TestimonialCard` | renders author name, quote text, star rating, avatar image |

**Validation:** `pnpm test src/components/ui/testimonial`

---

## Task 10: Portfolio UI Components — `src/components/ui/portfolio/`

**Test file:** `src/components/ui/portfolio/portfolio-ui.test.tsx`

| Component | Tests |
|-----------|-------|
| `PortfolioThumbnail` | renders image when provided, renders gradient fallback, shows category badge |
| `PortfolioCard` | renders title, description, tags, link href, thumbnail |

**Validation:** `pnpm test src/components/ui/portfolio`

---

## Task 11: Image Gallery — `src/components/ui/imageGallery/`

**Test file:** `src/components/ui/imageGallery/imageGallery.test.tsx`

| Component | Tests |
|-----------|-------|
| `ImageGallery` | renders preview image, renders thumbnails, clicking thumbnail changes active image |
| `ImageGalleryPreview` | renders main image, shows description on hover |
| `ImageGalleryThumbnails` | renders all thumbnails, active thumbnail has active class |
| `ImageGalleryNavButtons` | prev/next buttons call handlers |
| `ImageGalleryLightbox` | renders when open, closes on Escape key, shows image, prev/next navigation |

**Mocking notes:**
- Mock `useSwipe` or touch events for gesture tests

**Validation:** `pnpm test src/components/ui/imageGallery`

---

## Task 12: Order Form — `src/components/ui/orderForm/`

**Test file:** `src/components/ui/orderForm/orderForm.test.tsx`

| Component | Tests |
|-----------|-------|
| `OrderForm` | renders product tabs, renders fields for selected product, shows success on submit |
| `OrderFormProductTabs` | renders all tabs, clicking tab calls onChange, active tab has active style |
| `OrderFormField` | renders text input, select, radio, checkbox, textarea based on type |
| `OrderFormDynamicFields` | renders multiple fields from field definitions |
| `OrderFormCustomerFields` | renders name, phone, email fields |
| `OrderFormConsent` | renders checkbox, renders legal links |
| `OrderFormSuccess` | renders success message, reset button calls handler |

**Validation:** `pnpm test src/components/ui/orderForm`

---

## Task 13: Legal UI — `src/components/ui/legal/`

**Test file:** `src/components/ui/legal/legal-ui.test.tsx`

| Component | Tests |
|-----------|-------|
| `LegalBlockRenderer` | renders paragraph block, unordered list, ordered list, definition list, contact block with company data |
| `LegalPageLayout` | renders header, footer metadata, children |
| `LegalSection` | renders section with heading and children |

**Mocking notes:**
- Provide mock `legalData` with company info for token substitution

**Validation:** `pnpm test src/components/ui/legal`

---

## Task 14: Layout & Analytics & Banners

**Test file:** `src/components/layout-analytics-banners.test.tsx`

| Component | Tests |
|-----------|-------|
| `Container` | renders children, has max-width class, accepts className |
| `CookieBanner` | renders when consent not given, hides after accepting, renders privacy link |
| `CookieActions` | accept button calls handler, necessary-only button calls handler |
| `MetrikaScript` | does not inject script without consent, injects script with consent |

**Validation:** `pnpm test src/components/layout-analytics-banners`

---

## Summary — Part 2

| Task | Test File | Scope | Est. Tests |
|------|-----------|-------|------------|
| 5 | `src/components/ui/base-ui.test.tsx` | 8 base UI components | ~25 |
| 6 | `src/components/ui/section/section-ui.test.tsx` | 5 section utilities | ~15 |
| 7 | `src/components/ui/navigation/navigation-ui.test.tsx` | 5 navigation components | ~15 |
| 8 | `src/components/ui/media-ui.test.tsx` | Logo, SocialLinks, OptimizedImage | ~12 |
| 9 | `src/components/ui/testimonial/testimonial-ui.test.tsx` | StarRating, TestimonialCard | ~6 |
| 10 | `src/components/ui/portfolio/portfolio-ui.test.tsx` | PortfolioThumbnail, PortfolioCard | ~8 |
| 11 | `src/components/ui/imageGallery/imageGallery.test.tsx` | 5 gallery components | ~15 |
| 12 | `src/components/ui/orderForm/orderForm.test.tsx` | 7 form components | ~20 |
| 13 | `src/components/ui/legal/legal-ui.test.tsx` | 3 legal components | ~10 |
| 14 | `src/components/layout-analytics-banners.test.tsx` | Container, CookieBanner, MetrikaScript | ~10 |
| **Subtotal** | **10 test files** | | **~136 tests** |

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
3. **Implement** the test file for the chosen task
4. **Run:** `pnpm test <path>` to validate
5. **Commit:** `git add <test-file> && git commit -m "test(taskN): add tests for <area>"`

To do **all Part 2 tasks in one session**, work through them in order (5 → 6 → ... → 14), committing after each task passes. Then proceed to Part 3.
