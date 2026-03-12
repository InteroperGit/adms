# CLAUDE.md — advertise-agency-landing-core

## Project Overview

Landing page for **РА "Рекламастер"** — full-cycle advertising agency. Fully static SSG — no backend.

**White-label kit**: swap `data/` + `theme.json` to brand for a new client with zero component changes. See `data/README.md` and run `pnpm new-client`.

## Brand

- **Primary:** `#F65314` (orange-red) — **Accent:** `#7C3AED` (violet)
- **Heading font:** Plus Jakarta Sans — **Body font:** Inter
- CSS vars injected at build time by `src/plugins/themePlugin.ts` from `data/content/config/theme.json`; never hardcoded in `index.css`
- `@theme inline` in `index.css` maps `bg-primary`, `text-primary-foreground` etc. through CSS vars

## Key Entry Points

```
src/main.tsx          # Entry: exports createRoot = ViteReactSSG({ routes })
src/router.tsx        # RouteObject[] — App root layout + all page routes
src/pages/            # Home, PortfolioPage, PortfolioCasePage, legal, OrderPage
src/components/
  sections/           # One folder per landing section (carousel, header, hero, …)
  portfolio/          # Listing UI (CategoryNav, PortfolioGrid, blocks/, Case*.tsx)
  ui/                 # shadcn primitives + shared UI (ImageGallery, OrderForm, …)
  analytics/ banners/ layout/
src/types/            # All Zod schemas, types, parsed consts — config/ sections/ portfolio/ shared/
src/hooks/            # useFadeIn, useActiveSection, useDarkMode, useCookieConsent, …
src/plugins/          # themePlugin, imageResizePlugin, ssgMetaPlugin
src/lib/              # cn(), categorySlug(), imageSrcSet helpers
scripts/              # validate.ts, generate-json-schemas.ts, new-client.ts
data/content/         # JSON data (gitignored except _schema/)
data/_schema/         # Git-tracked schema examples + generated JSON Schema files
```

## Layout (App.tsx)

```
<Header />          in-flow nav, bg-background border-b
<Outlet />
<Footer />
<ScrollToTop />     fixed bottom-right, visible after 300px
<CookieBanner />    fixed bottom-left, persists consent to localStorage
<MetrikaScript />   renderless; injects Yandex Metrika when consent==='all'
```

## Home Page (Home.tsx — "/")

```
<Carousel />      full-bleed slider, 70vh
<Hero />          #hero
<About />         #about
<Services />      #services
<Portfolio />     #portfolio
<Advantages />    #advantages  (dark section)
<CallToAction />  mid-page CTA
<Testimonials />  #testimonials
<Contact />       #contact
```

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
pnpm new-client   # Interactive CLI: bootstrap data/content/ for a new client
```

## Reference Docs

- **[`ai/docs/architecture.md`](./ai/docs/architecture.md)** — tech stack, routes, SSG setup, workflow, file naming, dark mode, gotchas
- **[`ai/docs/data-map.md`](./ai/docs/data-map.md)** — full JSON → type module → component mapping

## Data Architecture

Full mapping → **[`ai/docs/data-map.md`](./ai/docs/data-map.md)**

Key rules:
- `@data` alias → `./data/content`; components never import from `@data/` — always via `src/types/`
- Each type module exports: Zod schema, inferred type, parsed const. **No `satisfies`** — Zod parse replaces it
- Icons in JSON are string keys resolved via `ICON_MAP` from `src/types/shared/iconMap.ts`

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add <component>
# Output → src/components/ui/ — never edit these files manually
```

## Conventions

- `SectionBadge` (`src/components/ui/SectionBadge.tsx`) — shared label pill; props: `label`, `variant?` (`'light'|'dark'`), `className?`; used by `SectionHeader` and `About`; Hero keeps its own inline badge (dot + responsive size)
- **Imports**: components use `@/types/`, never `@data/`; `cn()` from `@/lib/utils`; `categorySlug()` from `@/lib/categorySlug`
- **Sections**: self-contained in `src/components/sections/`, use `Container` for layout
- **Path aliases**: `@/` → `src/`, `@data` → `data/content`
- **Plan files** in `ai/tasks/`: `NNN_planName.md` (zero-padded, camelCase)

## Key Rules

- **Never `bg-white`** — use `bg-background` (page/section) or `bg-card` (card surface); raw white breaks dark mode
- **After modifying any component**, review Tailwind classes — use semantic tokens (`bg-primary`, `text-muted-foreground`), responsive variants, consistent spacing
- **`cn()`** — only when needed: conditional classes, merging external `className`, or long multi-expression strings; short static strings stay as plain literals
- **Fully static** — no server-side logic, API routes, or dynamic data fetching
- **`@theme inline`** in `index.css` required for Tailwind v4 + shadcn — do not revert to `@theme`
- **`scripts/` conventions**: new scripts go under `scripts/` (included in `tsconfig.node.json`); use `import * as path from 'path'` — `esModuleInterop` is off
- **Curly braces always** in `if`/`else`/`for`/`while` bodies — enforced by ESLint `curly: ['error', 'all']`; body always on new line
