# Phase 6: Cleanup & Verification

**Tasks:** T34–T36 (3) | **Depends on:** Phases 2–5 ✅
**Parent index:** `20260401_generalArticleMechanism.md`

## What must NOT exist after this phase

### Deleted paths
- `src/components/portfolio/` (whole directory)
- `src/pages/PortfolioCasePage.tsx`
- `src/pages/PortfolioCasePage.test.tsx`
- `src/pages/PortfolioCategoryPage.tsx`
- `src/pages/PortfolioCategoryPage.test.tsx`

### Stale import patterns (must not remain)
- `from '@/components/portfolio/...`
- `from '@/pages/PortfolioCasePage'`
- `from '@/pages/PortfolioCategoryPage'`

### Replacements
- Portfolio component imports → `@/components/articles/`
- Portfolio page imports → `@/pages/ArticlePage` / `@/pages/ArticleCategoryPage`

### BlockRenderer props (already renamed in Phase 2 per T18)
- `caseGradient` → `articleGradient`
- `caseTitle` → `articleTitle`

---

## Tasks

1. **T34:** Delete `src/components/portfolio/` and `src/pages/PortfolioCasePage.tsx`, `src/pages/PortfolioCategoryPage.tsx`, plus their `.test.tsx` files
2. **T35:** Grep for stale imports — `@/components/portfolio/`, `@/pages/PortfolioCasePage`, `@/pages/PortfolioCategoryPage`; update any remaining references
3. **T36:** `pnpm typecheck` — zero errors; `pnpm lint` — zero issues
