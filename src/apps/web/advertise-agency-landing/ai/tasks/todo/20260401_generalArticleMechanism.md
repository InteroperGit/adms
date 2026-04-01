# PDR — Generalized Article Mechanism

**Date:** 2026-04-01  
**Status:** Pending  
**Related:** `portfolioStructure.md`, `blocks.md`, `typesStructure.md`

---

## Overview

Generalize the **Portfolio Case page mechanism** into a reusable **Article Engine** supporting multiple content types: portfolio cases, service articles, news, blog posts, and future types.

**Current Portfolio Case features:**
- Nested folder structure by category/year/month
- Glob-loaded JSON with Zod validation
- Block-based content rendering (15+ block types)
- Hero + Overview + CTA page structure
- Category filtering and routing
- SEO metadata injection

This PDR defines a **generic article abstraction** that preserves all existing portfolio functionality while enabling new content types with minimal duplication.

---

## Goals

1. **Single source of truth** — One `BaseArticleSchema` that all content types extend
2. **Shared rendering logic** — One `ArticlePage` component used by all article types
3. **Type-specific customization** — Custom fields per type (`overview` for portfolio, `publishedAt`/`source` for news)
4. **Backwards compatible** — Existing portfolio cases work without migration
5. **Extensible** — New types added via schema + data folder, no core changes

## Non-Goals

- Migrating existing portfolio JSON files
- Removing/renaming existing portfolio components
- Building UI for multiple content types (architecture only)

---

## Architecture

### 1. Generic Article Schema (`src/types/articles/article.ts`)

```typescript
import { z } from 'zod';
import { ContentBlockSchema } from '@/types/blocks';

export const BaseArticleSchema = z.object({
  slug: z.string(),
  publishedAt: z.string(), // ISO datetime (e.g., "2024-08-01T00:00:00Z")
  updatedAt: z.string().optional(),
  title: z.string(),
  description: z.string(),
  hero: z.object({
    image: z.string().optional(),
    gradient: z.string(),
  }),
  tags: z.array(z.string()),
  category: z.string(),
  author: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    title: z.string().optional(),
  }).optional(),
  readTime: z.number().optional(),
  meta: z.object({
    title: z.string(),
    description: z.string(),
    ogUrl: z.string().optional(),
    ogImage: z.string().optional(),
  }),
  content: z.array(ContentBlockSchema),
  images: z.object({
    preview: z.string().optional(),
    og: z.string().optional(),
  }).optional(),
});

export type BaseArticle = z.infer<typeof BaseArticleSchema>;

// ArticleType is inferred from file path, not from JSON
export type ArticleType = 'portfolio' | 'service' | 'news' | 'blog';
```

### 2. Extended Article Types

Each content type extends `BaseArticleSchema` with type-specific fields:

**Portfolio Article** (`src/types/articles/portfolioArticle.ts`):
```typescript
export const PortfolioArticleSchema = BaseArticleSchema.extend({
  overview: z.object({
    client: z.string(),
    year: z.string(),
    services: z.string(),
  }),
});
export type PortfolioArticle = z.infer<typeof PortfolioArticleSchema>;
```

**Service Article** (`src/types/articles/serviceArticle.ts`):
```typescript
export const ServiceArticleSchema = BaseArticleSchema;
export type ServiceArticle = BaseArticle;
```

**News Article** (`src/types/articles/newsArticle.ts`):
```typescript
export const NewsArticleSchema = BaseArticleSchema.extend({
  source: z.string().optional(),
});
export type NewsArticle = z.infer<typeof NewsArticleSchema>;
```

**Blog Article** (`src/types/articles/blogArticle.ts`):
```typescript
export const BlogArticleSchema = BaseArticleSchema;
export type BlogArticle = BaseArticle;
```

### 3. Unified Article Loader (`src/types/articles/allArticles.ts`)

