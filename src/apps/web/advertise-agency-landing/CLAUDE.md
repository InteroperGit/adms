# CLAUDE.md — advertise-agency-landing

## Project Overview

Landing page for **РА "Рекламастер"** — fully static SSG, no backend. **White-label kit**: swap `data/` + `theme.json` for new clients with zero component changes. Run `pnpm new-client`.

## Key Structure

```
src/entry.client.tsx # Entry: HydratedRouter
src/routes.ts        # RouteConfig[] — all page routes
src/pages/         # Home, PortfolioPage, PortfolioCategoryPage, PortfolioCasePage, NotFound, legal, OrderPage
src/components/    # sections/ | portfolio/ | ui/ | analytics/ | banners/ | layout/
src/types/         # Zod schemas + parsed consts (config/ sections/ portfolio/ blocks/ shared/)
src/hooks/index.ts       # Consolidates all `use*` hooks for easier import (useAnimatedPillPosition, useCookieConsent, useCountUp, useDocumentTitle, useFadeIn, useInViewport, useRandomButtonHighlight, useScrollReset, useStaggeredReveal, useSwipe, useTheme, useViewportAnimation)
src/contexts/      # ThemeContext (dark mode)
src/plugins/       # themePlugin, imageResizePlugin, seoMetaPlugin, incrementalSSG
scripts/           # validate.ts, generate-json-schemas.ts, new-client.ts, postbuild-seo.ts, postbuild-cache.ts
data/content/      # JSON data (gitignored except _schema/)
ai/tasks/todo/     # Pending PDR task files
ai/tasks/done/     # Completed PDR task files (YYYY/MM/DD/filename.md)
```

## Key Rules

- **Brand**: Primary `#F65314`, Accent `#7C3AED`
- **Never `bg-white`** — use `bg-background` or `bg-card` (breaks dark mode)
- **Fully static** — no server-side logic or dynamic fetching
- **Components never import `@data/`** — always via `src/types/`
- **pnpm only** — never npm or yarn
- **Curly braces always** in `if`/`else`/`for`/`while` bodies

## Quick Commands

```bash
pnpm dev              # Dev server (react-router dev)
pnpm build            # SSG build → build/client/
pnpm format           # Format code
pnpm typecheck        # Type check
pnpm lint             # Lint
pnpm validate         # Validate JSON
pnpm gen-schemas      # Generate schemas
pnpm new-client       # Bootstrap new client
```

## Project: advertise-agency-landing
- Vite 8 + React 19 + TypeScript 5.9 + Tailwind v4 + shadcn/ui (bundler: Rolldown)
- Package manager: **pnpm only**
- Working dir: `D:\Projects\adms\src\apps\web\advertise-agency-landing`
- Branch: `adv-landing-core`

## Reference Documentation

Detailed documentation is organized in `ai/docs/`:

- **[`ai/docs/pdrWorkflow.md`](./ai/docs/pdrWorkflow.md)** — PDR step workflow, validation sequence, marking steps complete
- **[`ai/docs/architecture.md`](./ai/docs/architecture.md)** — Tech stack, routes, gotchas, and SSG setup
- **[`ai/docs/dataArchitecture.md`](./ai/docs/dataArchitecture.md)** — Data architecture, JSON schemas, new-client CLI
- **[`ai/docs/typesStructure.md`](./ai/docs/typesStructure.md)** — `src/types/` subfolder structure (config, sections, portfolio, blocks, shared)
- **[`ai/docs/legal.md`](./ai/docs/legal.md)** — Legal page content structure and rendering
- **[`ai/docs/blocks.md`](./ai/docs/blocks.md)** — Content block types for portfolio cases
