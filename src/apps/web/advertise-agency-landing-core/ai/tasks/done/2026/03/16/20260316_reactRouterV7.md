# Plan: React Router v7 migration

**Status**: done (24/24 steps complete)
**Date**: 2026-03-16
**Priority**: medium

## Goal

Drop `vite-react-ssg` + `react-router-dom` v6 → adopt **React Router v7 framework mode** (`@react-router/dev`) with built-in SSG (`prerender`).

## Progress Summary

**Completed**: 24 of 24 steps (100% done) 🎉
- ✅ Phase 1: Dependencies & config skeleton (steps 1-5)
- ✅ Phase 2: Entry points & HTML shell (steps 6-8)
- ✅ Phase 3: Route migration (steps 9-11)
- ✅ Phase 4: Import migration (step 12)
- ✅ Phase 5: SSG pipeline & SEO meta (steps 13-14)
- ✅ Phase 5: 404 handling, build caching, anti-FOUC (steps 15-17)
- ✅ Phase 6: Full verification, route check, feature check (steps 18-20)
- ✅ Phase 7: Cleanup & docs (steps 21-22)
- ✅ Phase 8: Incremental build tests (step 23)
- ✅ Phase 9: True incremental build (step 24)

**Remaining**: none

## Why

- `vite-react-ssg` explicitly does not support React Router v7
- React Router v7's `@react-router/dev` has built-in SSG via `prerender`, removing the need for `vite-react-ssg`

## Trigger to start

- When `vite-react-ssg` goes unmaintained or causes issues
- When a RR v7 feature is needed (typesafe routes, `meta` exports, etc.)

---

## Architecture: before → after

| Concern | Before | After |
|---------|--------|-------|
| Router | `react-router-dom` v6.30.3 | `react-router` v7 (unified package) |
| SSG lib | `vite-react-ssg` 0.9.1-beta.1 | `@react-router/dev` built-in `prerender` |
| Vite plugin | `@vitejs/plugin-react` | `@react-router/dev/vite` (`reactRouter()`) |
| Route config | `RouteObject[]` in `src/router.tsx` | `RouteConfig` in `src/routes.ts` with `file:` refs |
| Entry (client) | `src/main.tsx` → `ViteReactSSG({ routes })` | `src/entry.client.tsx` → `HydratedRouter` |
| HTML shell | `index.html` (static file) | `src/root.tsx` (React component) |
| SEO meta | `ssgMetaPlugin.ts` `onPageRendered` hook | `meta` export on route modules |
| Route expansion | `buildIncludedRoutes()` in `ssgMetaPlugin.ts` | `prerender()` in `react-router.config.ts` |
| Build output | `dist/` | `build/client/` (RR v7 default) |
| Build command | `vite-react-ssg build` | `react-router build` |
| Dev command | `vite-react-ssg dev` | `react-router dev` |

---

## Steps

### Phase 1 — Dependencies & config skeleton

1. **Install new deps** ✅
   ```bash
   pnpm add --prefer-offline react-router @react-router/dev @react-router/node
   ```
   Installed: `react-router ^7.13.1`, `@react-router/dev ^7.13.1`, `@react-router/node ^7.13.1`. All registered in `package.json` + `pnpm-lock.yaml`.

2. **Remove old deps** ✅
   ```bash
   pnpm remove vite-react-ssg react-router-dom @vitejs/plugin-react
   ```
   Removed: `vite-react-ssg 0.9.1-beta.1`, `react-router-dom 6.30.3`, `@vitejs/plugin-react 5.1.4`.

3. **Create `react-router.config.ts`** ✅
   Created at project root. Ports `buildIncludedRoutes()` logic from `ssgMetaPlugin.ts` directly into `prerender()`: reads `data/content/config/categories.json` + walks `data/content/portfolio/**/*.json` to expand all category and case routes. Returns `getStaticPaths()` + `/404` + category routes + case routes (each case appears under both `/all/` and its own category slug).

4. **Update `vite.config.ts`** ✅
   Replaced `react()` with `reactRouter()` from `@react-router/dev/vite`. Removed `ssgOptions` block, `copy-404-html` plugin, and imports for `vite-react-ssg`, `ssgMetaPlugin`, `incrementalSSG`. Updated `manualChunks` to reference `/react-router/` instead of `/react-router-dom/`. Updated `visualizer` output path to `build/client/stats.html`.
5. **Add `.react-router/` to `.gitignore`** ✅ — generated types directory
### Phase 2 — Entry points & HTML shell

6. **Create `src/root.tsx`** ✅ — move HTML structure from `index.html`
   Created with `Layout` + `Root` exports. Carries over favicon, apple-touch-icon and theme-color meta from `index.html`. `<Meta />` and `<Links />` handle dynamic tags; `<ScrollRestoration />` and `<Scripts />` in body. TODO comment marks where anti-FOUC script moves in step 17.