```typescript
import type { BaseArticle, ArticleType } from './article';
import { PortfolioArticleSchema, ServiceArticleSchema, NewsArticleSchema, BlogArticleSchema } from '.';

const ARTICLE_SCHEMAS = {
  portfolio: PortfolioArticleSchema,
  service: ServiceArticleSchema,
  news: NewsArticleSchema,
  blog: BlogArticleSchema,
} as const;

const ARTICLE_TYPE_PATTERN = /^(?<type>portfolio|service|news|blog)(?:\/(?<category>[^/]+))?\/(?<year>\d{4})\/(?<month>\d{2})\/\d{4}_\d{2}_\d{2}_(?<slug>[^/]+)\.json$/;

interface ArticleModule {
  publishedAt?: string;
  slug?: string;
  [key: string]: unknown;
}

interface ParsedPath {
  type: ArticleType;
  category?: string;
  year: string;
  month: string;
  slug: string;
}

const parseArticlePath = (filePath: string): ParsedPath | null => {
  const match = ARTICLE_TYPE_PATTERN.exec(filePath);
  if (!match?.groups) return null;
  
  return {
    type: match.groups.type as ArticleType,
    category: match.groups.category,
    year: match.groups.year,
    month: match.groups.month,
    slug: match.groups.slug,
  };
};

const modules = import.meta.glob<ArticleModule>(['@data/articles/**/**/*.json', '@data/portfolio/**/**/*.json'], {
  eager: true,
  import: 'default',
});

const normalizeArticle = (rawData: ArticleModule, filePath: string): [string, BaseArticle & { type: ArticleType }] | null => {
  const pathInfo = parseArticlePath(filePath);
  if (!pathInfo) return null;
  
  if (!rawData.publishedAt) {
    throw new Error(`Missing required field "publishedAt" in ${filePath}`);
  }
  
  const parsed = ARTICLE_SCHEMAS[pathInfo.type].parse(rawData) as BaseArticle & { type: ArticleType };
  parsed.type = pathInfo.type;
  
  return [parsed.slug, parsed];
};

export const articleMap: Record<string, BaseArticle & { type: ArticleType }> = Object.fromEntries(
  Object.entries(modules)
    .map(([path, data]) => normalizeArticle(data, path))
    .filter((x): x is [string, BaseArticle & { type: ArticleType }] => x !== null)
);

export const allArticles = Object.values(articleMap);
export const allPortfolioArticles = allArticles.filter(a => a.type === 'portfolio');
export const allServiceArticles = allArticles.filter(a => a.type === 'service');
export const allNewsArticles = allArticles.filter(a => a.type === 'news');
export const allBlogArticles = allArticles.filter(a => a.type === 'blog');
```

### 4. Data Folder Structure

```
data/
├── articles/
│   ├── portfolio/
│   │   └── {category}/
│   │       └── {year}/
│   │           └── {month}/
│   │               └── {yyyy_mm_dd}_{slug}.json
│   ├── service/
│   │   └── {category}/
│   │       └── {year}/
│   │           └── {month}/
│   │               └── {yyyy_mm_dd}_{slug}.json
│   ├── news/
│   │   └── {year}/
│   │       └── {month}/
│   │           └── {yyyy_mm_dd}_{slug}.json
│   └── blog/
│       └── {year}/
│           └── {month}/
│               └── {yyyy_mm_dd}_{slug}.json
└── config/
    ├── articleTypes.json (new — type labels, icons)
    └── categories.json (existing — categories for portfolio + service)
```

**Example: `data/articles/service/seo/2026/04/2026_04_01_seo-basics.json`** (route: `/services/seo/2026/04/seo-basics`):
```json
{
  "slug": "seo-basics",
  "publishedAt": "2026-04-01T00:00:00Z",
  "title": "SEO Guide: Basics for Small Business",
  "description": "Learn the fundamentals of search engine optimization.",
  "hero": {
    "image": "/images/articles/seo/hero.jpg",
    "gradient": "from-emerald-600 to-teal-500"
  },
  "category": "seo",
  "tags": ["SEO", "Marketing", "Guide"],
  "author": {
    "name": "Иван Петров",
    "avatar": "/images/team/ivan.jpg",
    "title": "Head of SEO"
  },
  "readTime": 8,
  "meta": {
    "title": "SEO Guide: Basics — Рекламастер",
    "description": "Learn the fundamentals of search engine optimization.",
    "ogUrl": "https://example.ru/services/seo/seo-basics",
    "ogImage": "/images/articles/seo/og.jpg"
  },
  "content": [
    { "__component": "heading", "level": 2, "text": "What is SEO?" },
    { "__component": "paragraph", "text": "Search engine optimization..." }
  ]
}
```

