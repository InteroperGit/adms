# CLAUDE.md — advertise-agency-landing-core

## Project Overview

Landing page for **РА "Рекламастер"** — a full-cycle advertising agency. This is a **rewrite/replacement** of `advertise-agency-site` with a cleaner architecture using Vite instead of Next.js. Fully static — no backend or CMS integration.

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Framework   | Vite 7 + React 19 + TypeScript 5.9     |
| Styling     | Tailwind CSS v4 + shadcn/ui            |
| Package mgr | pnpm                                    |
| Linting     | ESLint + Prettier                       |
| Icons       | lucide-react                            |

## Brand

- **Primary color:** `#F65314` (orange-red) — buttons, accents, logo
- **Accent color:** `#7C3AED` (violet) — gradients, highlights
- **Heading font:** Plus Jakarta Sans (300–800)
- **Body font:** Inter (300–600)
- **CSS variables** defined in `src/index.css` under `@layer base :root`
- **Tailwind utilities** mapped via `@theme inline` — all `bg-primary`, `text-primary-foreground` etc. resolve through CSS vars

## Project Structure

```
advertise-agency-landing-core/
├── ai/
│   └── tasks/
│       └── 001_create_landing_structure.md   # Full build plan
├── public/                  # Static assets (favicon, images)
├── src/
│   ├── assets/              # Images, SVGs imported in components
│   ├── components/
│   │   ├── layout/
│   │   │   └── Container.tsx          # Centered max-w-7xl wrapper, polymorphic `as` prop
│   │   ├── sections/
│   │   │   ├── Header.tsx             # Sticky header, scroll-aware bg, logo
│   │   │   ├── HeaderDesktopNav.tsx   # Nav links + CTA (hidden on mobile)
│   │   │   ├── HeaderMobileNav.tsx    # Hamburger + dropdown (hidden on desktop)
│   │   │   ├── Hero.tsx               # Full-viewport hero, gradient bg, stats
│   │   │   ├── About.tsx              # Two-column: story + info card
│   │   │   ├── Services.tsx           # 6-card grid, icon map from constants
│   │   │   ├── Portfolio.tsx          # Category filter + 6 project cards
│   │   │   ├── Advantages.tsx         # Dark bg, 6 glassmorphism cards
│   │   │   └── Testimonials.tsx       # Carousel + desktop thumbnail strip
│   │   └── ui/                        # shadcn/ui primitives — DO NOT edit manually
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── separator.tsx
│   │       └── textarea.tsx
│   ├── hooks/
│   │   └── useScrolled.ts    # Passive scroll listener, returns bool after threshold
│   ├── lib/
│   │   ├── constants.ts      # All static content: SITE_NAME, NAV_LINKS, SERVICES, PORTFOLIO_ITEMS, etc.
│   │   └── utils.ts          # cn() helper (clsx + tailwind-merge)
│   ├── types/
│   │   └── index.ts          # Shared TypeScript types
│   ├── App.tsx               # Root: composes all sections in order
│   ├── main.tsx              # Entry point
│   └── index.css             # Google Fonts import, Tailwind, CSS vars, base styles
├── .env.example
├── .prettierrc
├── components.json           # shadcn/ui config (aliases use src/ paths)
├── index.html                # title: РА «Рекламастер», preconnect for fonts
├── tsconfig.app.json         # paths: @/* → ./src/*
└── vite.config.ts            # @tailwindcss/vite plugin, resolve alias @/ → src/
```

## Page Composition (App.tsx order)

```
<Header />          sticky nav
<Hero />            #— (full-viewport)
<About />           #about
<Services />        #services
<Portfolio />       #portfolio
<Advantages />      #advantages  (dark section)
<Testimonials />    #testimonials
<!-- Contact />     #contact     (TODO: task 5.1) -->
<!-- Footer />                   (TODO: task 6.1) -->
```

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (http://localhost:5173)
pnpm build            # Production build → dist/
pnpm preview          # Preview production build locally
pnpm lint             # Run ESLint
pnpm format           # Run Prettier over src/**/*.{ts,tsx,css}
```

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add <component>
```

Files are placed in `src/components/ui/` — never edit them manually.

## Conventions

- **Components**: PascalCase files, one component per file
- **Static content**: all data lives in `src/lib/constants.ts` as typed exports
- **Icon maps**: icons referenced by string key in constants, resolved to `LucideIcon` in the component via a local `ICON_MAP` record
- **Tailwind**: use `cn()` from `@/lib/utils` for conditional class merging
- **Sections**: self-contained in `src/components/sections/`, import Container for layout
- **No routing**: single-page layout, anchor links only
- **Path alias**: `@/` resolves to `src/` in both Vite and TypeScript

## Key Rules

- Package manager is **pnpm only** — never use npm or yarn
- Do not add server-side logic, API routes, or dynamic data fetching (fully static)
- Keep bundle lean — prefer Tailwind utilities over custom CSS
- Do not install heavy animation libraries unless explicitly requested
- `@theme inline` in `index.css` is required for Tailwind v4 + shadcn compatibility — do not revert to `@theme`
