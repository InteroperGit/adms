# Plan: React Router v7 + Vite 8 (combined migration)

**Status**: backlog
**Date**: 2026-03-16
**Priority**: medium — unblocks Vite 8 upgrade (which is blocked by `vite-react-ssg`)
**Supersedes**: `20260315_Vite8.md` (vite-react-ssg is the Vite 8 blocker; this plan removes it)

## Goal

Drop `vite-react-ssg` + `react-router-dom` v6 → adopt **React Router v7 framework mode** (`@react-router/dev`) with built-in SSG (`prerender`) + **Vite 8** (Rolldown). One migration, two upgrades.

## Why combined

- `vite-react-ssg` peer-requires Vite `^2–^7` — **does not support Vite 8**
- `vite-react-ssg` explicitly does not support React Router v7
- React Router v7's `@react-router/dev` is **confirmed compatible with Vite 8** (tested by both teams)
- Doing them separately would mean: (1) migrate to RR v7 on Vite 7, then (2) upgrade Vite 8 — double the churn for no benefit

## Trigger to start

- When build speed or Vite 8 features become a priority
- When `vite-react-ssg` goes unmaintained or causes issues
- When a RR v7 feature is needed (typesafe routes, `meta` exports, etc.)

---

## Architecture: before → after

| Concern | Before | After |
|---------|--------|-------|
| Router | `react-router-dom` v6.30.3 | `react-router` v7 (unified package) |
| SSG lib | `vite-react-ssg` 0.9.1-beta.1 | `@react-router/dev` built-in `prerender` |
| Vite plugin | `@vitejs/plugin-react` | `@react-router/dev/vite` (`reactRouter()`) |
| Bundler | Vite 7 (esbuild + Rollup) | Vite 8 (Rolldown + Oxc) |
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

1. **Install new deps**
   ```bash
   pnpm add react-router @react-router/dev @react-router/node
   pnpm add -D vite@^8.0.0
   ```

2. **Remove old deps**
   ```bash
   pnpm remove vite-react-ssg react-router-dom @vitejs/plugin-react
   ```

3. **Create `react-router.config.ts`**
   ```ts
   import type { Config } from "@react-router/dev/config";

   export default {
     appDirectory: "src",
     ssr: false,
     async prerender({ getStaticPaths }) {
       // Reuse buildIncludedRoutes() logic here
       return [
         ...getStaticPaths(),
         // expand dynamic portfolio routes from data files
       ];
     },
   } satisfies Config;
   ```

4. **Update `vite.config.ts`**
   - Replace `react()` with `reactRouter()` from `@react-router/dev/vite`
   - `build.rollupOptions` → `build.rolldownOptions` (Vite 8)
   - `manualChunks` → `codeSplitting` (Rolldown)
   - Remove `ssgOptions` block
   - Keep `themePlugin`, `imageResizePlugin`, Tailwind plugin
   - Remove `copy-404-html` plugin (handle 404 via RR v7 or new approach)

5. **Add `.react-router/` to `.gitignore`** — generated types directory

### Phase 2 — Entry points & HTML shell

6. **Create `src/root.tsx`** — move HTML structure from `index.html`
   ```tsx
   import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

   export function Layout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="ru">
         <head>
           <meta charSet="UTF-8" />
           <meta name="viewport" content="width=device-width, initial-scale=1.0" />
           {/* Move theme anti-FOUC script here */}
           <Meta />
           <Links />
         </head>
         <body>
           {children}
           <ScrollRestoration />
           <Scripts />
         </body>
       </html>
     );
   }

   export default function Root() {
     return <Outlet />;
   }
   ```

7. **Create `src/entry.client.tsx`**
   ```tsx
   import { hydrateRoot } from "react-dom/client";
   import { HydratedRouter } from "react-router/dom";

   hydrateRoot(document, <HydratedRouter />);
   ```

8. **Delete `src/main.tsx`** and **`index.html`** (replaced by above)

### Phase 3 — Route migration

