# Data Architecture

- All JSON data lives in `data/` at project root (NOT inside `src/`); alias `@data` → `./data`
- `tsconfig.app.json` has `"resolveJsonModule": true`
- **Components never import from `@data/` directly** — always go through `src/types/` or `src/lib/`
- Schema examples in `data/_schema/examples/` are git-tracked as **JSON** files (`.example.json`); actual data files are gitignored
- **JSON Schema files** (T8, March 2026): `pnpm gen-schemas` runs `scripts/generate-json-schemas.ts` → generates `data/_schema/schema/<name>.schema.json` per Zod schema using `z.toJSONSchema()` (Zod v4 built-in, no extra dep); also writes `.vscode/settings.json` for IDE schema mapping; object-root `.example.json` files have `"$schema": "../../schema/<name>.schema.json"` added
- **New-client CLI** (T8, March 2026): `pnpm new-client` runs `scripts/new-client.ts` → interactive readline CLI; prompts for agency info/colors (hex→HSL)/fonts; generates customised `site.json`, `theme.json`, `seo.json`, `header.json` + template copies of all other data files with `$schema` refs
- `tsconfig.app.json` `include` is `["src"]` only — no `data/_schema` (was removed when schemas converted to JSON)
- **Split**: pure interface+const files → `src/types/`; logic files (functions, glob) → `src/lib/`
- **Unified Article Engine** (Phase 7, April 2026): All content types (portfolio, service, news, blog) now share a common `BaseArticleSchema` with type-specific extensions. Articles are loaded via `src/types/articles/allArticles.ts` using a unified glob pattern across `@data/portfolio/**/*.json`, `@data/services/**/*.json`, `@data/news/**/*.json`, and `@data/blog/**/*.json`. Each JSON file must include a `type` field (`"portfolio"`, `"service"`, `"news"`, or `"blog"`) to route validation against the correct extended schema. Slug-based lookup replaces path-based routing in `ArticlePage.tsx`.

### Article Data Directory Structure

```
data/content/
├── portfolio/           # Portfolio cases (nested by category/year/month)
│   └── {category}/
│       └── {year}/
│           └── {month}/
│               └── {yyyy_mm_dd}_{slug}.json
├── services/            # Service detail pages (flat)
│   └── {slug}.json
├── news/                # News articles (flat by year)
│   └── {year}/
│       └── {slug}.json
└── blog/                # Blog articles (flat by year)
    └── {year}/
        └── {slug}.json
```

### Article Type Registry

- `articleMap` — `Record<string, BaseArticle>` in `allArticles.ts`, keyed by `slug`, used by `ArticlePage` for route-based lookup.
- Type-specific exports: `allPortfolioArticles`, `allServiceArticles`, `allNewsArticles`, `allBlogArticles`.
- Portfolio retains its legacy loader at `src/types/portfolio/portfolioCases.ts` for `ArticleCategoryPage`.

### Article Config Files

| Config | Loader | Purpose |
|---|---|---|
| `data/config/articleTypes.json` | `src/types/config/articleTypes.ts` | Type registry (labels, paths, icons) |
| `data/config/categories.json` | `src/types/config/categories.ts` | Portfolio category slugs/names |
| `data/config/portfolio.json` | `src/types/config/portfolioConfig.ts` | Portfolio listing (perPage, emptyLabel, gridDescription) |
| `data/config/news.json` | `src/types/config/newsConfig.ts` | News listing (emptyLabel, gridDescription) |
| `data/config/blog.json` | `src/types/config/blogConfig.ts` | Blog listing (emptyLabel, gridDescription) |
| `data/config/defaultArticleCta.json` | `src/types/config/defaultArticleCta.ts` | Fallback CTA for article detail pages |

See [`articles.md`](./articles.md) for the full article engine documentation.
