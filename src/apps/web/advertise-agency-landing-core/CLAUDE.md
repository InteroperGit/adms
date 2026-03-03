# CLAUDE.md — advertise-agency-landing-core

## Project Overview

Landing page for **РА "Рекламастер"** — a full-cycle advertising agency. This is a **rewrite/replacement** of `advertise-agency-site` with a cleaner architecture using Vite instead of Next.js. Fully static — no backend or CMS integration.

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Framework   | Vite 7 + React 19 + TypeScript 5.9     |
| SSG         | vite-react-ssg 0.9.1-beta.1            |
| Routing     | react-router-dom v6 (RouteObject[])    |
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
├── data/                    # JSON data — gitignored (except _schema/)
│   ├── _schema/             # Schema examples — git-tracked
│   │   ├── portfolio.example.json
│   │   └── site.example.json
│   ├── portfolio/           # One JSON file per case study (slug.json)
│   │   └── bodrost.json
│   └── site.json            # Global site config: phone, email, address, social, hours
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
│   │   │   ├── About.tsx              # Two-column: story + info card (uses site.json)
│   │   │   ├── Services.tsx           # 6-card grid, icon map from constants
│   │   │   ├── Portfolio.tsx          # Category filter + project cards (from data/portfolio/)
│   │   │   ├── Advantages.tsx         # Dark bg, 6 glassmorphism cards
│   │   │   ├── CallToAction.tsx       # Mid-page CTA banner
│   │   │   ├── Testimonials.tsx       # Carousel + desktop thumbnail strip
│   │   │   ├── Contact.tsx            # Contact form + info (uses site.json)
│   │   │   └── Footer.tsx             # Site footer (uses site.json)
│   │   └── ui/                        # shadcn/ui primitives — DO NOT edit manually
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── separator.tsx
│   │       └── textarea.tsx
│   ├── hooks/
│   │   ├── useScrolled.ts       # Passive scroll listener, returns bool after threshold
│   │   └── useActiveSection.ts  # Tracks active section for nav highlight
│   ├── lib/
│   │   ├── constants.ts      # SERVICES, ADVANTAGES, ABOUT_VALUES, TESTIMONIALS, NAV_LINKS
│   │   └── utils.ts          # cn() helper (clsx + tailwind-merge)
│   ├── pages/
│   │   └── PortfolioCasePage.tsx  # Generic SSG page for portfolio case studies
│   ├── types/
│   │   ├── index.ts           # Shared TypeScript types
│   │   └── portfolio.ts       # PortfolioCase interface
│   ├── router.tsx             # RouteObject[] — "/" and "/portfolio/:slug"
│   ├── main.tsx               # Entry: exports createRoot = ViteReactSSG({ routes })
│   └── index.css              # Google Fonts import, Tailwind, CSS vars, base styles
├── .env.example
├── .prettierrc
├── components.json           # shadcn/ui config (aliases use src/ paths)
├── index.html                # title: РА «Рекламастер», preconnect for fonts
├── tsconfig.app.json         # paths: @/* → ./src/*, resolveJsonModule: true
└── vite.config.ts            # @tailwindcss/vite plugin, @/ and @data aliases, ssgOptions
```

## Page Composition (App.tsx order)

```
<Header />          sticky nav
<Hero />            #— (full-viewport)
<About />           #about
<Services />        #services
<Portfolio />       #portfolio
<Advantages />      #advantages  (dark section)
<CallToAction />    mid-page CTA
<Testimonials />    #testimonials
<Contact />         #contact
<Footer />
```

## Routes

```
/                    → App.tsx (full landing page)
/portfolio/:slug     → PortfolioCasePage.tsx (SSG per JSON file in data/portfolio/)
```

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (http://localhost:5173)
pnpm build            # Production SSG build → dist/  (tsc -b && vite-react-ssg build)
pnpm preview          # Preview production build locally
pnpm lint             # Run ESLint
pnpm format           # Run Prettier over src/**/*.{ts,tsx,css}
```

## Data Architecture

- **`data/site.json`** — global site config (phone, email, address, social links, hours). Used by `About.tsx`, `Header.tsx`, `Contact.tsx`, `Footer.tsx`.
- **`data/portfolio/<slug>.json`** — one file per portfolio case study, typed as `PortfolioCase` (`src/types/portfolio.ts`).
- `data/` is at project root (not inside `src/`); path alias `@data` → `./data`.
- Portfolio JSONs loaded via `import.meta.glob('@data/portfolio/*.json', { eager: true, import: 'default' })`.
- Schema examples tracked in `data/_schema/` — the actual data files are gitignored.

## SSG Build

- `vite-react-ssg` with `dirStyle: 'nested'` → `dist/portfolio/<slug>/index.html`.
- `includedRoutes` in `vite.config.ts` auto-discovers slugs by reading `data/portfolio/*.json`.
- `vite.config.ts` imports `'vite-react-ssg'` to activate `ssgOptions` type augmentation.

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add <component>
```

Files are placed in `src/components/ui/` — never edit them manually.

## Conventions

- **Components**: PascalCase files, one component per file
- **Static content**: site-agnostic data in `src/lib/constants.ts`; site-specific config in `data/site.json`; portfolio data in `data/portfolio/*.json`
- **Icon maps**: icons referenced by string key in constants, resolved to `LucideIcon` in the component via a local `ICON_MAP` record
- **Tailwind**: use `cn()` from `@/lib/utils` for conditional class merging
- **Sections**: self-contained in `src/components/sections/`, import Container for layout
- **Path aliases**: `@/` → `src/`, `@data` → `data/` (root-level)

## Key Rules

- Package manager is **pnpm only** — never use npm or yarn
- Do not add server-side logic, API routes, or dynamic data fetching (fully static SSG)
- Keep bundle lean — prefer Tailwind utilities over custom CSS
- Do not install heavy animation libraries unless explicitly requested
- `@theme inline` in `index.css` is required for Tailwind v4 + shadcn compatibility — do not revert to `@theme`
- Use **react-router-dom v6** (not v7) — required by vite-react-ssg peer dependency
