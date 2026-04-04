# Phase 2: Move & Rename Portfolio → Articles

**Tasks:** T8–T19 (12) | **Depends on:** Phase 1 ✅
**Parent index:** `20260401_generalArticleMechanism.md`

## Architecture Context

### Components to move (all in `src/components/portfolio/`)

| Source | Target | Rename |
|--------|--------|--------|
| `CaseHero.tsx` | `ArticleHero.tsx` | `CaseHero`→`ArticleHero`, `CaseHeroProps`→`ArticleHeroProps` |
| `CaseCTA.tsx` | `ArticleCTA.tsx` | `CaseCTA`→`ArticleCTA` |
| `CaseOverview.tsx` | `PortfolioOverview.tsx` | `CaseOverviewProps`→`PortfolioOverviewProps` |
| `CategoryNav.tsx` | `CategoryNav.tsx` | — |
| `Pagination.tsx` | `Pagination.tsx` | — |
| `PortfolioGrid.tsx` | `PortfolioGrid.tsx` | — |

### Tests to move

| Source | Target |
|--------|--------|
| `CaseHero.test.tsx` | `ArticleHero.test.tsx` |
| `CaseCTA.test.tsx` | `ArticleCTA.test.tsx` |
| `CaseOverview.test.tsx` | `PortfolioOverview.test.tsx` |
| `CategoryNav.test.tsx` | `CategoryNav.test.tsx` |
| `Pagination.test.tsx` | `Pagination.test.tsx` |
| `PortfolioGrid.test.tsx` | `PortfolioGrid.test.tsx` |

### Key component contracts

**ArticleHero** props: `{ hero: { image?: string; gradient: string }; category: string; title: string; description: string }`
- Image mode: `<OptimizedImage>` with `bg-neutral-900/60` overlay, content `relative z-10`
- Gradient mode: `bg-gradient-to-br` + `hero.gradient`

**PortfolioOverview** props: `{ client: string; category: string; year: string; services: string }`
- 4-item grid, labels from `portfolioCaseContent.overviewLabels`

**ArticleCTA** — no props, reads from `portfolioCaseContent.cta`

**CategoryNav** props: `{ activeSlug: string | null }`
- Uses `AnimatedPillTabs`, `categories`, `portfolioConfig.allLabel`

**PortfolioGrid** props: `{ items: PortfolioCase[]; activeSlug: string | null }`
- Uses `useSearchParams` for `?page`, `CategoryNav`, `PortfolioCard`, `Pagination`

### Consumers to update

- `src/pages/PortfolioCasePage.tsx` → imports from `@/components/portfolio/` → `@/components/articles/`
- `src/components/portfolio/PortfolioGrid.tsx` → internal imports
- `src/pages/PortfolioCategoryPage.tsx` → imports from `@/components/portfolio/`

### BlockRenderer.tsx prop rename

Props: `caseGradient` → `articleGradient`, `caseTitle` → `articleTitle`
Used by: `GalleryBlock` (alt text), `MetricsBlock`, `CardsBlock`, `ChartBlock`, `ProgressChart`

### Target directory structure

```
src/components/articles/
├── ArticleHero.tsx       (renamed from CaseHero)
├── ArticleAuthor.tsx     (new — Phase 1 types exist)
├── ArticleCTA.tsx        (renamed from CaseCTA)
├── CategoryNav.tsx       (moved)
├── Pagination.tsx        (moved)
├── PortfolioGrid.tsx     (moved)
├── PortfolioOverview.tsx (renamed from CaseOverview)
├── NewsSource.tsx        (new — Phase 1 types exist)
└── index.ts
```

---

## Tasks

1. **T8:** Move + rename `CaseHero.tsx` → `ArticleHero.tsx`; rename interface + JSDoc "case"→"article"
2. **T9:** Move + rename `CaseCTA.tsx` → `ArticleCTA.tsx`; rename export + JSDoc
3. **T10:** Move + rename `CaseOverview.tsx` → `PortfolioOverview.tsx`; rename interface + JSDoc
4. **T11:** Move `CategoryNav.tsx`
5. **T12:** Move `Pagination.tsx`
6. **T13:** Move `PortfolioGrid.tsx`; update internal imports to `@/components/articles/`
7. **T14:** Move `CaseHero.test.tsx` → `ArticleHero.test.tsx`
8. **T15:** Move `CaseCTA.test.tsx` → `ArticleCTA.test.tsx`
9. **T16:** Move `CaseOverview.test.tsx` → `PortfolioOverview.test.tsx`
10. **T17:** Move `CategoryNav.test.tsx`, `Pagination.test.tsx`, `PortfolioGrid.test.tsx`
11. **T18:** Update consumer imports: `PortfolioCasePage.tsx`, `PortfolioGrid.tsx` internal, `PortfolioCategoryPage.tsx`; rename `BlockRenderer.tsx` props
12. **T19:** Delete `src/components/portfolio/` directory

## Validation after T19
- `pnpm typecheck` passes
- No imports of `@/components/portfolio/` remain
