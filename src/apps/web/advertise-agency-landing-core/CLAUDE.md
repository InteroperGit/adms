# CLAUDE.md — advertise-agency-landing-core

## Project Overview

Landing page for **РА "Рекламастер"** — fully static SSG, no backend. **White-label kit**: swap `data/` + `theme.json` for new clients with zero component changes. Run `pnpm new-client`.

## Key Structure

```
src/main.tsx       # Entry: ViteReactSSG({ routes })
src/router.tsx     # RouteObject[] — all page routes
src/pages/         # Home, PortfolioPage, PortfolioCategoryPage, PortfolioCasePage, NotFound, legal, OrderPage
src/components/    # sections/ | portfolio/ | ui/ | analytics/ | banners/ | layout/
src/types/         # Zod schemas + parsed consts (config/ sections/ portfolio/ blocks/ shared/)
src/hooks/         # useFadeIn, useActiveSection, useTheme, useCookieConsent, useSwipe, useRandomButtonHighlight, useInViewport
src/contexts/      # ThemeContext (dark mode)
src/plugins/       # themePlugin, imageResizePlugin, ssgMetaPlugin
scripts/           # validate.ts, generate-json-schemas.ts, new-client.ts
data/content/      # JSON data (gitignored except _schema/)
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
pnpm dev              # Dev server
pnpm build            # SSG build → dist/
pnpm format           # Format code
pnpm typecheck        # Type check
pnpm lint             # Lint
pnpm validate         # Validate JSON
pnpm gen-schemas      # Generate schemas
pnpm new-client       # Bootstrap new client
```

## Reference Documentation

Detailed documentation is organized in `ai/docs/`:

- **[`ai/docs/architecture.md`](./ai/docs/architecture.md)** — Tech stack, routes, SSG setup, gotchas
- **[`ai/docs/data-map.md`](./ai/docs/data-map.md)** — Full JSON → type module → component mapping
- **[`ai/docs/hooks.md`](./ai/docs/hooks.md)** — Custom hooks API reference (useInViewport, useRandomButtonHighlight, useTheme, etc.)
- **[`ai/docs/portfolioStructure.md`](./ai/docs/portfolioStructure.md)** — Portfolio structure, nesting, adding cases
- **[`ai/docs/components.md`](./ai/docs/components.md)** — Section components, portfolio UI, header, carousel
- **[`ai/docs/dark-mode.md`](./ai/docs/dark-mode.md)** — Dark mode architecture, ThemeContext, CSS
- **[`ai/docs/errorHandling.md`](./ai/docs/errorHandling.md)** — Error boundaries, global error handlers, dev vs. prod behavior, debugging, and manual verification tests
- **[`ai/docs/conventions.md`](./ai/docs/conventions.md)** — Code style, naming, imports, React 19 patterns
- **[`ai/docs/images.md`](./ai/docs/images.md)** — OptimizedImage component, Skeleton, lazy loading patterns
- **[`ai/docs/devWorkflow.md`](./ai/docs/devWorkflow.md)** — Development workflow, commands, new-client CLI
