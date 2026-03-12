# Architecture Reference

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Framework   | Vite 7 + React 19 + TypeScript 5.9     |
| SSG         | vite-react-ssg 0.9.1-beta.1            |
| Routing     | react-router-dom v6 (RouteObject[])    |
| Styling     | Tailwind CSS v4 + shadcn/ui            |
| Package mgr | pnpm (never npm or yarn)               |
| Linting     | ESLint + Prettier                       |
| Icons       | lucide-react (via ICON_MAP only)        |

## Routes

```
/                                  → Home.tsx (landing, inside App layout)
/portfolio                         → PortfolioPage.tsx (all cases, paginated)
/portfolio/:categorySlug           → PortfolioCategoryPage.tsx ("all" shows everything; unknown slug → not-found)
/portfolio/:categorySlug/:caseSlug → PortfolioCasePage.tsx (SSG per JSON; back → /:categorySlug)
/privacy-policy                    → PrivacyPolicy.tsx
/user-agreement                    → UserAgreement.tsx
/consent                           → Consent.tsx
/order                             → OrderPage.tsx (?form=<id> selects form)
```

## SSG Build

- `vite-react-ssg 0.9.1-beta.1` + `dirStyle: 'nested'` → `dist/portfolio/<slug>/index.html`
- `vite.config.ts` must `import 'vite-react-ssg'` to activate `ssgOptions` type augmentation
- `includedRoutes` generates: `/portfolio`, `/portfolio/all`, `/portfolio/{catSlug}` per category, `/portfolio/all/{caseSlug}` for every case, `/portfolio/{catSlug}/{caseSlug}` for cases in their own category
- **Add a category**: one entry in `data/content/config/categories.json` → SSG picks it up automatically
- **Add a case**: new `data/content/portfolio/{slug}.json` → no config change needed

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
- **react-router-dom v6** (not v7) — required by vite-react-ssg peer dependency
- **Native DOM event types** in handlers — React 19 dropped synthetic aliases (`React.FormEvent`, `React.MouseEvent`, etc.); use `SubmitEvent`, `MouseEvent`, `InputEvent` etc. instead

## Key Notes / Gotchas

- `pnpm typecheck` always shows "Cannot find module" errors for gitignored data JSON files — expected, pre-existing, not introduced by edits
- `react-helmet-async` (dep of vite-react-ssg) has unmet peer for React 19 — harmless warning
- `constants.ts` — deleted; NAV_LINKS live in `data/content/sections/header.json` → `headerContent.nav`; STORAGE_KEY and CONSENT_EVENT are inline in their respective files
- Monolithic `data/content.json` / `src/types/content.ts` — deleted; replaced by per-section JSON + type modules (see `ai/docs/data-map.md`)

## Dark Mode

- `src/hooks/useDarkMode.ts` — reads `localStorage('theme-mode')` + `matchMedia('prefers-color-scheme: dark')`; toggles `.dark` on `<html>`; returns `{ isDark, toggle }`
- `themePlugin.ts` — emits `.dark { … }` CSS block from `theme.darkColors` when present; injects anti-FOUC script before fonts
- `src/index.css` — `@variant dark (&:where(.dark, .dark *));` enables Tailwind `dark:` prefix
- `data/content/config/theme.json` — optional `darkColors` key (same shape as `colors`)
- Always-dark surfaces (footer, advantages section) use `bg-foreground dark:bg-neutral-950`

## Header

- **In-flow** (not fixed) — `bg-background border-b border-border`
- `useActiveSection` tracks scroll position for nav highlight
- `useDarkMode` called in `header/index.tsx`; passes `isDark` + `onToggleDark` to both nav sub-components
- Sun/Moon toggle in `HeaderDesktopNav` (between SocialLinks and CTA) and `HeaderMobileNav` (in menu footer)