9. **Create `src/routes.ts`** — convert from `RouteObject[]`
   ```ts
   import type { RouteConfig } from "@react-router/dev/routes";

   export default [
     {
       file: "./App.tsx",  // layout wrapper
       children: [
         { index: true, file: "./pages/Home.tsx" },
         { path: "portfolio", file: "./pages/PortfolioCategoryPage.tsx" },
         { path: "portfolio/:categorySlug", file: "./pages/PortfolioCategoryPage.tsx" },
         { path: "portfolio/:categorySlug/:year/:month/:caseSlug", file: "./pages/PortfolioCasePage.tsx" },
         { path: "privacy-policy", file: "./pages/PrivacyPolicy.tsx" },
         { path: "user-agreement", file: "./pages/UserAgreement.tsx" },
         { path: "consent", file: "./pages/Consent.tsx" },
         { path: "order", file: "./pages/OrderPage.tsx" },
         { path: "404", file: "./pages/NotFound.tsx" },
         { path: "*", file: "./pages/NotFound.tsx" },
       ],
     },
   ] satisfies RouteConfig;
   ```

10. **Delete `src/router.tsx`** (replaced by `routes.ts`)

11. **Update `src/App.tsx`** — may need to export `ErrorBoundary` instead of using `errorElement`

### Phase 4 — Import migration (17 files)

12. **Find-and-replace** `react-router-dom` → `react-router` in all imports

    All v6 hooks/components exist in v7 with same API:
    | API | Status in v7 |
    |-----|-------------|
    | `Link` | Same |
    | `useParams` | Same |
    | `useSearchParams` | Same |
    | `useNavigate` | Same |
    | `useLocation` | Same |
    | `useRouteError` | Same |
    | `Outlet` | Same |

    Files to update:
    | File | APIs used |
    |------|-----------|
    | `src/App.tsx` | `Outlet`, `useLocation` |
    | `src/pages/RouteError.tsx` | `useRouteError` |
    | `src/pages/PortfolioCategoryPage.tsx` | `useParams` |
    | `src/pages/PortfolioCasePage.tsx` | `useParams` |
    | `src/pages/OrderPage.tsx` | `useSearchParams` |
    | `src/pages/NotFound.tsx` | `Link` |
    | `src/components/portfolio/CategoryNav.tsx` | `Link` |
    | `src/components/portfolio/PortfolioGrid.tsx` | `useSearchParams` |
    | `src/components/sections/header/index.tsx` | `useLocation` |
    | `src/components/ui/navigation/HomeHashScroll.tsx` | `useLocation` |
    | `src/components/ui/navigation/BackButton.tsx` | `useNavigate` |
    | `src/components/sections/footer/FooterBottom.tsx` | `Link` |
    | `src/components/ui/orderForm/OrderFormConsent.tsx` | `Link` |
    | `src/components/sections/contact/ContactConsent.tsx` | `Link` |
    | `src/components/banners/CookieBanner.tsx` | `Link` |
    | `src/components/analytics/MetrikaScript.tsx` | `useLocation` |

### Phase 5 — SSG pipeline migration

13. **Move `buildIncludedRoutes()` logic** → `prerender()` in `react-router.config.ts`
    - Read category slugs from `data/config/categories.json`
    - Glob portfolio case files from `data/content/portfolio/**/*.json`
    - Build the same path list: `/portfolio`, `/portfolio/all`, `/portfolio/{cat}`, `/portfolio/{cat}/{y}/{m}/{slug}`, etc.
    - Include `/404` in prerender list

14. **Move SEO meta injection** → `meta` export on route modules (or keep as a Vite plugin if simpler)
    - `ssgMetaPlugin.ts` currently injects `<title>`, `<meta description>`, OG tags, `noindex` for 404
    - RR v7 route modules can export a `meta` function that returns these

15. **Handle 404 page**
    - With `ssr: false`, RR v7 writes a SPA fallback (`__spa-fallback.html` or `index.html`)
    - `/404` is pre-rendered via `prerender` → `build/client/404/index.html`
    - May still need a small post-build script to copy `404/index.html` → `404.html` for hosting

