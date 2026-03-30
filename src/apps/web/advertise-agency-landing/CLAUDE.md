# CLAUDE.md — advertise-agency-landing

## Project Overview

Landing page for **РА "Рекламастер"** — fully static SSG, no backend. **White-label kit**: swap `data/` + `theme.json` for new clients with zero component changes. Run `pnpm new-client`.

## Key Structure

```
src/entry.client.tsx # Entry: HydratedRouter
src/routes.ts        # RouteConfig[] — all page routes
src/pages/         # Home, PortfolioPage, PortfolioCategoryPage, PortfolioCasePage, NotFound, legal
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
- **[`ai/docs/data-map.md`](./ai/docs/data-map.md)** — JSON → types → component data-flow map
- **[`ai/docs/typesStructure.md`](./ai/docs/typesStructure.md)** — `src/types/` subfolder structure (config, sections, portfolio, blocks, shared)
- **[`ai/docs/legal.md`](./ai/docs/legal.md)** — Legal page content structure and rendering
- **[`ai/docs/blocks.md`](./ai/docs/blocks.md)** — Content block types for portfolio cases
- **[`ai/docs/portfolioStructure.md`](./ai/docs/portfolioStructure.md)** — Portfolio nested-folder hierarchy, publishDate, case file format
- **[`ai/docs/components.md`](./ai/docs/components.md)** — Section layout order for Home and component composition guide
- **[`ai/docs/hooks.md`](./ai/docs/hooks.md)** — Custom hooks reference (useInViewport, useCountUp, useTheme, etc.)
- **[`ai/docs/dark-mode.md`](./ai/docs/dark-mode.md)** — ThemeContext, DarkModeToggle, and dark-mode CSS conventions
- **[`ai/docs/images.md`](./ai/docs/images.md)** — OptimizedImage component, lazy loading, srcset patterns
- **[`ai/docs/errorHandling.md`](./ai/docs/errorHandling.md)** — ErrorBoundary layers, global error handler, dev-mode overlay
- **[`ai/docs/conventions.md`](./ai/docs/conventions.md)** — File naming, import order, code style rules
- **[`ai/docs/devWorkflow.md`](./ai/docs/devWorkflow.md)** — Dev commands, build pipeline, preview server
- **[`ai/docs/unitTests.md`](./ai/docs/unitTests.md)** — Unit test stack, mock patterns, conventions, and coverage map
- **[`ai/docs/integrationTests.md`](./ai/docs/integrationTests.md)** — Playwright e2e + Vitest integration tests (patterns, skip guards, mock scope)
- **[`ai/docs/deployment.md`](./ai/docs/deployment.md)** — S3 deployment guide, manifest-based selective sync, troubleshooting
