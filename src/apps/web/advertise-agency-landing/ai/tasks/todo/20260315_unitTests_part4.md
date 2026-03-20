# Plan: Unit Tests — Part 4: Footer, Portfolio, Blocks & Pages

**Status**: pending (blocked by Part 1 Task 0)
**Date**: 2026-03-15
**Series**: 4 of 4 (`20260315_unitTests_part1.md` → `_part2.md` → `_part3.md` → `_part4.md`)
**Prerequisite**: Part 1 Task 0 (test infrastructure) must be completed first. Parts 2–3 are recommended but not strictly required.

## Goal

Add unit tests for the footer section, portfolio section and page components, content block components, and top-level page components.

**Convention:** one test file per component, co-located next to the source file (`ComponentName.test.tsx`).

---

## Task 22: Footer Section — `src/components/sections/footer/`

**Model**: Claude Haiku 4.5

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `Footer.test.tsx` | `Footer` | renders brand, nav, services, contact, bottom bar |
| `FooterBrand.test.tsx` | `FooterBrand` | renders logo, description, social links |
| `FooterNav.test.tsx` | `FooterNav` | renders navigation links |
| `FooterServices.test.tsx` | `FooterServices` | renders services list |
| `FooterContact.test.tsx` | `FooterContact` | renders contact info |
| `FooterBottom.test.tsx` | `FooterBottom` | renders copyright, legal links |

**Validation:** `pnpm test src/components/sections/footer`

---

## Task 23: Portfolio Section (Home Page) — `src/components/sections/portfolio/`

**Model**: Claude Haiku 4.5

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `Portfolio.test.tsx` | `Portfolio` | renders section header, filter tabs, portfolio cards (max 6), "view all" CTA |
| `PortfolioFilter.test.tsx` | `PortfolioFilter` | renders all category buttons, clicking changes active, active button has active style |

**Mocking notes:**
- Mock `import.meta.glob` to return mock portfolio cases

**Validation:** `pnpm test src/components/sections/portfolio`

---

## Task 24: Portfolio Page Components — `src/components/portfolio/`

**Model**: Claude Haiku 4.5

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `CategoryNav.test.tsx` | `CategoryNav` | renders "All" link + category links, active slug highlights correct tab, inactive tabs have primary border |
| `Pagination.test.tsx` | `Pagination` | renders prev/next buttons, renders page label, prev disabled on first page, next disabled on last |
| `PortfolioGrid.test.tsx` | `PortfolioGrid` | renders cards in grid, renders CategoryNav, renders Pagination, renders CTA |
| `CaseHero.test.tsx` | `CaseHero` | renders title, category badge, image or gradient background |
| `CaseOverview.test.tsx` | `CaseOverview` | renders project info fields |
| `CaseCTA.test.tsx` | `CaseCTA` | renders CTA section with button |

**Mocking notes:**
- Wrap in `MemoryRouter` with route params for slug-dependent components

**Validation:** `pnpm test src/components/portfolio`

---

## Task 25: Content Block Components — `src/components/blocks/`

**Model**: Claude Sonnet 4.6

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `BlockRenderer.test.tsx` | `BlockRenderer` | dispatches to correct block component based on `type` field |
| `HeadingBlock.test.tsx` | `HeadingBlock` | renders h2/h3/h4 with correct font size class per level (STYLES map) |
| `ParagraphBlock.test.tsx` | `ParagraphBlock` | renders paragraph with text, renders HTML via dangerouslySetInnerHTML |
| `ImageBlock.test.tsx` | `ImageBlock` | renders figure with img, renders caption |
| `GalleryBlock.test.tsx` | `GalleryBlock` | renders ImageGallery with images |
| `BlockquoteBlock.test.tsx` | `BlockquoteBlock` | renders blockquote with quote and attribution (large quote mark, primary border) |
| `MetricsBlock.test.tsx` | `MetricsBlock` | renders metric items with values, scroll-triggered count-up (mock IntersectionObserver) |
| `CardsBlock.test.tsx` | `CardsBlock` | renders card grid, hover state classes present, stagger entrance classes applied |
| `TableBlock.test.tsx` | `TableBlock` | renders table with headers and rows, zebra-striping classes present |
| `DividerBlock.test.tsx` | `DividerBlock` | renders horizontal rule |
| `CalloutBlock.test.tsx` | `CalloutBlock` | renders callout with correct variant class (info/success/warning/note), renders icon from ICON_MAP |
| `ListBlock.test.tsx` | `ListBlock` | routes to `UnorderedListBlock`, `OrderedListBlock`, or `ChecklistBlock` based on subtype |
| `VideoBlock.test.tsx` | `VideoBlock` | renders facade button (not iframe) before click for YouTube/Rutube, renders iframe after click, renders `<video>` for local file |
| `CodeBlock.test.tsx` | `CodeBlock` | renders code with syntax highlighting, renders copy button, copy button writes to clipboard |
| `OrderFormBlock.test.tsx` | `OrderFormBlock` | renders `OrderFormBlockMobile` + `OrderFormBlockDesktop` pair, returns null for unknown formId, desktop shows trust badges |
| `ChartBlock.test.tsx` | `ChartBlock` | routes to BarChart/HorizontalBarChart/ProgressChart/LineChart/PieChart based on `chartType` |

