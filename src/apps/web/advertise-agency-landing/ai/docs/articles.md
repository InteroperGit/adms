# Article Engine — Unified Content System (Phase 7, April 2026)

## Overview

The article engine is a reusable content system that renders four article types — **portfolio**, **service**, **news**, **blog** — through shared page templates and components. All article types share a common `BaseArticleSchema` with type-specific extensions, and are loaded via a unified glob pattern from `src/types/articles/allArticles.ts`.

This system replaced the legacy portfolio-only mechanism. `PortfolioCasePage.tsx` and `src/components/portfolio/` have been deleted.

## Directory Structure

```
data/content/
├── portfolio/          # Portfolio cases
│   └── {category}/
│       └── {year}/
│           └── {month}/
│               └── {yyyy_mm_dd}_{slug}.json
├── services/           # Service detail pages
│   └── {slug}.json
├── news/               # News articles
│   └── {year}/
│       └── {slug}.json
├── blog/               # Blog articles
│   └── {year}/
│       └── {slug}.json
└── config/
    ├── articleTypes.json      # Type registry (labels, paths, icons)
    ├── categories.json        # Portfolio categories
    ├── portfolioConfig.json   # Portfolio listing config
    ├── news.json              # News listing config (gridDescription, emptyLabel)
    ├── blog.json              # Blog listing config (gridDescription, emptyLabel)
    └── defaultArticleCta.json # Fallback CTA for article pages
```

## Schema Architecture

### BaseArticleSchema (`src/types/articles/article.ts`)

Every article type extends this schema. Required fields:

| Field | Type | Notes |
|---|---|---|
| `slug` | string | Unique identifier, used for route lookup |
| `publishedAt` | string | ISO datetime (e.g., `"2024-08-01T00:00:00Z"`) |
| `updatedAt` | string (opt) | Last modification ISO datetime |
| `title` | string | Article title / H1 |
| `description` | string | Short description (1-2 sentences) |
| `hero` | object | `image?` (string), `gradient` (Tailwind class) |
| `tags` | string[] | Keywords/tags |
| `category` | string | Category name (portfolio) or type label |
| `author` | object (opt) | `name`, `avatar?`, `title?` |
| `readTime` | number (opt) | Estimated reading time in minutes |
| `meta` | object | `title`, `description`, `ogUrl?`, `ogImage?` |
| `content` | ContentBlock[] | Array of content blocks (see [`blocks.md`](./blocks.md)) |
| `cta` | object (opt) | `title`, `subtitle`, `label`, `href` — falls back to `defaultArticleCta.json` |
| `images` | object (opt) | `preview?`, `og?` |

### Extended Schemas

| Type | File | Extra fields |
|---|---|---|
| **Portfolio** | `portfolioArticle.ts` | `overview` — `{ client, year, services }` |
| **Service** | `serviceArticle.ts` | None (alias to BaseArticleSchema) |
| **News** | `newsArticle.ts` | `source` (optional string) |
| **Blog** | `blogArticle.ts` | None (alias to BaseArticleSchema) |

**ArticleType** is determined from the `type` field in each JSON file (`"portfolio"`, `"service"`, `"news"`, or `"blog"`), not from the file path.

## Article Loader (`src/types/articles/allArticles.ts`)

Glob-loads all article JSON across the four directories simultaneously:

```typescript
const modules = import.meta.glob<ArticleModule>(
  [
    '@data/portfolio/**/*.json',
    '@data/services/**/*.json',
    '@data/news/**/*.json',
    '@data/blog/**/*.json',
  ],
  { eager: true, import: 'default' }
);
```

Each file is validated against its type-specific schema from `ARTICLE_SCHEMAS`. Results are stored in:

- `articleMap` — `Record<string, BaseArticle>` keyed by `slug` (used by `ArticlePage` for route-based lookup)
- `allArticles` — flat array of all articles
- `allPortfolioArticles`, `allServiceArticles`, `allNewsArticles`, `allBlogArticles` — type-filtered arrays

## Page Templates

### ArticlePage (`src/pages/ArticlePage.tsx`)

Detail page for a single article. Route pattern matches `/:categorySlug?/:year?/:month?/:slug`.

**Lookup:** Reads `slug` from URL params, looks up in `articleMap` by slug. Returns 404 if not found.

**Render chain (in order):**
1. `BreadCrumbs` — type-specific path (Home → [Type Label] → [Portfolio Category] → Article Title)
2. `ArticleHero` — hero banner with gradient, category, title, description
3. `PortfolioOverview` — **only for portfolio type** (client, year, services)
4. Author byline — **only if `article.author` present**
5. Source attribution — **only if `article.type === 'news'` and `source` present**
6. `BlockRenderer` — iterates `article.content`, renders each block with `articleGradient` and `articleTitle` props
7. `ArticleCTA` — uses article's `cta` or falls back to `defaultArticleCta`

### ArticleCategoryPage (`src/pages/ArticleCategoryPage.tsx`)

Category listing page with filtering and pagination. Used for portfolio categories.

