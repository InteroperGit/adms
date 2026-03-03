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
│   │   ├── about-values.example.json
│   │   ├── advantages.example.json
│   │   ├── portfolio.example.json
│   │   ├── services.example.json
│   │   ├── site.example.json
│   │   └── testimonials.example.json
│   ├── portfolio/           # One JSON file per case study (slug.json)
│   │   └── bodrost.json
│   ├── about-values.json    # About section values list: [{ title, description }]
│   ├── advantages.json      # Advantages list: [{ icon, title, description }]
│   ├── services.json        # Services list: [{ icon, title, description }]
│   ├── testimonials.json    # Testimonials: [{ id, name, role, company, avatar, avatarColor, rating, text }]
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
│   │   │   ├── About.tsx              # Two-column: story + info card (siteData, aboutValues)
│   │   │   ├── Services.tsx           # 6-card grid, ICON_MAP resolves icon strings (services)
│   │   │   ├── Portfolio.tsx          # Category filter + project cards (portfolioCaseMap)
│   │   │   ├── Advantages.tsx         # Dark bg, 6 glassmorphism cards (advantages)
│   │   │   ├── CallToAction.tsx       # Mid-page CTA banner
│   │   │   ├── Testimonials.tsx       # Carousel + desktop thumbnail strip (testimonials)
│   │   │   ├── Contact.tsx            # Contact form + info (siteData)
│   │   │   └── Footer.tsx             # Site footer (siteData)
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
│   │   ├── constants.ts        # NAV_LINKS (only remaining constant)
│   │   ├── aboutValues.ts      # aboutValues: AboutValue[] — loaded from data/about-values.json
│   │   ├── advantages.ts       # advantages: Advantage[] — loaded from data/advantages.json; exports Advantage type
│   │   ├── portfolioCases.ts   # portfolioCaseMap: Record<slug, PortfolioCase> — glob-loaded from data/portfolio/
│   │   ├── services.ts         # services: Service[] — loaded from data/services.json; exports Service type
│   │   ├── siteData.ts         # siteData: SiteData — loaded from data/site.json; exports SiteData type
│   │   ├── testimonials.ts     # testimonials: Testimonial[] — loaded from data/testimonials.json; exports Testimonial type
│   │   └── utils.ts            # cn() helper (clsx + tailwind-merge)
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

- **`data/site.json`** — global site config (phone, email, address, social links, hours). Exposed via `src/lib/siteData.ts`; used by `About.tsx`, `Header.tsx`, `Contact.tsx`, `Footer.tsx`.
- **`data/about-values.json`** — array of `{ title, description }` for the About section values list. Exposed via `src/lib/aboutValues.ts`; used by `About.tsx`.
- **`data/advantages.json`** — array of `{ icon, title, description }` for the Advantages section. Exposed via `src/lib/advantages.ts`; used by `Advantages.tsx`. The `icon` field is a string key resolved to a `LucideIcon` via `ICON_MAP` in `Advantages.tsx`.
- **`data/services.json`** — array of `{ icon, title, description }` for the Services section. Exposed via `src/lib/services.ts`; used by `Services.tsx` and `Footer.tsx`. The `icon` field is a string key resolved to a `LucideIcon` via `ICON_MAP` in `Services.tsx`.
- **`data/testimonials.json`** — array of testimonial objects. Exposed via `src/lib/testimonials.ts`; used by `Testimonials.tsx` and `PortfolioCasePage.tsx` (looked up by `id` via `testimonialId` on a portfolio case).
- **`data/portfolio/<slug>.json`** — one file per portfolio case study, typed as `PortfolioCase` (`src/types/portfolio.ts`).
- `data/` is at project root (not inside `src/`); path alias `@data` → `./data`.
- Components **never** import from `@data/` directly — always go through a `src/lib/` module.
- Single JSON files wrapped in a typed lib module: `siteData.ts`, `aboutValues.ts`, `advantages.ts`, `services.ts`, `testimonials.ts` (uses `resolveJsonModule`).
- Portfolio collection loaded via `import.meta.glob('@data/portfolio/*.json', { eager: true, import: 'default' })` — see `src/lib/portfolioCases.ts`.
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
- **Static content**: code-only data (icons, IDs, nav links) in `src/lib/constants.ts`; editable content in `data/*.json` exposed through `src/lib/` modules — components always import from `@/lib/`, never from `@data/` directly
- **Icon maps**: icons referenced by string key in JSON data (`icon` field), resolved to `LucideIcon` in the component via a local `ICON_MAP` record (see `Services.tsx`, `Advantages.tsx`)
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
- Use **native DOM event types** in handlers — React 19 deprecated synthetic event aliases (`React.FormEvent`, `React.MouseEvent`, etc.); use `SubmitEvent`, `MouseEvent`, `InputEvent` etc. instead
