# PDR: E2E Mobile — Step 2: Portfolio listing page (`mobile_portfolio_listing.spec.ts`)

**Date**: 2026-03-23
**Blocked by**: `20260323_e2eMobile_00_setup.md`
**Spec file**: `tests/e2e/mobile_portfolio_listing.spec.ts`
**Test IDs**: E8.1–E8.8 (8 tests × 2 mobile projects = 16 runs)

## Page: `PortfolioCategoryPage`

Routes: `/portfolio` (all cases) and `/portfolio/:categorySlug` (filtered).

Component tree:
```
BreadCrumbs           ← flex-col on mobile (wraps to multiple lines — overflow risk)
section.bg-background
  Container
    SectionHeader     ← label, title, description
    PortfolioGrid
      CategoryNav     ← AnimatedPillTabs with horizontal scroll on mobile
      article[]       ← PortfolioCard items
      Pagination      ← rendered when totalPages > 1
```

## Source files to read before implementing

- `src/components/ui/navigation/BreadCrumbs.tsx` — `nav[aria-label="Breadcrumb"]`;
  layout is `flex-col sm:flex-row` — on mobile items stack vertically (no overflow risk)
- `src/components/portfolio/PortfolioGrid.tsx` — confirm card selector (`article`) and
  grid class for single-column on mobile
- `src/components/portfolio/CategoryNav.tsx` — confirm nav structure; animated pill tabs
  may scroll horizontally on mobile if many categories
- `src/components/portfolio/Pagination.tsx` — confirm selector for page buttons

## Tests to implement

| ID | Name | How to test |
|----|------|-------------|
| E8.1 | `/portfolio` page heading visible on mobile | `page.goto('/portfolio')` → `h1` or `h2` (SectionHeader title) visible |
| E8.2 | Breadcrumbs render on `/portfolio` | `nav[aria-label="Breadcrumb"]` visible; contains link to `/` (home) |
| E8.3 | Portfolio cards render on mobile | `article` count ≥ 1 and first card visible |
| E8.4 | Portfolio card image or title visible | first `article` contains a heading or image element |
| E8.5 | Category nav renders on mobile | `nav` inside PortfolioGrid area contains ≥ 1 category link |
| E8.6 | Tapping a category link changes URL | click first `/portfolio/:slug` link in category nav → URL matches slug |
| E8.7 | Category page shows filtered cards | navigate to `/portfolio/:firstCategorySlug` → `article` count ≥ 0; page renders without error |
| E8.8 | No horizontal overflow on portfolio listing | `document.documentElement.scrollWidth <= window.innerWidth` on `/portfolio` |

## Notes

- **E8.6** reuses the E4.3 pattern but runs on a mobile device profile. If no categories
  are configured, skip gracefully (`test.skip()`) as in E4.3.
- **E8.7**: the filtered count may be 0 (valid if no cases in that category). The test
  asserts the page renders (no error heading, no exception) rather than asserting card count.
- **CategoryNav horizontal scroll**: if there are many categories, the pill tabs may
  overflow horizontally inside their container. Check whether `CategoryNav` has
  `overflow-x-auto` or similar. If not, consider adding E8.8b for category nav overflow.

## Validation

```bash
pnpm format && pnpm lint && pnpm typecheck
pnpm exec playwright test mobile_portfolio_listing.spec.ts --project="Mobile Chrome"
pnpm exec playwright test mobile_portfolio_listing.spec.ts --project="Mobile Safari"
```

## Acceptance criteria

- [ ] `tests/e2e/mobile_portfolio_listing.spec.ts` exists with E8.1–E8.8 (8 tests)
- [ ] All 8 tests pass on `Mobile Chrome` and `Mobile Safari` (16 runs)
- [ ] `pnpm format && pnpm lint && pnpm typecheck` pass
