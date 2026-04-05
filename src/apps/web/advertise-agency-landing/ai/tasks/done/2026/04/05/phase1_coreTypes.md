# Phase 1: Core Types & Schemas

**Tasks:** T1–T7 (7) | **Depends on:** Phase 0 ✅
**Parent index:** `20260401_generalArticleMechanism.md`

---

## Architecture

### BaseArticleSchema (`src/types/articles/article.ts`)

```typescript
import { z } from 'zod';
import { ContentBlockSchema } from '@/types/blocks';

export const BaseArticleSchema = z.object({
  slug: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  title: z.string(),
  description: z.string(),
  hero: z.object({ image: z.string().optional(), gradient: z.string() }),
  tags: z.array(z.string()),
  category: z.string(),
  author: z.object({ name: z.string(), avatar: z.string().optional(), title: z.string().optional() }).optional(),
  readTime: z.number().optional(),
  meta: z.object({ title: z.string(), description: z.string(), ogUrl: z.string().optional(), ogImage: z.string().optional() }),
  content: z.array(ContentBlockSchema),
  images: z.object({ preview: z.string().optional(), og: z.string().optional() }).optional(),
});

export type BaseArticle = z.infer<typeof BaseArticleSchema>;
export type ArticleType = 'portfolio' | 'service' | 'news' | 'blog';
```

### Extended Types

- `portfolioArticle.ts`: `BaseArticleSchema.extend({ overview: z.object({ client: z.string(), year: z.string(), services: z.string() }) })`
- `serviceArticle.ts`: alias to `BaseArticleSchema`
- `newsArticle.ts`: `BaseArticleSchema.extend({ source: z.string().optional() })`
- `blogArticle.ts`: alias to `BaseArticleSchema`

### Unified Article Loader (`src/types/articles/allArticles.ts`)

```typescript
const ARTICLE_TYPE_PATTERN = /^(?<type>portfolio|service|news|blog)(?:\/(?<category>[^/]+))?\/(?<year>\d{4})\/(?<month>\d{2})\/\d{4}_\d{2}_\d{2}_(?<slug>[^/]+)\.json$/;
const modules = import.meta.glob<ArticleModule>(['@data/articles/**/**/*.json', '@data/portfolio/**/**/*.json'], { eager: true, import: 'default' });
```

- `parseArticlePath()` → returns `{ type, category?, year, month, slug }`
- `normalizeArticle()` → parses with schema, adds `type`
- `articleMap: Record<string, BaseArticle & { type }>`

### Tasks

- **T1 ✅:** Create `src/types/articles/article.ts`
- **T2 ✅:** Create `src/types/articles/portfolioArticle.ts`
- **T3 ✅:** Create `src/types/articles/serviceArticle.ts`
- **T4 ✅:** Create `src/types/articles/newsArticle.ts`
- **T5 ✅:** Create `src/types/articles/blogArticle.ts`
- **T6 ✅:** Create `src/types/articles/allArticles.ts`
- **T7 ✅:** Update `scripts/generate-json-schemas.ts` — generate JSON Schema for all article types