**Example: `data/articles/news/2026/04/2026_04_01_company-update.json`** (route: `/news/2026/04/company-update`):
```json
{
  "slug": "company-update",
  "publishedAt": "2026-04-01T10:00:00Z",
  "title": "Company Update: Q1 2026",
  "description": "Key milestones and achievements from Q1.",
  "hero": {
    "gradient": "from-blue-600 to-cyan-500"
  },
  "tags": ["Company", "News"],
  "source": "Internal",
  "meta": {
    "title": "Q1 2026 Update — Рекламастер",
    "description": "Key milestones from Q1."
  },
  "content": [
    { "__component": "paragraph", "text": "We're excited to share..." }
  ]
}
```

**Example: Existing portfolio case** `data/content/portfolio/branding/2023/03/2023_03_01_artplex.json` (route: `/portfolio/branding/2023/03/artplex`):
```json
{
  "slug": "artplex",
  "publishedAt": "2023-03-01T00:00:00Z",
  "title": "Фирменный стиль кинотеатра ArtPlex",
  ...
}
```

### 5. Generic Article Page (`src/pages/ArticlePage.tsx`)

```typescript
import { useParams } from 'react-router';
import { articleMap, type ArticleType } from '@/types/articles/allArticles';
import type { BaseArticle } from '@/types/articles/article';
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
  portfolio: '/portfolio',
  service: '/services',
  news: '/news',
  blog: '/blog',
};

const ROUTE_LABEL: Record<ArticleType, string> = {
  portfolio: 'Портфолио',
  service: 'Услуги',
  news: 'Новости',
  blog: 'Блог',
};

export function ArticlePage() {
  const { type, categorySlug, year, month, slug } = useParams<{
    type: ArticleType;
    categorySlug?: string;
    year: string;
    month: string;
    slug: string;
  }>();
  
  const article = slug ? articleMap[slug] : undefined;
  
  useDocumentTitle(article ? `${article.title} — ${siteData.name}` : siteData.name);
  
  if (!article || (type && article.type !== type)) {
    return <NotFound backLabel="Back" backHref={ROUTE_PATH[type]} />;
  }
  
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
          <BlockRenderer
            key={`${block.__component}-${i}`}
            block={block}
            articleGradient={article.hero.gradient}
            articleTitle={article.title}
          />
        ))}
      </Container>
      
      <ArticleCTA />
    </div>
  );
}

export default ArticlePage;
```

### 6. Reusable Components (`src/components/articles/`)

```
src/components/articles/
├── ArticleHero.tsx       — hero image/gradient, category badge, title, description
├── ArticleAuthor.tsx     — author: name, avatar, title (conditional)
├── ArticleCTA.tsx        — CTA section (data-driven)
├── PortfolioOverview.tsx — client, year, services grid (portfolio-only)
├── NewsSource.tsx        — source badge (news-only)
└── index.ts              — barrel exports
```

### 7. Routes (`src/routes.ts`)

```typescript
export default [
  {
    file: './App.tsx',
    children: [
      // Existing portfolio routes (preserved)
      { id: 'portfolio-all', path: 'portfolio', file: './pages/PortfolioCategoryPage.tsx' },
      { id: 'portfolio-category', path: 'portfolio/:categorySlug', file: './pages/PortfolioCategoryPage.tsx' },
      { path: 'portfolio/:categorySlug/:year/:month/:caseSlug', file: './pages/PortfolioCasePage.tsx' },
      
      // New article routes
      { id: 'services', path: 'services', file: './pages/ArticleListPage.tsx' },
      { id: 'services-category', path: 'services/:categorySlug', file: './pages/ArticleCategoryPage.tsx' },
      { path: 'services/:categorySlug/:year/:month/:slug', file: './pages/ArticlePage.tsx' },
      
      { id: 'news', path: 'news', file: './pages/ArticleListPage.tsx' },
      { path: 'news/:year/:month/:slug', file: './pages/ArticlePage.tsx' },
      
      { id: 'blog', path: 'blog', file: './pages/ArticleListPage.tsx' },
      { path: 'blog/:year/:month/:slug', file: './pages/ArticlePage.tsx' },
      
      // Other routes (legal, 404, etc.)
    ],
  },
] satisfies RouteConfig;
```

