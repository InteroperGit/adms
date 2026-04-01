# Portfolio Structure — Nested Folders & Publishing

## Overview

Portfolio cases are organized in a **nested folder hierarchy** by category, year, and month. Each case file includes a required `publishedAt` field for chronological ordering.

## Directory Structure

```
data/content/portfolio/
├── {category-slug}/
│   ├── {year}/
│   │   └── {month}/
│   │       └── {yyyy_mm_dd}_{slug}.json
```

**Example paths:**
- `portfolio/branding/2024/08/2024_08_01_artplex.json`
- `portfolio/contextual-ads/2024/04/2024_04_01_homefit.json`
- `portfolio/outdoor/2023/11/2023_11_01_bodrost.json`

## Case JSON Schema

Each portfolio case file must include:

- **`slug`** (string, required) — unique identifier (should match filename suffix)
- **`publishedAt`** (string, required) — ISO date format `"YYYY-MM-DD"`
- **`category`** (string, required) — category name (matched against `data/content/config/categories.json`)
- **`title`** (string, required) — case title
- **`description`** (string, required) — short description (1–2 sentences)
- **`hero`** (object, required)
  - `image?` (string, optional) — hero image path
  - `gradient` (string, required) — Tailwind gradient class
- **`tags`** (array of strings, required) — case tags/keywords
- **`meta`** (object, required) — SEO metadata
  - `title` (string) — page title
  - `description` (string) — meta description
  - `ogUrl?` (string, optional) — canonical URL
  - `ogImage?` (string, optional) — OG image path
- **`overview`** (object, required)
  - `client` (string) — client name
  - `year` (string) — project year
  - `services` (string) — services delivered
- **`content`** (array of blocks, required) — case study content blocks
- **`images?`** (object, optional)
  - `preview?` (string, optional) — preview image
  - `og?` (string, optional) — OG image

## Example File

```json
{
  "slug": "artplex",
  "publishedAt": "2024-08-01",
  "title": "ArtPlex Cinema Brand Identity",
  "category": "Брендинг",
  "description": "Full brand identity redesign for an independent art cinema.",
  "hero": {
    "image": "/images/portfolio/artplex/hero.jpg",
    "gradient": "from-indigo-600 to-violet-500"
  },
  "tags": ["Logo", "Branding", "Animation"],
  "meta": {
    "title": "ArtPlex Cinema — Brand Identity Case",
    "description": "How we redesigned the brand identity for an independent art cinema.",
    "ogUrl": "https://example.ru/portfolio/branding/artplex",
    "ogImage": "/images/portfolio/artplex/og.jpg"
  },
  "overview": {
    "client": "ArtPlex Cinema",
    "year": "2024",
    "services": "Logo Design, Brand Guidelines, Collateral"
  },
  "content": [
    {
      "__component": "heading",
      "level": 2,
      "text": "Challenge"
    },
    {
      "__component": "paragraph",
      "text": "The cinema needed a modern, distinctive identity..."
    }
  ],
  "images": {
    "preview": "/images/portfolio/artplex/preview.jpg",
    "og": "/images/portfolio/artplex/og.jpg"
  }
}
```

## Adding New Cases

1. **Create the directory structure**: `data/content/portfolio/{category}/{year}/{month}/`
2. **Name the file**: `{yyyy_mm_dd}_{slug}.json` (where day defaults to 01 if exact date unknown)
3. **Add required fields**: `slug`, `publishedAt`, `category`, `title`, `description`, `hero`, `tags`, `meta`, `overview`, `content`
4. **Run validation**: `pnpm validate` to verify the case against the schema
5. **Generate schemas**: `pnpm gen-schemas` to update IDE autocomplete (optional, for initial setup)

## SSG Routes Generated

The build process automatically generates these routes:

- `/portfolio` — all cases, paginated
- `/portfolio/:categorySlug` — cases in that category (e.g., `/portfolio/branding`)
- `/portfolio/all/:caseSlug` — case under the "all" pseudo-category
- `/portfolio/:categorySlug/:caseSlug` — case under its real category

## Implementation Details

### Type Definition

`src/types/portfolio/index.ts` exports `PortfolioCaseSchema` (Zod) and `PortfolioCase` type:

```typescript
export const PortfolioCaseSchema = z.object({
  slug: z.string(),
  publishedAt: z.string(), // ISO date "YYYY-MM-DD"
  title: z.string(),
  category: z.string(),
  description: z.string(),
  // ... other fields
});

export type PortfolioCase = z.infer<typeof PortfolioCaseSchema>;
```

### Glob Loading

`src/types/portfolio/portfolioCases.ts` loads all case files recursively:

```typescript
const modules = import.meta.glob<PortfolioCase>('@data/portfolio/**/*.json', {
  eager: true,
  import: 'default',
});

export const portfolioCaseMap: Record<string, PortfolioCase> = Object.fromEntries(
  Object.entries(modules).map(([, data]) => {
    const parsed = PortfolioCaseSchema.parse(data);
    return [parsed.slug, parsed];
  })
);
```

The slug is derived from the JSON `slug` field, not from the filename (allowing flexible naming).

### Static Meta Plugin

`src/plugins/ssgMetaPlugin.ts` pre-builds a case file map during SSG initialization:

```typescript
const caseFileMap = Object.fromEntries(
  walkJsonFiles(path.resolve(rootDir, 'data/content/portfolio')).map((f) => {
    const data = JSON.parse(readFileSync(f, 'utf-8')) as CaseData & { slug: string };
    return [data.slug, data];
  })
);
```

This is used in `onPageRendered` to inject meta tags on case pages.

### Validation & Schema Generation

- **`scripts/validate.ts`** uses `walkJsonFiles()` helper to recursively discover `**/*.json` files
- **`scripts/generate-json-schemas.ts`** updates `.vscode/settings.json` with `fileMatch: ['data/content/portfolio/**/*.json']`

## Migration History

**March 14, 2026**: Reorganized portfolio structure from flat (`data/content/portfolio/*.json`) to nested folders.

**Before:**
```
data/content/portfolio/
├── artplex.json
├── mobibank.json
├── fitstudio.json
...
```

**After:**
```
data/content/portfolio/
├── branding/2023/03/2023_03_01_artplex.json
├── branding/2023/09/2023_09_01_mobibank.json
├── branding/2024/02/2024_02_01_fitstudio.json
...
```

All 11 existing cases were migrated and assigned `publishedAt` fields based on their intended publication dates.
