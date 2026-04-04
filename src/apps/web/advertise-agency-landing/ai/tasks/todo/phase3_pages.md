# Phase 3: Move & Rename Portfolio Pages

**Tasks:** T20–T25 (6) | **Depends on:** Phase 2 ✅
**Parent index:** `20260401_generalArticleMechanism.md`

## Architecture Context

### ArticlePage.tsx template (`src/pages/ArticlePage.tsx`)

Read `articleMap` by slug, render type-specific sections:

```tsx
import { useParams } from 'react-router';
import { articleMap, type ArticleType } from '@/types/articles/allArticles';
import { Container } from '@/components/layout/Container';
import { BreadCrumbs } from '@/components/ui/navigation/BreadCrumbs';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { NotFound } from '@/pages/NotFound';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { siteData } from '@/types/config/siteData';
import { PortfolioOverview } from '@/components/articles/PortfolioOverview';
import { ArticleAuthor } from '@/components/articles/ArticleAuthor';
import { NewsSource } from '@/components/articles/NewsSource';
import { ArticleCTA } from '@/components/articles/ArticleCTA';

const ROUTE_PATH: Record<ArticleType, string> = {
  portfolio: '/portfolio', service: '/services', news: '/news', blog: '/blog',
};
const ROUTE_LABEL: Record<ArticleType, string> = {
  portfolio: 'Портфолио', service: 'Услуги', news: 'Новости', blog: 'Блог',
};

export function ArticlePage() {
  const { categorySlug, year, month, slug } = useParams();
  const article = slug ? articleMap[slug] : undefined;
  useDocumentTitle(article ? `${article.title} — ${siteData.name}` : siteData.name);
  if (!article) return <NotFound backLabel="Back" backHref="/portfolio" />;

  const breadcrumbs = [
    { label: siteData.homeLabel, href: '/' },
    { label: ROUTE_LABEL[article.type], href: ROUTE_PATH[article.type] },
    ...(article.category && article.type !== 'news' && article.type !== 'blog'
      ? [{ label: article.category, href: `${ROUTE_PATH[article.type]}/${article.category}` }]
      : []),
    { label: article.title },
  ];

  return (
    <div id="main-content" tabIndex={-1} className="min-h-screen bg-background font-sans text-foreground">
      <BreadCrumbs items={breadcrumbs} />
      <ArticleHero hero={article.hero} category={article.category} title={article.title} description={article.description} />
      {article.type === 'portfolio' && <PortfolioOverview overview={article.overview} />}
      {article.author && <ArticleAuthor author={article.author} />}
      {article.type === 'news' && <NewsSource source={article.source} />}
      <Container>
        {article.content.map((block, i) => (
          <BlockRenderer key={`${block.__component}-${i}`} block={block} articleGradient={article.hero.gradient} articleTitle={article.title} />
        ))}
      </Container>
      <ArticleCTA />
    </div>
  );
}
export default ArticlePage;
```

### Current route refs in `src/routes.ts`
- `PortfolioCategoryPage.tsx` → becomes `ArticleCategoryPage.tsx`
- `PortfolioCasePage.tsx` → becomes `ArticlePage.tsx`

### Tests to move
- `src/pages/PortfolioCasePage.test.tsx` → `ArticlePage.test.tsx`
- `src/pages/PortfolioCategoryPage.test.tsx` → `ArticleCategoryPage.test.tsx`

---

## Tasks

1. **T20:** Move `PortfolioCasePage.tsx` → `ArticlePage.tsx`; rename component; use `articleMap` + `article.type` for conditional rendering; update all imports to `@/components/articles/`
2. **T21:** Move `PortfolioCategoryPage.tsx` → `ArticleCategoryPage.tsx`; rename component; update import to `@/components/articles/PortfolioGrid`
3. **T22:** Create `ArticleListPage.tsx` — generic listing page with type detection from route param, filters `allArticles` by type, pagination
4. **T23:** Move `PortfolioCasePage.test.tsx` → `ArticlePage.test.tsx`; update mocks/imports; add type-specific tests
5. **T24:** Move `PortfolioCategoryPage.test.tsx` → `ArticleCategoryPage.test.tsx`; update mocks/imports
6. **T25:** Update `src/routes.ts`:

```typescript
// Portfolio (now using article pages)
{ id: 'portfolio-all', path: 'portfolio', file: './pages/ArticleCategoryPage.tsx' },
{ id: 'portfolio-category', path: 'portfolio/:categorySlug', file: './pages/ArticleCategoryPage.tsx' },
{ path: 'portfolio/:categorySlug/:year/:month/:slug', file: './pages/ArticlePage.tsx' },
// New article routes
{ path: 'services/:slug', file: './pages/ArticlePage.tsx' },
{ id: 'news', path: 'news', file: './pages/ArticleListPage.tsx' },
{ path: 'news/:year/:month/:slug', file: './pages/ArticlePage.tsx' },
{ id: 'blog', path: 'blog', file: './pages/ArticleListPage.tsx' },
{ path: 'blog/:year/:month/:slug', file: './pages/ArticlePage.tsx' },
```

## Validation
- `pnpm typecheck` passes
- Routes compile with `react-router build`