**Mocking notes:**
- Mock `IntersectionObserver` for scroll-triggered animations (MetricsBlock, CardsBlock)
- Mock `navigator.clipboard.writeText` for CodeBlock copy button
- Mock `import.meta.env.DEV` as false for OrderFormBlock null-return test

**Validation:** `pnpm test src/components/blocks`

---

## Task 26: Page Components — `src/pages/`

**Model**: Claude Sonnet 4.6

**Test files:** one per page component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `Home.test.tsx` | `Home` | renders all sections in order (Carousel, Hero, About, Services, Portfolio, Advantages, CTA, Testimonials, Contact) |
| `NotFound.test.tsx` | `NotFound` | renders 404 code, title, description, back link, accepts custom backLabel/backHref props |
| `PortfolioPage.test.tsx` | `PortfolioPage` | renders portfolio grid with all cases |
| `PortfolioCategoryPage.test.tsx` | `PortfolioCategoryPage` | renders filtered cases for category, renders NotFound for unknown slug |
| `PortfolioCasePage.test.tsx` | `PortfolioCasePage` | renders case hero, overview, content blocks, CTA |
| `OrderPage.test.tsx` | `OrderPage` | renders order form, selects form from `?form=` search param |

**Mocking notes:**
- Mock `useParams`, `useSearchParams` from react-router-dom
- Mock `import.meta.glob` for portfolio data
- Heavy use of `MemoryRouter` with `initialEntries`

**Validation:** `pnpm test src/pages`

---

## Summary — Part 4

| Task | Test Files | Scope | Est. Tests |
|------|-----------|-------|------------|
| 22 | 6 files in `src/components/sections/footer/` | 6 footer components | ~12 |
| 23 | 2 files in `src/components/sections/portfolio/` | Portfolio, PortfolioFilter | ~8 |
| 24 | 6 files in `src/components/portfolio/` | 6 portfolio page components | ~18 |
| 25 | 16 files in `src/components/blocks/` | 16 block components | ~40 |
| 26 | 6 files in `src/pages/` | 6 page components | ~20 |
| **Subtotal** | **~36 test files** | | **~98 tests** |

## Execution Order

Tasks 22–25 are independent and can be done in any order. Task 26 (pages) should be done **last** since page tests depend on all section components.

```
Part 1 Task 0 (setup) ← prerequisite
  ├── Task 22 (footer) ← start here
  ├── Task 23 (portfolio section)
  ├── Task 24 (portfolio pages)
  ├── Task 25 (blocks)
  └── Task 26 (pages) ← LAST — depends on all section components
```

## Session Strategy

Each task is designed to be completable in **one Claude session**:

1. **Start session** → Read this plan, identify which task to work on
2. **Run:** `pnpm test` to confirm existing tests pass
3. **Implement** one test file per component, co-located next to the source file
4. **Run:** `pnpm test <path>` to validate
5. **Commit:** `git add <test-files> && git commit -m "test(taskN): add tests for <area>"`

To do **all Part 4 tasks in one session**, work through them in order (22 → 23 → 24 → 25 → 26), committing after each task passes.

---

## Full Series Summary

| Part | File | Tasks | Test Files | Est. Tests |
|------|------|-------|------------|------------|
| 1 | `20260315_unitTests_part1.md` | 0–4, 27 | ~18 | ~91 |
| 2 | `20260315_unitTests_part2.md` | 5–14 | ~46 | ~140 |
| 3 | `20260315_unitTests_part3.md` | 15–21 | ~31 | ~89 |
| 4 | `20260315_unitTests_part4.md` | 22–26 | ~36 | ~98 |
| **Total** | | **28 tasks** | **~131 test files** | **~418 tests** |
