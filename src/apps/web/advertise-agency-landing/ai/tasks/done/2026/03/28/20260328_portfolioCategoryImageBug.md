# 20260328 — Portfolio 'All' Category: Images Show as Skeletons PDR

## Status: pending

## Bug Description

Navigating to `PortfolioCategoryPage` with the default 'All' category (route `/portfolio` or `/portfolio/all`) shows only skeleton placeholders instead of portfolio images. Single-category views (e.g. `/portfolio/branding`) display images correctly.

## Root Cause Analysis

Two compounding issues:

**Primary — lazy loading + many cards:** The 'All' view renders all portfolio cases at once. All `<OptimizedImage>` instances default to `loading="lazy"` (`priority={false}`). The `loaded` state initialises to `false` (since `priority` is false), so every card shows `<Skeleton>` immediately. Cards below the fold may never receive an `onLoad` event until scrolled into view. In a single-category view far fewer cards are rendered, so most fit on screen and load promptly.

**Secondary — `imageLoaded` state not reset on navigation:** `PortfolioThumbnail` holds local `useState(false)` for `imageLoaded`. When React Router navigates between category routes and reuses the same component instances (no key change on the grid), old `imageLoaded` state may persist across renders incorrectly — or conversely stale `false` states never recover.

**Tertiary — broken/missing `images.preview` paths in some case JSON files:** Some portfolio cases may lack `images.preview` or have paths that don't start with `/images/`, causing `resolveImageSrcSet` (`src/libs/imageSrcSet.ts:24`) to return `''`. The fallback `<img src>` then requests a potentially unresolvable path; if neither `onLoad` nor `onError` fires (e.g. the path is undefined/empty), the skeleton stays indefinitely.

## Affected Files

| File | Issue |
|---|---|
| `src/components/ui/OptimizedImage.tsx` | `loaded` starts `false` for all lazy images; skeleton shown until `onLoad` |
| `src/components/ui/portfolio/PortfolioThumbnail.tsx` | `imageLoaded` state not keyed/reset; shimmer persists |
| `src/components/portfolio/PortfolioGrid.tsx` | No `key` prop reset when category changes — stale state risk |
| `src/libs/imageSrcSet.ts` | Returns `''` for non-`/images/` paths — `onLoad` may never fire |
| `src/pages/PortfolioCategoryPage.tsx` | Passes all cases to grid with no page-level loading guard |

---

## Tasks

### T1 · Fix `OptimizedImage`: call `onError` handler when src is empty/undefined

**Priority:** high · **Scope:** `src/components/ui/OptimizedImage.tsx`

**Requirements:**
- In `OptimizedImage`, add a `useEffect` that calls `setLoaded(true)` immediately when `src` is falsy/empty — prevents a permanent skeleton for cards with no image path
- Ensure the `onError` callback already wired to `<img>` also calls `onLoad?.()` so the parent `PortfolioThumbnail` dismisses its shimmer on error
- Do not change behaviour for valid paths

**Files:**
- `src/components/ui/OptimizedImage.tsx`

---

### T2 · Fix `PortfolioThumbnail`: reset `imageLoaded` when `image` prop changes

**Priority:** high · **Scope:** `src/components/ui/portfolio/PortfolioThumbnail.tsx`

**Requirements:**
- Replace `const [imageLoaded, setImageLoaded] = useState(false)` with a state that resets when the `image` prop changes:
  ```ts
  const [imageLoaded, setImageLoaded] = useState(() => !image);
  useEffect(() => { setImageLoaded(!image); }, [image]);
  ```
  This way cards without an image never show a shimmer, and the state resets when a new image src is supplied.
- Alternatively, add `key={image ?? 'no-image'}` at the call-site in `PortfolioCard` to force remount on image change.

**Files:**
- `src/components/ui/portfolio/PortfolioThumbnail.tsx` (preferred) or `src/components/ui/portfolio/PortfolioCard.tsx`

---

### T3 · Fix `PortfolioGrid`: add `key` to force remount when `activeSlug` changes

**Priority:** medium · **Scope:** `src/components/portfolio/PortfolioGrid.tsx`

**Requirements:**
- Add a `key` prop to the grid's card list container (or to each `PortfolioCard`) that includes `activeSlug` so that navigating between categories unmounts/remounts cards and clears all stale `imageLoaded` / `loaded` state:
  ```tsx
  <div key={activeSlug ?? 'all'} className="grid ...">
    {items.map((item) => <PortfolioCard key={item.slug} item={item} />)}
  </div>
  ```

**Files:**
- `src/components/portfolio/PortfolioGrid.tsx`

---

### T4 · Fix `imageSrcSet`: handle empty/undefined src gracefully