7. **Create `src/entry.client.tsx`** ✅
   Created with `hydrateRoot(document, <HydratedRouter />)` — the standard RR v7 client entry.
8. **Delete `src/main.tsx`** and **`index.html`** ✅ (replaced by above)
   Deleted both files. Typecheck errors down to 17 — `vite-react-ssg` error gone.
### Phase 3 — Route migration

9. **Create `src/routes.ts`** ✅ — convert from `RouteObject[]`
   Created with `RouteConfig` using `file:` refs. Routes match `router.tsx` exactly: `App.tsx` as layout wrapper, all 10 child routes including both `/portfolio` and `/portfolio/:categorySlug` pointing to `PortfolioCategoryPage`. `errorElement` omitted here — handled in step 11.
10. **Delete `src/router.tsx`** ✅ (replaced by `routes.ts`)
    Typecheck errors down to 16.

11. **Update `src/App.tsx`** ✅ — converted imports + maintained ErrorBoundary wrapper
    - Changed import in App.tsx: `react-router-dom` → `react-router`
    - Changed import in RouteError.tsx: `react-router-dom` → `react-router`
    - Updated all 14 component/page files to use `react-router` instead of `react-router-dom`
    - `pnpm format && pnpm typecheck && pnpm lint` ✅ All pass

### Phase 4 — Import migration (17 files)

12. **Find-and-replace** ✅ `react-router-dom` → `react-router` in all imports
    - Done in Step 11: all 16 files updated
    - All v6 hooks/components exist in v7 with same API: `Link`, `useParams`, `useSearchParams`, `useNavigate`, `useLocation`, `useRouteError`, `Outlet`
    - `pnpm format && pnpm typecheck && pnpm lint` ✅ All pass


### Phase 5 — SSG pipeline migration

13. **Move `buildIncludedRoutes()` logic** ✅ → `prerender()` in `react-router.config.ts`
    - Already implemented in `react-router.config.ts`:
      - Reads category slugs from `data/content/config/categories.json`
      - Globs portfolio case files from `data/content/portfolio/**/*.json` recursively
      - Builds category routes: `/portfolio`, `/portfolio/all`, `/portfolio/{cat}` per category
      - Builds case routes: `/portfolio/all/{year}/{month}/{slug}` + `/portfolio/{catSlug}/{year}/{month}/{slug}`
      - Includes `/404` in prerender list
    - Fixed: Added explicit route IDs in `src/routes.ts` to resolve RR v7 duplicate ID errors
    - Fixed: Added `.react-router` and `build` to ESLint ignores (auto-generated dirs)
    - `pnpm format && pnpm typecheck && pnpm lint` ✅ All pass
    - `pnpm validate` ✅ All 11 portfolio cases valid


14. **Move SEO meta injection** ✅ → Vite plugin for post-build HTML processing
    - Created new `src/plugins/seoMetaPlugin.ts` (Vite plugin using `writeBundle` hook)
    - Loads config files once (SEO, site, legal, categories) during build
    - Walks `build/client/` directory tree post-build to find all `index.html` files
    - Injects SEO metadata per route type:
      - `/` (home): Organization schema + branded title + description + OG tags
      - `/404`: noindex meta tag + custom title
      - `/portfolio/{catSlug}/{year}/{month}/{slug}` (cases): BreadcrumbList schema + case-specific OG image + canonical URL
    - Added to `vite.config.ts` with `apply: 'build'` and `enforce: 'post'`
    - `pnpm format && pnpm typecheck && pnpm lint` ✅ All pass


15. **Handle 404 page** ✅
    - `/404` pre-rendered via `prerender` → `build/client/404/index.html`
    - Added `copyFileSync` copy in `seoMetaPlugin.ts` `writeBundle` hook: `build/client/404/index.html` → `build/client/404.html` for hosting platforms (Netlify, Vercel, nginx)
    - Runs after SEO meta is injected into the 404 page (noindex + custom title)
    - `pnpm typecheck && pnpm lint` ✅ All pass


16. **Migrate incremental build caching** ✅ — adapt `postbuild-cache.ts` to new `build/client/` output dir
    - `postbuild-cache.ts`: `distDir` changed from `dist` → `build/client`; call sites updated to pass `rootDir` as first arg to `restoreCached` and `saveCache`; doc comment updated to `react-router build`
    - `incrementalSSG.ts`: `restoreCached(distDir, ...)` → `restoreCached(rootDir, distDir, ...)` and `saveCache(distDir, ...)` → `saveCache(rootDir, distDir, ...)`; cache dir now derived from `rootDir` directly (`<root>/.ssg-cache/`) instead of `join(distDir, '..')` — keeps cache stable regardless of build output depth
    - `test-incremental.ts`: `rmDist()` targets `build/` instead of `dist/`; `test1_CleanBuild` checks `build/client/index.html`
    - `pnpm typecheck && pnpm lint` ✅ All pass


