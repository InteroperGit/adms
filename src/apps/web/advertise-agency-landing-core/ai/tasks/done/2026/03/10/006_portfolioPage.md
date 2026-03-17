# 006 — Standalone Portfolio Pages with Category Routes

## Goal

Create a dedicated `/portfolio` page (all cases) and separate static SSG pages per category
at `/portfolio/:categorySlug` (e.g. `/portfolio/branding`). Individual case pages are nested
under their category: `/portfolio/:categorySlug/:caseSlug` (e.g. `/portfolio/branding/bodrost`,
`/portfolio/all/bodrost`). Category filter tabs are link-based. Home page Portfolio section
shows a limited preview and links to `/portfolio`. Case "Back" link returns to the category
the user came from.

---

## ✅ Task 1 — DONE: Base `/portfolio` page

**Implemented files:**

| File | Status |
|---|---|
| `data/sections/portfolio-page.json` | ✅ created |
| `data/_schema/portfolio-page.example.json` | ✅ created |
| `src/types/sections/portfolioPage.ts` | ✅ created |
| `src/pages/PortfolioPage.tsx` | ✅ created (uses `?category` + `?page` query params — will be refactored in Task 2) |
| `src/components/portfolio/Pagination.tsx` | ✅ created |
| `src/router.tsx` | ✅ `/portfolio` route added |
| `vite.config.ts` | ✅ `/portfolio` added to SSG `includedRoutes` |
| `src/components/sections/portfolio/index.tsx` | ✅ limited to 6 items, CTA → `/portfolio` |
| `data/sections/portfolio-section.json` | ✅ CTA updated |
| `src/pages/PortfolioCasePage.tsx` | ✅ back links → `/portfolio` (will be updated in Task 2) |

---

## Task 2 — Category pages + nested case URLs

### Overview

Route map:

```
/portfolio                       → all cases listing        (PortfolioPage)
/portfolio/all                   → all cases (SSG alias)    (PortfolioCategoryPage)
/portfolio/branding              → Брендинг listing         (PortfolioCategoryPage)
/portfolio/contextual-ads        → Контекстная реклама      (PortfolioCategoryPage)
/portfolio/all/bodrost           → case, opened from "all"  (PortfolioCasePage)
/portfolio/branding/bodrost      → case, opened from brand  (PortfolioCasePage)
```

Case URLs include the category context. The same case (`bodrost`) has multiple valid URLs —
one per category it can be reached from (`all` + its own category). The "Back" button on the
case page returns to `/portfolio/{categorySlug}` — whichever listing the user navigated from.

Three separate route patterns, no dispatcher needed:

```ts
{ path: '/portfolio',                              element: <PortfolioPage />         },
{ path: '/portfolio/:categorySlug',                element: <PortfolioCategoryPage /> },
{ path: '/portfolio/:categorySlug/:caseSlug',      element: <PortfolioCasePage />     },
```

---

### ✅ Task 2.1 — DONE: Refactor: split portfolio data into sections copy + config

`data/sections/portfolio-page.json` was created in Task 1 with mixed concerns — page copy and
runtime config. Split them:

**`data/config/portfolio.json`** — shared listing config used by every portfolio listing page:

```json
{
  "perPage": 9,
  "allLabel": "Все",
  "prevLabel": "Назад",
  "nextLabel": "Вперёд",
  "pageLabel": "Страница {current} из {total}",
  "emptyLabel": "Проектов в этой категории пока нет.",
  "cta": { "label": "Обсудить ваш проект", "href": "/#contact" }
}
```

**`data/sections/portfolio-page.json`** — trimmed to page-specific copy only:

```json
{
  "label": "Наши работы",
  "title": "Портфолио",
  "description": "Все наши проекты — от брендинга до рекламных кампаний."
}
```

Also create `data/_schema/portfolio-config.example.json` for the config file.
Update `data/_schema/portfolio-page.example.json` to match the trimmed shape.

**`src/types/config/portfolioConfig.ts`** — new type module:

```ts
import raw from '@data/config/portfolio.json';

interface CtaLink { label: string; href: string; }

export interface PortfolioConfig {
  perPage: number;
  allLabel: string;
  prevLabel: string;
  nextLabel: string;
  pageLabel: string;
  emptyLabel: string;
  cta: CtaLink;
}

export const portfolioConfig = raw satisfies PortfolioConfig;
```

**`src/types/sections/portfolioPage.ts`** — remove the fields now in config:

```ts
export interface PortfolioPageContent {
  label: string;
  title: string;
  description: string;
}
```

Update `PortfolioPage.tsx` to import from both modules. `PortfolioGrid` (Task 2.5) reads
from `portfolioConfig` for pagination settings, not `portfolioPageContent`.

---

### ✅ Task 2.2 — DONE: Add category registry: `data/config/categories.json`

Authoritative list of categories. Drives SSG route generation and `CategoryNav` links.

```json
[
  { "name": "Брендинг",            "slug": "branding"       },
  { "name": "Контекстная реклама", "slug": "contextual-ads" }
]
```

