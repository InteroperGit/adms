# Phase 5: SSG & Build

**Tasks:** T30–T33 (4) | **Depends on:** Phase 3 ✅
**Parent index:** `20260401_generalArticleMechanism.md`

## Architecture Context

### react-router.config.ts — prerender()

```typescript
import type { Config } from '@react-router/dev/config';
import { articleMap } from './src/types/articles/allArticles';
import { extractYearMonth } from '@/libs/dateUtils';

const ROUTE_PATH = { portfolio: '/portfolio', service: '/services', news: '/news', blog: '/blog' };

export default {
  ssr: false,
  prerender: async () => {
    const staticRoutes = ['/portfolio', '/services', '/news', '/blog'];
    const dynamicRoutes = Object.values(articleMap).map((a) => {
      const { year, month } = extractYearMonth(a.publishedAt);
      const basePath = ROUTE_PATH[a.type];
      const hasCategory = a.type === 'portfolio';
      const categoryPath = hasCategory ? `${a.category}/` : '';
      return `${basePath}/${categoryPath}${year}/${month}/${a.slug}`;
    });
    return [...staticRoutes, ...dynamicRoutes];
  },
} satisfies Config;
```

### seoMetaPlugin.ts — key functions

- `handleCasePage()` rename to `handlePortfolioPage()` — parses `/portfolio/:category/:year/:month/:slug` 
- **NEW:** `handleServicePage()` — matches `/services/:slug`
- **NEW:** `handleNewsPage()` — matches `/news/:year/:month/:slug`
- **NEW:** `handleBlogPage()` — matches `/blog/:year/:month/:slug`
- All new handlers load data from `articleMap` by slug
- JSON-LD: `Article` for services/blog, `NewsArticle` for news, `Article` for portfolio

### incrementalSSGPlugin.ts
- Cache key should include article type; restore/save for all article routes

---

## Tasks

1. **T30:** ✅ Update `react-router.config.ts` — prerender() now generates service, news, and blog routes alongside portfolio.
2. **T31:** ✅ Add `handleServicePage`, `handleNewsPage`, `handleBlogPage` handlers via shared `handleGenericArticle` with appropriate JSON-LD types (Article/NewsArticle) and breadcrumbs.
3. **T32:** ✅ Added `buildArticleRouteDeps()` for service/news/blog routes, updated listing pages in `buildRouteDataMap`.
4. **T33:** ✅ Build passes, all routes verified in output.