16. **Migrate incremental build caching** — adapt `postbuild-cache.ts` to new `build/client/` output dir

17. **Handle `themePlugin` anti-FOUC script** — move inline script into `root.tsx` `<head>`

### Phase 6 — Vite 8 specifics

18. **`build.rolldownOptions`** — migrate `manualChunks` → `codeSplitting`
19. **Remove `esbuild` from `pnpm.onlyBuiltDependencies`** if no longer in tree
20. **Verify `rollup-plugin-visualizer`** works with Rolldown (or remove `pnpm analyze`)
21. **Check CJS interop** — if any dep breaks, use `legacy.inconsistentCjsInterop: true` temporarily

### Phase 7 — Verify & test

22. Full verification:
    ```bash
    pnpm typecheck       # TypeScript
    pnpm lint            # ESLint
    pnpm validate        # JSON schemas
    pnpm dev             # Dev server + HMR
    pnpm build           # SSG build
    pnpm preview         # Preview built site
    ```

23. Check all routes render:
    - `/` (home), `/portfolio`, `/portfolio/{cat}`, `/portfolio/{cat}/{y}/{m}/{slug}`
    - `/privacy-policy`, `/user-agreement`, `/consent`, `/order`
    - `/404` (explicit), unknown URL → 404 fallback

24. Check features:
    - Client-side nav (Link, useNavigate, useSearchParams pagination)
    - Dark mode toggle
    - Cookie banner + analytics
    - SEO meta tags in built HTML
    - Image optimization
    - Hash scroll on home page

### Phase 8 — Cleanup & docs

25. **Delete** obsolete files:
    - `src/main.tsx`, `src/router.tsx`, `index.html`
    - `src/plugins/ssgMetaPlugin.ts` (if fully replaced by `meta` exports + `prerender()`)

26. **Update `package.json` scripts**:
    - `"dev"` → `"react-router dev"`
    - `"build"` → `"tsc -b tsconfig.app.json && react-router build && vite-node scripts/postbuild-cache.ts"`

27. **Update docs**: `CLAUDE.md`, `ai/docs/architecture.md`, `MEMORY.md`

---

## Files affected summary

| Action | Files |
|--------|-------|
| **Create** | `react-router.config.ts`, `src/root.tsx`, `src/entry.client.tsx`, `src/routes.ts` |
| **Delete** | `src/main.tsx`, `src/router.tsx`, `index.html` |
| **Modify (imports)** | 16 component/page files (react-router-dom → react-router) |
| **Modify (config)** | `vite.config.ts`, `package.json`, `tsconfig.app.json` |
| **Modify (SSG)** | `src/plugins/ssgMetaPlugin.ts` → logic moves to `prerender()` + `meta` exports |
| **Modify (build)** | `scripts/postbuild-cache.ts` (new output dir) |
| **Possibly modify** | `src/plugins/themePlugin.ts` (anti-FOUC script may move to `root.tsx`) |
| **Add to .gitignore** | `.react-router/` |

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| `@react-router/dev` SSG doesn't support all current hooks | Medium | Check `prerender()` API covers `includedRoutes` + `onPageRendered` use cases before starting |
| Build output dir change (`dist/` → `build/client/`) breaks deploy | Low | Update CI/hosting config |
| `useSearchParams` behavior changes in v7 | Low | API is identical; test pagination + order form |
| Rolldown compatibility with custom plugins | Low | `themePlugin` + `imageResizePlugin` use standard hooks |
| 404 handling differs | Medium | Test SPA fallback + explicit `/404` prerender |

## References

- [React Router v7 — Framework adoption from RouterProvider](https://reactrouter.com/upgrading/router-provider)
- [React Router v7 — Pre-rendering (SSG)](https://reactrouter.com/how-to/pre-rendering)
- [Vite 8 announcement — React Router confirmed compatible](https://vite.dev/blog/announcing-vite8)
- [vite-react-ssg — does not support RR v7 or Vite 8](https://github.com/Daydreamer-riri/vite-react-ssg)
- [Vite 8 migration guide](https://vite.dev/guide/migration)
