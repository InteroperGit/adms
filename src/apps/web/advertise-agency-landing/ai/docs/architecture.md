# Architecture Reference

## Tech Stack

| Layer       | Technology                                           |
|-------------|------------------------------------------------------|
| Framework   | Vite 8 + React 19 + TypeScript 5.9                  |
| Bundler     | Rolldown (Rust-based, replaces Rollup + esbuild)     |
| SSG         | React Router v7 framework mode (`ssr: false`)        |
| Routing     | react-router v7 (`src/routes.ts`, `RouteConfig`)     |
| Styling     | Tailwind CSS v4 + shadcn/ui                          |
| Package mgr | pnpm (never npm or yarn)                             |
| Linting     | ESLint + Prettier                                    |
| Icons       | lucide-react (via ICON_MAP only)                     |

## Routes

```
/                                  → Home.tsx (landing, inside App layout)
/portfolio                         → PortfolioPage.tsx (all cases, paginated)
/portfolio/:categorySlug           → PortfolioCategoryPage.tsx ("all" shows everything; unknown slug → NotFound)
/portfolio/:categorySlug/:year/:month/:caseSlug → PortfolioCasePage.tsx (SSG per JSON; not found → NotFound)
/privacy-policy                    → PrivacyPolicy.tsx
/user-agreement                    → UserAgreement.tsx
/consent                           → Consent.tsx
/404                               → NotFound.tsx (explicitly SSG'd page for static dist/404.html)
*                                  → NotFound.tsx (catch-all route for unmatched URLs inside App layout)
```

## Not Found (404) Handling

- **Global 404 page**: `src/pages/NotFound.tsx` — centered full-page layout with title, description, code, and CTA back button
- **Data**: `data/content/config/notFound.json` — `notFoundContent` (title, code, description, backLabel, backHref)
- **Router**: `src/routes.ts` defines routes including explicit `/404` and catch-all `*` routes, both rendering `<NotFound />`
- **Props override**: `NotFound` accepts optional `backLabel` and `backHref` props for contextual back links (used by portfolio 404s)
- **Portfolio 404s**: `PortfolioCategoryPage` and `PortfolioCasePage` render `<NotFound>` with portfolio-specific back links (e.g., "All Projects")
- **SSG**: `/404` route is included in `prerender()` function; `scripts/postbuild-seo.ts` copies `build/client/404/index.html` → `build/client/404.html` for hosting platforms (Netlify, Vercel, etc.)
- **SEO**: `src/plugins/seoMetaPlugin.ts` (called via `scripts/postbuild-seo.ts`) injects `<meta name="robots" content="noindex">` on `/404` route to prevent search engine indexing

## SSG Build

- React Router v7 framework mode, `ssr: false`
- `prerender()` function in `react-router.config.ts` controls which routes are pre-rendered.
- `scripts/postbuild-seo.ts` and `scripts/postbuild-cache.ts` handle post-build HTML processing and caching.

## Workflow (after every task)

1. `pnpm format` — reformat all changed files
2. `pnpm typecheck` — fix source errors; "Cannot find module" for gitignored data JSON files is pre-existing and harmless
3. `pnpm lint` — fix new errors; `badge.tsx` / `button.tsx` are shadcn-generated — do not edit them
4. Update `CLAUDE.md` — reflect new/changed files, routes, conventions
5. Mark task **✅ done** in its plan file (`ai/tasks/NNN_*.md`)

## File Naming Conventions

- **Components**: `PascalCase` — e.g. `PortfolioCard.tsx`
- **Other source files** (hooks, utils, type modules, helpers): `camelCase` — e.g. `portfolioConfig.ts`, `useScrolled.ts`
- **Plan files** in `ai/tasks/`: `NNN_planName.md` — zero-padded number, camelCase name — e.g. `006_portfolioPage.md`

## Additional Rules

- **pnpm only** — never use npm or yarn
- **react-router v7** (not v6) — required for framework mode
- **Native DOM event types** in handlers — React 19 dropped synthetic aliases (`React.FormEvent`, `React.MouseEvent`, etc.); use `SubmitEvent`, `MouseEvent`, `InputEvent` etc. instead

## Key Notes / Gotchas

- `pnpm typecheck` always shows "Cannot find module" errors for gitignored data JSON files — expected, pre-existing, not introduced by edits
- `react-helmet-async` (dep of vite-react-ssg) has unmet peer for React 19 — harmless warning
- `constants.ts` — deleted; NAV_LINKS live in `data/content/sections/header.json` → `headerContent.nav`; STORAGE_KEY and CONSENT_EVENT are inline in their respective files
- Monolithic `data/content.json` / `src/types/content.ts` — deleted; replaced by per-section JSON + type modules (see `ai/docs/data-map.md`)

## Dark Mode

- `src/contexts/ThemeContext.tsx` — exports `ThemeProvider` + `ThemeContext`; reads `localStorage('theme-mode')` + `matchMedia`; toggles `.dark` on `<html>`
- `src/hooks/useTheme.ts` — `useTheme()` returns `{ isDark, toggle }`; use this everywhere instead of direct context access
- `themePlugin.ts` — emits `.dark { … }` CSS block from `theme.darkColors` when present
- `src/index.css` — `@variant dark (&:where(.dark, .dark *));` enables Tailwind `dark:` prefix
- `data/content/config/theme.json` — optional `darkColors` key (same shape as `colors`)
- Always-dark surfaces (footer, advantages section) use `bg-foreground dark:bg-neutral-950`

## Header

- **In-flow** (not fixed) — `bg-background border-b border-border`
- `useActiveSection` tracks scroll position for nav highlight
- `useTheme` called in `header/index.tsx`; passes `isDark` + `toggle` to nav sub-components
- Sun/Moon toggle in `HeaderDesktopNav` (between SocialLinks and CTA) and `HeaderMobileNav` (in menu footer)