### 8. SSG Prerender Config (`react-router.config.ts`)

```typescript
import type { Config } from '@react-router/dev/config';
import { articleMap } from './src/types/articles/allArticles';
import { extractYearMonth } from '@/libs/dateUtils';

export default {
  ssr: false,
  prerender: async () => {
    const staticRoutes = [
      '/portfolio',
      '/portfolio/branding',
      '/services',
      '/news',
      '/blog',
    ];
    
    const dynamicRoutes = Object.values(articleMap).map((a) => {
      const { year, month } = extractYearMonth(a.publishedAt);
      const basePath = ROUTE_PATH[a.type];
      const hasCategory = a.type === 'portfolio' || a.type === 'service';
      const categoryPath = hasCategory ? `${a.category}/` : '';
      return `${basePath}/${categoryPath}${year}/${month}/${a.slug}`;
    });
    
    return [...staticRoutes, ...dynamicRoutes];
  },
} satisfies Config;
```

---

## Implementation Plan

### Phase 0: Migration — Rename `publishDate` → `publishedAt` (4 tasks)
1. **T0.1:** Update `data/content/_schema/portfolio.schema.json` — rename `publishDate` to `publishedAt`, require ISO datetime format
2. **T0.2:** Update all existing portfolio JSON files — rename `publishDate` to `publishedAt` (script or manual)
3. **T0.3:** Update `ai/docs/*.md` — update documentation examples to use `publishedAt`
4. **T0.4:** Verify `pnpm validate` passes with updated schema
q
### Phase 1: Core Types & Schemas (6 tasks)
5. **T1:** Create `src/types/articles/article.ts` — `BaseArticleSchema` (with `publishedAt` required)
6. **T2:** Create `src/types/articles/portfolioArticle.ts` — extends base with `overview`
7. **T3:** Create `src/types/articles/serviceArticle.ts` — alias to `BaseArticleSchema`
8. **T4:** Create `src/types/articles/newsArticle.ts` — extends base with `source`
9. **T5:** Create `src/types/articles/blogArticle.ts` — alias to `BaseArticleSchema`
10. **T6:** Create `src/types/articles/allArticles.ts` — loader with path-based type inference
11. **T7:** Update `scripts/generate-json-schemas.ts` — generate JSON Schema for all article types

### Phase 2: Shared Components (6 tasks)
8. **T8:** Create `src/components/articles/ArticleHero.tsx` — extract from `CaseHero`
9. **T9:** Create `src/components/articles/ArticleCTA.tsx` — generic CTA with data-driven copy
10. **T10:** Create `src/components/articles/PortfolioOverview.tsx` — adapt `CaseOverview`
11. **T11:** Create `src/components/articles/ArticleAuthor.tsx` — author name + avatar
12. **T12:** Create `src/components/articles/NewsSource.tsx` — source badge
13. **T13:** Update `BlockRenderer.tsx` — rename props (`caseGradient` → `articleGradient`, `caseTitle` → `articleTitle`)

### Phase 3: Article Pages (4 tasks)
15. **T15:** Create `src/pages/ArticlePage.tsx` — generic detail page with type-specific rendering
16. **T16:** Create `src/pages/ArticleListPage.tsx` — listing by type with pagination
17. **T17:** Create `src/pages/ArticleCategoryPage.tsx` — category-filtered listing
18. **T18:** Update `src/routes.ts` — add article routes (`/articles/:type/...`)

### Phase 4: Data & Config (3 tasks)
19. **T19:** Create `data/config/articleTypes.json` — type labels, icons
20. **T20:** Create example data files:
    - `data/articles/service/seo/2026/04/2026_04_01_seo-basics.json`
    - `data/articles/news/2026/04/2026_04_01_company-update.json`
    - `data/articles/blog/2026/04/2026_04_01_design-trends.json`
