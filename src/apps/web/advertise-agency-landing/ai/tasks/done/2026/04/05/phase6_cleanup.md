# Phase 6: Cleanup & Verification

**Tasks:** T34–T36 (3 ✅) | **Depends on:** Phases 2–5 ✅
**Status:** ✅ Complete (2026-04-05)
**Parent index:** `20260401_generalArticleMechanism.md`

## What must NOT exist after this phase

### Deleted paths ✅
- `src/components/portfolio/` — deleted
- `src/pages/PortfolioCasePage.tsx` — deleted
- `src/pages/PortfolioCasePage.test.tsx` — never existed / deleted
- `src/pages/PortfolioCategoryPage.tsx` — deleted
- `src/pages/PortfolioCategoryPage.test.tsx` — deleted (`tests/integration/portfolioCategoryPage.test.tsx`, prior session)

### Stale import patterns ✅
- No `from '@/components/portfolio/...` in src/ or tests/
- No `from '@/pages/PortfolioCasePage'` in src/ or tests/
- No `from '@/pages/PortfolioCategoryPage'` in src/ or tests/

### Replacements ✅
- Portfolio component imports → `@/components/articles/`
- Portfolio page imports → `@/pages/ArticlePage` / `@/pages/ArticleCategoryPage`

### BlockRenderer props ✅
- `caseGradient` → `articleGradient`
- `caseTitle` → `articleTitle`

---

## Tasks (all done prior session + verified 2026-04-05)

1. **T34 ✅:** Deleted `tests/integration/portfolioCategoryPage.test.tsx` (stale import from `@/pages/PortfolioCategoryPage`). Deleted `src/components/portfolio/` and page files (done in earlier phases).
2. **T35 ✅:** Fixed `NotFound.tsx` JSDoc comment (old: `PortfolioCategoryPage` / `PortfolioCasePage` → new: `ArticlePage` / `ArticleCategoryPage`). Fixed `tests/integration/portfolioFilter.test.tsx` mock path (`@/components/ui/portfolio/PortfolioCard` → `@/components/articles/ArticleCard`) and pagination button labels (test now matches ArticleGrid hardcoded `'Вперёд →'` / `'← Назад'`). Fixed `tests/integration/routes.test.tsx` expected heading (`'Наши работы'` → `'Портфолио'`).
3. **T36 ✅:** `pnpm typecheck` — zero errors. `pnpm lint` — zero issues. Integration tests 43/43 passing.
