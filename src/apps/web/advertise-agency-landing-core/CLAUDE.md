# CLAUDE.md — advertise-agency-landing-core

## Project Overview

Landing page for **РА "Рекламастер"** — fully static SSG, no backend. **White-label kit**: swap `data/` + `theme.json` for new clients with zero component changes. Run `pnpm new-client`.

## Key Structure

```
src/main.tsx       # Entry: ViteReactSSG({ routes })
src/router.tsx     # RouteObject[] — all page routes
src/pages/         # Home, PortfolioPage, PortfolioCasePage, legal, OrderPage
src/components/    # sections/ | portfolio/ | ui/ | analytics/ | banners/ | layout/
src/types/         # Zod schemas + parsed consts (config/ sections/ portfolio/ shared/)
src/hooks/         # useFadeIn, useActiveSection, useTheme, useCookieConsent, useSwipe
src/contexts/      # ThemeContext (dark mode)
src/plugins/       # themePlugin, imageResizePlugin, ssgMetaPlugin
scripts/           # validate.ts, generate-json-schemas.ts, new-client.ts
data/content/      # JSON data (gitignored except _schema/)
```

**App.tsx:** `<Header />` (in-flow, border-b) → `<Outlet />` → `<Footer />` + `<ScrollToTop />` `<CookieBanner />` `<MetrikaScript />`

**Home.tsx (/):** Carousel (70vh) → Hero → About → Services → Portfolio → Advantages (dark) → CallToAction → Testimonials → Contact

## Development Commands

```bash
pnpm dev          # Dev server → http://localhost:5173
pnpm build        # SSG build → dist/  (tsc -b && vite-react-ssg build)
pnpm preview      # Preview production build
pnpm lint         # ESLint
pnpm format       # Prettier over src/**/*.{ts,tsx,css}
pnpm typecheck    # tsc -b
pnpm validate     # Validate data JSON against Zod schemas (vite-node)
pnpm gen-schemas  # Generate data/_schema/schema/*.schema.json + .vscode/settings.json
pnpm new-client   # Bootstrap data/content/ for a new client
```

## Data & Type Architecture

Full mapping → **[`ai/docs/data-map.md`](./ai/docs/data-map.md)**

- `@data` alias → `./data/content`; components never import `@data/` directly — always via `src/types/`
- Each type module: Zod schema + inferred type + parsed const. **No `satisfies`** — Zod parse replaces it
- Icons: string keys in JSON → resolved via `ICON_MAP` in `src/types/shared/iconMap.ts`
- `src/types/` organized: `config/`, `sections/`, `portfolio/`, `shared/`, `legal/`

## Quick Commands

```bash
pnpm dlx shadcn@latest add <component>  # Add shadcn/ui (output → src/components/ui/)
```

## Code Conventions

- **Imports**: components use `@/types/` (never `@data/`); `cn()` from `@/lib/utils`; `categorySlug()` from `@/lib/categorySlug`
- **SectionBadge**: `src/components/ui/section/SectionBadge.tsx` — props: `label`, `variant?` (`'light'|'dark'`), `className?`
- **Sections**: self-contained in `src/components/sections/`, use `Container` for layout
- **Path aliases**: `@/` → `src/`, `@data` → `data/content`
- **Plan files**: `ai/tasks/NNN_camelCase.md` (zero-padded)

## Key Rules

- **Brand**: Primary `#F65314`, Accent `#7C3AED`; fonts: Plus Jakarta Sans (heading), Inter (body); CSS vars injected by `themePlugin.ts`
- **Never `bg-white`** — use `bg-background` (page/section) or `bg-card` (card); breaks dark mode
- **`@theme inline`** in `index.css` required for Tailwind v4 + shadcn — do not revert
- **Tailwind tokens** — use semantic tokens (`bg-primary`, `text-muted-foreground`), responsive variants, consistent spacing
- **`cn()`** — only when needed: conditional classes, merging external `className`, or long multi-expression strings
- **Fully static** — no server-side logic, API routes, or dynamic data fetching
- **`scripts/` conventions**: new scripts go under `scripts/` (included in `tsconfig.node.json`); use `import * as path from 'path'` — `esModuleInterop` is off
- **Curly braces always** in `if`/`else`/`for`/`while` bodies — body always on new line (ESLint enforced)
- **Named condition variables** — extract non-trivial boolean expressions into named `const` (e.g., `const hasUnused = unused.length > 0`)

## Reference Docs

- **[`ai/docs/architecture.md`](./ai/docs/architecture.md)** — tech stack, routes, SSG setup, workflow, file naming, dark mode, gotchas
- **[`ai/docs/data-map.md`](./ai/docs/data-map.md)** — full JSON → type module → component mapping
- **[`ai/docs/portfolioStructure.md`](./ai/docs/portfolioStructure.md)** — nested portfolio folder structure, case schema, adding new cases
