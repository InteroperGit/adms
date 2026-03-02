# CLAUDE.md — advertise-agency-landing-core

## Project Overview

Landing page for an advertising agency. This is a **rewrite/replacement** of `advertise-agency-site` with a cleaner architecture using Vite instead of Next.js. Fully static — no backend or CMS integration.

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Vite + React 18 + TypeScript        |
| Styling     | Tailwind CSS + shadcn/ui            |
| Package mgr | pnpm                                |
| Linting     | ESLint + Prettier                   |

## Project Structure

```
advertise-agency-landing-core/
├── public/                  # Static assets (images, fonts, favicon)
├── src/
│   ├── assets/              # Images, SVGs imported in components
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives (auto-generated, do not edit manually)
│   │   └── sections/        # Page sections (Hero, About, Services, Portfolio, Contact, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities (cn helper, constants, etc.)
│   ├── types/               # Shared TypeScript types
│   ├── App.tsx              # Root component, section composition
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind base imports + CSS variables
├── .env                     # Environment variables (do not commit secrets)
├── .env.example             # Template for env vars
├── components.json          # shadcn/ui config
├── index.html               # Vite HTML entry
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (http://localhost:5173)
pnpm build            # Production build → dist/
pnpm preview          # Preview production build locally
pnpm lint             # Run ESLint
pnpm format           # Run Prettier
```

## Conventions

- **Components**: PascalCase files, one component per file
- **shadcn/ui**: Add components via `pnpm dlx shadcn@latest add <component>` — never edit `src/components/ui/` manually
- **Tailwind**: Use `cn()` from `src/lib/utils.ts` for conditional class merging
- **Types**: Define shared types in `src/types/`, co-locate component-specific types in the component file
- **Sections**: Each page section is a self-contained component in `src/components/sections/`
- **No pages/routing**: Single-page layout, no React Router needed
- **Static data**: Hardcoded content lives in `src/lib/constants.ts` or alongside the section component

## Key Rules

- Package manager is **pnpm only** — never use npm or yarn
- Do not add server-side logic, API routes, or dynamic data fetching (fully static)
- Keep the bundle lean — prefer Tailwind utilities over custom CSS
- Do not install heavy animation libraries unless explicitly requested