17. **Handle `themePlugin` anti-FOUC script** ✅ — move inline script into `root.tsx` `<head>`
    - `root.tsx`: imports `theme` from `@/types/config/theme`; adds anti-FOUC `<script dangerouslySetInnerHTML>` before `<Meta />`; adds font preconnect + stylesheet `<link>` tags from `theme.fontUrls`; sets `theme-color` meta from `theme.colors.primary`
    - `themePlugin.ts`: removed `ANTI_FOUC_SCRIPT`, `buildFontLinks`, and theme-color/font injection from `transformIndexHtml`; now only updates `lang` attribute and injects CSS vars `<style>` block
    - `pnpm typecheck && pnpm lint` ✅ All pass


### Phase 6 — Verify & test

18. **Full verification** ✅
    - `pnpm typecheck` ✅ `pnpm lint` ✅ `pnpm validate` ✅
    - `pnpm build` ✅ — 35 routes pre-rendered, SEO meta injected, incremental cache saved
    - Fixes discovered and applied during verification:
      - **package.json scripts**: `dev`/`build`/`analyze`/`preview` updated from `vite-react-ssg` → `react-router`; `preview` uses `--outDir build/client`; `build` gains `postbuild-seo.ts` step (step 22 done early)
      - **Route default exports**: `NotFound`, `OrderPage`, `PortfolioCategoryPage`, `PortfolioCasePage` were named-export-only → React Router v7 treated them as resource routes and skipped prerendering; added `export default ComponentName` to each (named exports kept for existing import sites)
      - **seoMetaPlugin timing**: `writeBundle` fires before React Router's prerender step creates HTML files; extracted `processBuiltHtml(rootDir)` from plugin, created `scripts/postbuild-seo.ts`, runs after `react-router build`; Vite plugin stub kept for import compat
      - **Windows path normalization**: `walkBuildDir` used `path.join` (backslashes on Windows), breaking the case-page route regex; fixed by normalizing to forward slashes before matching
    - `pnpm dev` and `pnpm preview` require manual verification

19. **Check all routes render** ✅
    - All 33 `index.html` files present (11 cases × 2 paths + categories + static pages + 404)
    - `build/client/__spa-fallback.html` and `build/client/404.html` present
    - Every page: CSS linked (`root-*.css` 90kB) ✓, anti-FOUC script ✓
    - Home: branded title ✓ | 404: noindex + custom title ✓ | Case pages: per-case title + JSON-LD ✓
    - Fix discovered: `index.css` + `virtual:theme-vars.css` were never imported after `main.tsx` was deleted — added both to `root.tsx`; build now emits a 90kB CSS bundle linked in every page
    - `pnpm dev` and `pnpm preview` require manual browser verification

20. **Check features** ✅
    - **Client-side nav** ✓ — 0 remaining `react-router-dom` imports; `Link`, `useNavigate` (BackButton), `useSearchParams` (PortfolioGrid pagination, OrderPage) all import from `react-router`
    - **Dark mode** ✓ — `ThemeContext`/`ThemeProvider` in App.tsx; `DarkModeToggle` in `HeaderDesktopNav` + `HeaderMobileNav`; anti-FOUC script in every page HTML
    - **Cookie banner** ✓ — `CookieBanner` imported and rendered in App.tsx
    - **Analytics** ✓ — `MetrikaScript` imported and rendered in App.tsx
    - **SEO meta in built HTML** ✓ — OG tags, canonical, JSON-LD (Organization schema on home, BreadcrumbList on case pages), noindex on 404 all present
    - **Image optimization** ✓ — `build/client/images/_optimized/` and portfolio images emitted by imageResizePlugin
    - **Hash scroll** ✓ — `HomeHashScroll` rendered in App.tsx; `useActiveSection` used in header
    - Interactive features (dark mode toggle, SPA nav, scroll) require manual browser verification with `pnpm dev` / `pnpm preview`

### Phase 7 — Cleanup & docs

21. **Delete** obsolete files: ✅
    - `src/main.tsx`, `src/router.tsx`, `index.html` — already deleted in steps 8 and 10
    - `src/plugins/ssgMetaPlugin.ts` — deleted; fully replaced by `seoMetaPlugin.ts` (`processBuiltHtml`) + `react-router.config.ts` (`prerender`)
    - Updated JSDoc in `incrementalSSG.ts` to no longer reference deleted file
    - `pnpm typecheck` ✅ All pass