**Type detection:** Extracts type from URL path segment (`portfolio`, `news`, or `blog`).

**TYPE_REGISTRY** maps each type to its config:
- `label`, `basePath`, `items`, `hasCategories`, `perPage`, `emptyLabel`, `gridDescription`

Portfolio supports category filtering via `CategoryNav` + animated pill. News/blog render flat lists.

### ArticleListPage (`src/pages/ArticleListPage.tsx`)

Simple paginated list for `/news` and `/blog` root routes. Renders `<Link>` cards with title + description.

## Routes (`src/routes.ts`)

| Route | Component | Description |
|---|---|---|
| `/portfolio` | ArticleCategoryPage | All portfolio (with category nav) |
| `/portfolio/:categorySlug` | ArticleCategoryPage | Portfolio filtered by category |
| `/portfolio/:categorySlug/:year/:month/:slug` | ArticlePage | Portfolio case detail |
| `/services/:slug` | ArticlePage | Service detail page |
| `/news` | ArticleListPage | News listing |
| `/news/:year/:month/:slug` | ArticlePage | News article detail |
| `/blog` | ArticleListPage | Blog listing |
| `/blog/:year/:month/:slug` | ArticlePage | Blog article detail |

## Component Contracts

### Article-specific (`src/components/articles/`)

| Component | Props | Purpose |
|---|---|---|
| `ArticleHero` | `hero`, `category`, `title`, `description` | Hero banner with gradient background |
| `ArticleCTA` | `title`, `subtitle`, `label`, `href` | Bottom CTA section |
| `ArticleGrid` | `items`, `articleHref`, `detailsLabel`, `basePath`, `cta?`, `emptyLabel`, `perPage`, `categories?`, `allLabel`, `activeSlug` | Grid layout with `ArticleCard` + `CategoryNav` + `Pagination` |
| `ArticleCard` | `article`, `href`, `detailsLabel` | Card with gradient hero, title, description, tags, href |
| `PortfolioOverview` | `client`, `category`, `year`, `services` | Portfolio-specific overview stats |
| `CategoryNav` | `items`, `categories`, `allLabel`, `activeSlug` | Animated pill tab navigation for categories |
| `Pagination` | `current`, `total`, `prevLabel`, `nextLabel`, `pageLabel`, `onPrev`, `onNext` | Pagination controls |

### Shared Blocks

Content blocks are rendered by `BlockRenderer` from `src/components/blocks/BlockRenderer.tsx`. See [`blocks.md`](./blocks.md) for the complete block type reference.

## Adding a New Article Type

1. **Define the schema** — Extend `BaseArticleSchema` in `src/types/articles/{type}Article.ts` (or alias it if no extra fields)

2. **Register the loader** — Add the schema to `ARTICLE_SCHEMAS` in `allArticles.ts` and create a filtered export (`all{Type}Articles`)

3. **Add to the union** — Update `ArticleTypeSchema` enum in `article.ts` with the new type name

4. **Add config** — Create `data/config/{type}Config.json` with `emptyLabel` and `gridDescription`. Add config loader in `src/types/config/`

5. **Add routes** — Add route entries in `src/routes.ts` for listing and detail pages. Update `prerender()` in `react-router.config.ts` for SSG.

6. **Update page templates:**
   - `ArticlePage.tsx` — Add type-specific rendering blocks (like PortfolioOverview, author byline, source). Update `ROUTE_PATH` and `ROUTE_LABEL` maps.
   - `ArticleListPage.tsx` — Add to `ARTICLES_BY_TYPE` and `TYPE_LABEL` maps. Optionally add to `GRID_DESCRIPTION_MAP`.
   - `ArticleCategoryPage.tsx` — Add to `TYPE_REGISTRY` with config for listing behavior.

7. **Update SEO meta plugin** — Ensure `src/plugins/seoMetaPlugin.ts` handles the new type's route patterns.

8. **Update incremental SSG** — Add type to cache key in `src/plugins/incrementalSSG.ts`.

9. **Write tests** — Create integration and unit tests for the new type. See [`integrationTests.md`](./integrationTests.md) and [`unitTests.md`](./unitTests.md).

## SSG Integration

- Static meta plugin (`src/plugins/seoMetaPlugin.ts`) pre-builds a case file map during SSG initialization, injecting meta tags on article pages in `onPageRendered`.
- Incremental SSG cache (`src/plugins/incrementalSSG.ts`) includes article type in its cache key for proper cache invalidation.
- The `prerender()` function in `react-router.config.ts` generates all article routes at build time.

## Related Documentation

- [`blocks.md`](./blocks.md) — Content block types rendered in article body
- [`portfolioStructure.md`](./portfolioStructure.md) — Legacy portfolio structure (migrated to article engine)
- [`dataArchitecture.md`](./dataArchitecture.md) — Data directory layout, JSON schemas, new-client CLI
- [`typesStructure.md`](./typesStructure.md) — `src/types/` subfolder organization
- [`conventions.md`](./conventions.md) — File naming, import order, code style