Rules:
- `name` must exactly match the `category` field in portfolio case JSON files.
- `slug` must be a valid URL segment (lowercase Latin, hyphens only).
- New categories added here automatically get an SSG route and case sub-routes.

Also create `data/_schema/categories.example.json` with the same shape.

---

### ✅ Task 2.3 — DONE: Add type module: `src/types/config/categories.ts`

```ts
import raw from '@data/config/categories.json';

export interface Category {
  name: string;  // display name, matches PortfolioCase.category
  slug: string;  // URL segment, e.g. "branding"
}

export const categories = raw satisfies Category[];
```

---

### ✅ Task 2.4 — DONE: Create `src/components/portfolio/CategoryNav.tsx`

Link-based category filter. Used on all portfolio listing pages.

Props:
```ts
interface CategoryNavProps {
  activeSlug: string | null; // null = /portfolio, "all" = /portfolio/all, etc.
}
```

Behaviour:
- "Все" tab → `href="/portfolio"`, active when `activeSlug === null || activeSlug === 'all'`.
- Each category tab → `href="/portfolio/{slug}"`, active when `activeSlug === slug`.
- Reads category list from `categories` const.
- Same visual style as existing `PortfolioFilter` (rounded pill, `bg-primary` active).

---

### ✅ Task 2.5 — DONE: Extract `src/components/portfolio/PortfolioGrid.tsx`

Shared grid + pagination + CTA. Used by `PortfolioPage` and `PortfolioCategoryPage`.

Props:
```ts
interface PortfolioGridProps {
  items: PortfolioCase[];
  activeSlug: string | null; // current category slug, used to build case hrefs
}
```

Case card `href` is generated as:
```ts
href = `/portfolio/${activeSlug ?? 'all'}/${item.slug}`
```

So from the "all" listing, bodrost links to `/portfolio/all/bodrost`.
From the "branding" listing, bodrost links to `/portfolio/branding/bodrost`.

Renders:
- `CategoryNav` with `activeSlug`.
- Paged card grid with empty-state message.
- `Pagination` (hidden when `totalPages <= 1`).
- Bottom CTA button (`portfolioConfig.cta`).

Pagination reads/writes `?page` via `useSearchParams` internally.

---

### ✅ Task 2.6 — DONE: Create `src/pages/PortfolioCategoryPage.tsx`

Page for `/portfolio/:categorySlug`.

- Reads `categorySlug` from `useParams`.
- `slug === 'all'` → shows all cases.
- Otherwise looks up matching `Category` from `categories` const; if not found → not-found
  message with link to `/portfolio`.
- Filters `ALL_ITEMS` accordingly.
- Renders `SectionHeader` + `<PortfolioGrid items={filtered} activeSlug={categorySlug} />`.
- Sets `document.title`:
  - `all` → same as `PortfolioPage` title
  - otherwise → `{category.name} — Портфолио — РА «Рекламастер»`

---

### ✅ Task 2.7 — DONE: Update `src/pages/PortfolioPage.tsx`

- Remove `?category` param logic and `PortfolioFilter` import.
- Replace grid block with `<PortfolioGrid items={ALL_ITEMS} activeSlug={null} />`.
- Keeps `document.title`.
- File becomes a short orchestrator (~20 lines).

---

### ✅ Task 2.8 — DONE: Update `src/pages/PortfolioCasePage.tsx`

Route changes from `/portfolio/:slug` to `/portfolio/:categorySlug/:caseSlug`.

- Read both params: `const { categorySlug, caseSlug } = useParams()`.
- Look up case: `portfolioCaseMap[caseSlug]`.
- "Back" link: `href="/portfolio/{categorySlug}"` — returns to the listing the user came from.
- Not-found fallback link: `/portfolio`.
- No other logic changes.

---

### ✅ Task 2.9 — DONE: Update home section card hrefs

`src/components/sections/portfolio/index.tsx` currently builds hrefs as
`/portfolio/${data.slug}`. Update to use the canonical category URL:

```ts
href: `/portfolio/${categorySlug(data.category)}/${data.slug}`
```

Where `categorySlug` is a helper that looks up `data.category` in `categories` const and
returns its `slug`. Cards on the home preview always link to the category-scoped URL, not
`/portfolio/all/...`.

Add helper `src/lib/categorySlug.ts`:
```ts
import { categories } from '@/types/config/categories';
export function categorySlug(name: string): string {
  return categories.find((c) => c.name === name)?.slug ?? 'all';
}
```

---

### ✅ Task 2.10 — DONE: Update SSG config: `vite.config.ts`

Generate routes for all category listings and all case pages under each category context:

```ts
import categoriesRaw from './data/config/categories.json'

includedRoutes(paths) {
  const dir = path.resolve(__dirname, 'data/portfolio')
  const caseFiles = existsSync(dir)
    ? readdirSync(dir).filter((f) => f.endsWith('.json'))
    : []

  // Load case data to know each case's category
  const cases = caseFiles.map((f) => {
    const data = JSON.parse(readFileSync(path.join(dir, f), 'utf-8')) as {
      slug: string; category: string
    }
    return data
  })

  const catSlugs = ['all', ...(categoriesRaw as { slug: string }[]).map((c) => c.slug)]

  // Category listing pages: /portfolio/all, /portfolio/branding, …
  const categoryRoutes = catSlugs.map((s) => `/portfolio/${s}`)

  // Case pages nested under each category:
  // /portfolio/all/{caseSlug} for every case
  // /portfolio/{catSlug}/{caseSlug} for cases that belong to that category
  const caseRoutes: string[] = []
  for (const c of cases) {
    caseRoutes.push(`/portfolio/all/${c.slug}`)
    const catSlug = (categoriesRaw as { name: string; slug: string }[])
      .find((cat) => cat.name === c.category)?.slug
    if (catSlug) caseRoutes.push(`/portfolio/${catSlug}/${c.slug}`)
  }

  return [
    ...paths.filter((p) =>
      p !== '/portfolio/:slug' &&
      p !== '/portfolio/:categorySlug' &&
      p !== '/portfolio/:categorySlug/:caseSlug' &&
      p !== '/portfolio'
    ),
    '/portfolio',
    ...categoryRoutes,
    ...caseRoutes,
  ]
},
```

Generated pages (example):
```
dist/portfolio/index.html
dist/portfolio/all/index.html
dist/portfolio/branding/index.html
dist/portfolio/contextual-ads/index.html
dist/portfolio/all/bodrost/index.html
dist/portfolio/all/fitstudio/index.html
dist/portfolio/all/techpulse/index.html
dist/portfolio/branding/bodrost/index.html
dist/portfolio/branding/fitstudio/index.html
dist/portfolio/contextual-ads/techpulse/index.html
```

---

### ✅ Task 2.11 — DONE: Update `CLAUDE.md`

Add to Project Structure:
- `src/pages/PortfolioCategoryPage.tsx`
- `src/components/portfolio/CategoryNav.tsx`
- `src/components/portfolio/PortfolioGrid.tsx`
- `src/lib/categorySlug.ts`
- `src/types/config/portfolioConfig.ts`
- `src/types/config/categories.ts`
- `data/config/portfolio.json`
- `data/config/categories.json`
- `data/_schema/portfolio.example.json`
- `data/_schema/categories.example.json`

Update Routes table:
```
/portfolio                         → PortfolioPage.tsx (all cases, paginated)
/portfolio/:categorySlug           → PortfolioCategoryPage.tsx (filtered listing)
/portfolio/:categorySlug/:caseSlug → PortfolioCasePage.tsx (individual case)
```

---

## Files to Create

| File | Purpose |
|---|---|
| `data/config/portfolio.json` | Shared listing config: perPage, pagination labels, emptyLabel, allLabel, cta |
| `data/_schema/portfolio-config.example.json` | Schema example (git-tracked) |
| `src/types/config/portfolioConfig.ts` | `PortfolioConfig` interface + `portfolioConfig` const |
| `data/config/categories.json` | Category registry: `[{ name, slug }]` |
| `data/_schema/categories.example.json` | Schema example (git-tracked) |
| `src/types/config/categories.ts` | `Category` interface + `categories` const |
| `src/pages/PortfolioCategoryPage.tsx` | Listing page for one category |
| `src/components/portfolio/CategoryNav.tsx` | Link-based category filter tabs |
| `src/components/portfolio/PortfolioGrid.tsx` | Shared grid + pagination + CTA |
| `src/lib/categorySlug.ts` | `categorySlug(name)` lookup helper |

## Files to Modify

| File | Change |
|---|---|
| `data/sections/portfolio-page.json` | Remove config fields; keep only `label`, `title`, `description` |
| `data/_schema/portfolio-page.example.json` | Match trimmed shape |
| `src/types/sections/portfolioPage.ts` | Remove config fields from interface |
| `src/pages/PortfolioPage.tsx` | Import `portfolioConfig`; remove `?category` param; use `PortfolioGrid` |
| `src/pages/PortfolioCasePage.tsx` | Read `categorySlug` + `caseSlug` params; Back → `/portfolio/{categorySlug}` |
| `src/components/sections/portfolio/index.tsx` | Update hrefs to `/portfolio/{catSlug}/{caseSlug}` |
| `src/router.tsx` | Replace old `:slug` route with new two-param route |
| `vite.config.ts` | Generate category + nested case routes |
| `CLAUDE.md` | Document new files and routes |

---

## SSG Considerations

- All pages fully static — only `?page` is client-side.
- The same case has multiple valid URLs (one per accessible category context). This is
  intentional for Back-navigation UX. Add `<link rel="canonical">` pointing to the
  category-scoped URL (e.g. `/portfolio/branding/bodrost`) if SEO is a concern.
- Adding a new category = add one entry to `categories.json`; SSG picks it up automatically.
- Adding a new case = no config change needed; `vite.config.ts` reads `data/portfolio/*.json`
  at build time.

## Pagination UX (unchanged from Task 1)

- `?page=N` in URL — bookmarkable, browser back/forward works.
- Single page → hide pagination controls.
- Style: `Назад | Страница 1 из 3 | Вперёд`, centered below grid.
- Changing page scrolls grid top into view.