**Priority:** medium · **Scope:** `src/libs/imageSrcSet.ts`

**Requirements:**
- Return `''` immediately if `src` is falsy (already done), but also add a console warning in dev mode so broken paths surface during development:
  ```ts
  if (!src) return '';
  if (!src.startsWith('/images/')) {
    if (import.meta.env.DEV) console.warn(`[imageSrcSet] unexpected path: ${src}`);
    return '';
  }
  ```
- This does not fix the bug itself but surfaces data issues that cause it.

**Files:**
- `src/libs/imageSrcSet.ts`

---

### T5 · Unit tests

**Priority:** high · **Scope:** `src/components/ui/OptimizedImage.tsx`, `src/components/ui/portfolio/PortfolioThumbnail.tsx`

**Test file:** `src/components/ui/__tests__/OptimizedImage.test.tsx`

**Cases:**
- `OptimizedImage` with valid `src`: renders `<Skeleton>` initially, dismisses it after `onLoad` fires
- `OptimizedImage` with `src=""` (empty): does NOT render `<Skeleton>` (resolves immediately)
- `OptimizedImage` with `priority={true}`: does NOT render `<Skeleton>` at all
- `OptimizedImage` fires `onLoad` prop callback when image loads
- `OptimizedImage` fires `onLoad` prop callback when image errors (so parent shimmer is also dismissed)

**Test file:** `src/components/ui/portfolio/__tests__/PortfolioThumbnail.test.tsx`

**Cases:**
- With `image` prop: renders shimmer initially; shimmer disappears after `onLoad`
- Without `image` prop: does NOT render shimmer; renders gradient fallback immediately
- `image` prop changes from valid to undefined: shimmer state resets (no stale `imageLoaded=true` with blank src)
- `image` prop changes from undefined to valid: shimmer appears until new image loads

**Files:**
- `src/components/ui/__tests__/OptimizedImage.test.tsx` — new
- `src/components/ui/portfolio/__tests__/PortfolioThumbnail.test.tsx` — new

---

### T6 · Integration tests

**Priority:** high · **Scope:** `PortfolioCategoryPage` + `PortfolioGrid`

**Test file:** `src/pages/__tests__/portfolioCategoryPage.test.tsx`

**Cases:**
- Render `PortfolioCategoryPage` at route `/portfolio` (no slug): all portfolio cards render; after images load (simulate `onLoad`), no skeletons remain
- Render at `/portfolio/all`: same assertions as above
- Render at `/portfolio/<slug>` for a single category: only cards matching that category render; images load correctly
- Navigate from `/portfolio/all` to `/portfolio/branding` and back: card states reset; no stale skeletons from previous render
- Portfolio case with missing `images.preview`: card renders gradient fallback (no skeleton, no shimmer)
- Portfolio case with `images.preview` set to a non-`/images/` path: card falls back gracefully, no permanent skeleton

**Files:**
- `src/pages/__tests__/portfolioCategoryPage.test.tsx` — new

---

### T7 · E2E tests

**Priority:** medium · **Scope:** Playwright

**Test file:** `e2e/portfolioCategoryPage.spec.ts`

**Cases:**
- Navigate to `/portfolio`: wait for page to settle; assert that no skeleton elements remain visible after network idle
- Navigate to `/portfolio/all`: same as above
- Navigate to `/portfolio/<first-category-slug>`: images load; no skeletons after network idle
- Navigate from `/portfolio/all` to a category and back to `/portfolio/all`: no skeletons persist on return
- Scroll to bottom of `/portfolio` (if paginated): newly revealed cards load images and dismiss skeletons

**Selector guidance:**
- Skeletons are rendered as `<div>` with class matching `animate-pulse` or `shimmer` (check actual Skeleton component class)
- Assert `page.locator('[data-skeleton]').count()` === 0, or use the Skeleton component's test id if added

**Files:**
- `e2e/portfolioCategoryPage.spec.ts` — new

---

## Priority Summary

| # | Task | Priority | Effort | Dependencies |
|---|------|----------|--------|--------------|
| T1 | Fix `OptimizedImage` empty-src handling | high | small | — |
| T2 | Fix `PortfolioThumbnail` stale `imageLoaded` state | high | small | — |
| T3 | Fix `PortfolioGrid` key reset on category change | medium | trivial | — |
| T4 | Warn on invalid paths in `imageSrcSet` | medium | trivial | — |
| T5 | Unit tests for OptimizedImage + PortfolioThumbnail | high | medium | T1, T2 |
| T6 | Integration tests for PortfolioCategoryPage | high | medium | T1, T2, T3 |
# repaired truncated tail
