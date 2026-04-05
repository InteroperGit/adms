# PDR: Improve ArticleListPage — Portal-Style List Layout

**Date:** 2026-04-05
**Goal:** Replace the current 3-column card grid in `ArticleListPage` with a vertical list layout inspired by habr.ru and modern informational portals.

## Current State

- Articles render as a `grid-cols-3` of simple `<Link>` cards (title + description only)
- No images, no metadata (date, read time, author), no visual hierarchy
- PER_PAGE = 12 (too many for a grid, fine for a list)

## Target: Habr-Style List

Each article row should show (left to right on desktop, stacked on mobile):

1. **Thumbnail image** (left, fixed-size ~120x80px, aspect-video) — from `article.hero.image`
2. **Content block** (center, flex-grow):
   - Title (larger, hover→primary color)
   - Description (2-3 lines, muted)
   - Meta row: date, read time, tags (small, muted)
3. **Category/type badge** (right, subtle pill)

On mobile: thumbnail on top (wider), content below in a stacked column.

## Tasks

### 1. Create `ArticleListItem` component
**File:** `src/components/articles/ArticleListItem.tsx`

Props: `{ article, href, type }`

Layout:
- Horizontal flex row (`flex flex-col sm:flex-row gap-4`)
- Thumbnail: `w-full sm:w-40 h-32 sm:h-28 shrink-0` — uses `OptimizedImage` with `object-cover rounded-lg`
- Fallback gradient box when no image (using `article.hero.gradient`)
- Content area: flex-col with title, description line-clamp-2, meta row
- Meta row: formatted date (`publishedAt`), `readTime` (if present), type badge
- Tags: show first 2-3 tags as small pill badges
- Hover: subtle bg change, title→primary color
- Border-bottom separator between items

### 2. Create `formatDate` utility
**File:** `src/libs/articleDate.ts` (or inline)

Simple `Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })` formatter.

### 3. Update `ArticleListPage.tsx`
Changes:
- Replace the `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` with a vertical stack
- Import and use `ArticleListItem` instead of raw `<Link>` cards
- Increase `PER_PAGE` from 12 to 15-20 (list scrolls faster)
- Add visual separator (`divide-y divide-border/30`) between list items
- Container: wrap items in `rounded-xl border border-border/50 bg-card divide-y divide-border/30 overflow-hidden`

### 4. Add hover animation to list items
- `transition-all duration-200 hover:bg-muted/30`
- Title: `group-hover:text-primary`
- Thumbnail: subtle `hover:scale-[1.02]`

### 5. Verify with existing article data types
- Ensure `ArticleListItem` handles all article types (portfolio, service, news, blog)
- Show type-appropriate badge label (e.g., "Портфолио", "Новости", "Блог", "Услуги")

## Validation

After implementation:
```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm build
```

## Files to Modify
- `src/components/articles/ArticleListItem.tsx` (NEW)
- `src/pages/ArticleListPage.tsx` (MODIFY)

## Design Notes
- Keep the existing section wrapper, breadcrumbs, SectionHeader — only change the list rendering
- Use existing project patterns: `bg-card`, `border-border/50`, `text-muted-foreground`, `text-primary`
- No new dependencies — only existing components (OptimizedImage, existing utilities)
- Respect `prefers-reduced-motion` for any animations
- Dark mode must work (already handled by using semantic tokens)