21. **T21:** Update `.vscode/settings.json` — `fileMatch` patterns for new article types

### Phase 5: SSG & Build (4 tasks)
22. **T22:** Update `react-router.config.ts` — prerender article routes
23. **T23:** Update `src/plugins/seoMetaPlugin.ts`:
    - Add `handleServicePage()`, `handleNewsPage()`, `handleBlogPage()` functions
    - Update route regex to match `/services/:category/:year/:month/:slug`, `/news/:year/:month/:slug`, `/blog/:year/:month/:slug`
    - Keep existing `handleCasePage()` for portfolio (works for both old and new routes)
    - Load article data from `articleMap` (includes both old portfolio cases and new articles)
    - Inject type-specific JSON-LD: `Article` for services/blog, `NewsArticle` for news, `Article` for portfolio
24. **T24:** Update `src/plugins/incrementalSSGPlugin.ts` — cache article data
25. **T25:** Test incremental SSG cache — verify restore/save for articles

### Phase 6: Backwards Compatibility (2 tasks)
25. **T25:** Verify `PortfolioCasePage.tsx` — continues working unchanged
26. **T26:** Test existing portfolio routes — all resolve correctly

### Phase 7: Documentation & QA (4 tasks)
27. **T27:** Create `ai/docs/articles.md` — new documentation
28. **T28:** Update `ai/docs/dataArchitecture.md` — article data structure
29. **T29:** Run `pnpm build && pnpm typecheck` — verify build
30. **T30:** Manual QA — test article pages, navigation, dark mode, SEO meta

---

## Future Extensions (Out of Scope)

- RSS/Atom feeds for news and blog articles
- Author pages listing all articles by an author
- Related articles widget based on tags/category
- Search across all article types
- Multi-language article content (i18n)
- Draft/published workflow with `draft: true` field
- Scheduled publishing based on `publishedAt` (future-dated articles hidden until date)

---

## Testing Strategy

**Unit Tests**
- Each extended schema validates correctly
- `articleMap` loads and parses all types
- Components: `PortfolioOverview`, `ArticleAuthor`, `ArticleMeta`, `NewsSource`

**Integration Tests**
- `ArticlePage` renders each article type correctly
- `ArticleListPage` filters by type and category
- Breadcrumbs render correctly per type

**E2E Tests**
- Navigate to article pages via links
- Dark mode works on article pages
- SEO meta tags in built HTML
- 404 for unknown slugs

---

## Migration Notes

**Phase 0 must be completed first** — all portfolio JSON files must be updated to use `publishedAt`.

**After Phase 0:**
- All existing portfolio cases use `publishedAt` (ISO datetime format)
- No migration logic needed in loader
- `PortfolioCasePage.tsx` becomes a thin wrapper around `ArticlePage`

---

## Success Criteria

- [ ] All 34 tasks complete (4 migration + 30 implementation)
- [ ] All portfolio JSON files use `publishedAt` (ISO datetime)
- [ ] `pnpm build && pnpm typecheck` passes
- [ ] Existing portfolio pages render identically
- [ ] Service, news, blog articles render correctly
- [ ] SEO meta tags injected for all types
- [ ] Dark mode works on all article pages
- [ ] Incremental SSG cache works for articles

---

## Appendix: Comparison Table

| Feature | Portfolio | Service | News | Blog |
|---------|-----------|---------|------|------|
| Route | `/portfolio/...` | `/services/...` | `/news/...` | `/blog/...` |
| Category | ✅ | ✅ | ❌ | ❌ |
| `overview` | ✅ | ❌ | ❌ | ❌ |
| `author` | optional | optional | optional | optional |
| `source` | ❌ | ❌ | ✅ | ❌ |

---

## Related Files

- `src/types/portfolio/` — Portfolio types
- `src/types/articles/` — Article types (base + extensions)
- `src/pages/ArticlePage.tsx` — Generic article page
- `src/components/articles/` — Shared components
- `src/components/blocks/BlockRenderer.tsx` — Block renderer
- `src/routes.ts` — Routes
- `react-router.config.ts` — SSG prerender
- `ai/docs/portfolioStructure.md` — Portfolio docs
- `ai/docs/articles.md` — Article docs (new)