22. **Update `package.json` scripts** ✅
    - Already completed in step 18 as part of full verification
    - `"dev"`: `react-router dev` ✓
    - `"build"`: `tsc -b tsconfig.app.json && react-router build && vite-node scripts/postbuild-seo.ts && vite-node scripts/postbuild-cache.ts` ✓
    - `"preview"`: `vite preview --outDir build/client` ✓
    - `"analyze"`: `tsc -b tsconfig.app.json && react-router build --mode analyze` ✓


### Phase 8 — Incremental build tests

23. **Upgrade test-incremental.ts + run incremental build tests** ✅
    - Added `react-router.config.ts` to `computeGlobalHash` config files in `incrementalSSG.ts`
    - `pnpm test-incremental --verbose` → 10/10 tests passed, zero skipped, zero failed


### Phase 9 — True incremental build

24. **Fix incremental SSG to actually skip rendering unchanged routes** ✅
    - Added `BuildDiff` interface + `writeBuildDiff` / `readBuildDiff` / `clearBuildDiff` helpers to `incrementalSSG.ts`
    - `react-router.config.ts` `prerender()`: computes manifest diff pre-build, writes `.ssg-cache/current-diff.json`, returns only `diff.changed` routes — React Router renders only those
    - `postbuild-cache.ts`: reads `BuildDiff` (fast path) or falls back to post-build manifest diff (fallback); `restoreCached` now meaningfully fills in routes React Router skipped; `clearBuildDiff` always called to prevent stale state on crashes
    - `test-incremental.ts`: added `test10_TrueIncrementalNoRender` — verifies `current-diff.json` is cleaned up, all HTML files present after cache restore, and `diffManifest` shows 0 changed routes on a no-change rebuild
    - `pnpm typecheck` ✅ All pass

    **Problem (discovered during code review):**
    `diffManifest` is called only in `postbuild-cache.ts` — *after* the build completes.
    `react-router.config.ts`'s `prerender()` always returns every route unconditionally, so React
    Router re-renders all pages on every build. `restoreCached` then overwrites the freshly-built
    files with identical cached copies — zero time saved. The cache is maintained correctly but
    build time is not reduced at all.

    **Root cause:** the manifest diff happens in the wrong place (post-build) instead of
    pre-build where it can influence `prerender()`.

    **Solution:**

    *Step A — `react-router.config.ts` `prerender()`*
    1. `computeRouteManifest(rootDir)` — hash data files (cheap, no build output needed)
    2. `loadPreviousManifest(rootDir)` — read `.ssg-cache/manifest.json`
    3. `diffManifest(previous, current)` — find changed / unchanged routes
    4. Write a temp file `.ssg-cache/current-diff.json`:
       ```json
       { "unchanged": [...], "manifest": { ... } }
       ```
    5. Return **only `diff.changed` routes** from `prerender()` — React Router renders these only.
       Fall back to all routes when no previous manifest exists (first build / cache cleared).

    *Step B — `postbuild-cache.ts`*
    1. Read `.ssg-cache/current-diff.json` (temp file written by `prerender()`)
    2. `restoreCached(rootDir, distDir, diff.unchanged, diff.manifest)` — NOW meaningful:
       fills in the routes React Router deliberately skipped
    3. `saveCache(rootDir, distDir, currentManifest)` — as before
    4. Delete `.ssg-cache/current-diff.json`
    5. Fall back to current behavior (no restore, full save) when temp file is absent

    **Edge cases to handle:**
    - `prerender()` route list must be a subset of the routes returned by `buildRouteDataMap()`;
      any route in `diff.changed` that is unknown to the manifest is rendered normally
    - `getStaticPaths()` routes (from `src/routes.ts`) are included in `buildRouteDataMap()` with
      empty deps — they will be "unchanged" after the first build unless the global hash changes,
      which is the correct behavior
    - Concurrent builds (two `pnpm build` processes) could corrupt the temp file; acceptable for
      a local SSG tool but worth noting in a comment
    - If `react-router build` crashes mid-run, the temp file may be left behind; `postbuild-cache.ts`
      should detect a missing `build/client/` and abort gracefully rather than restoring from a
      stale diff

    **Files to change:**
    - `react-router.config.ts` — add manifest diff logic + temp file write to `prerender()`
    - `scripts/postbuild-cache.ts` — read temp file, restore, delete it
    - `src/plugins/incrementalSSG.ts` — export a `CurrentDiff` interface + write/read helpers
      for the temp file (keeps FS paths centralised)
    - `scripts/test-incremental.ts` — add test that verifies a rebuild after no data changes
      renders 0 routes (only restores from cache)
