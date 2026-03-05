# CLAUDE.md — advertise-agency-landing-core

## Project Overview

Landing page for **РА "Рекламастер"** — a full-cycle advertising agency. This is a **rewrite/replacement** of `advertise-agency-site` with a cleaner architecture using Vite instead of Next.js. Fully static — no backend or CMS integration.

Built as a **white-label kit**: swap the `data/` folder and `theme.json` to produce a fully branded site for a new client with zero component code changes. See `data/README.md` for the new-client setup guide.

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
- **CSS variables** injected at build time by `src/plugins/themePlugin.ts` from `data/theme.json` — not hardcoded in `index.css`
- **Tailwind utilities** mapped via `@theme inline` in `index.css` — all `bg-primary`, `text-primary-foreground` etc. resolve through CSS vars
- **Google Fonts** `<link>` tags also injected by `themePlugin` from `theme.fontUrls`

## Project Structure

```
advertise-agency-landing-core/
├── ai/
│   └── tasks/
│       ├── 001_create_landing_structure.md   # Full build plan
│       ├── 002_improve_site.md               # White-label reusability plan
│       └── 003_improve_site.md               # Component decomposition plan (max 60 lines per component)
├── data/                    # JSON data — gitignored (except _schema/ and README.md)
│   ├── README.md            # New-client setup guide: what each JSON file does, how to configure
│   ├── _schema/             # Schema examples — git-tracked
│   │   ├── about-values.example.json
│   │   ├── advantages.example.json
│   │   ├── carousel.example.json
│   │   ├── content.example.json
│   │   ├── theme.example.json
│   │   ├── legal.example.json
│   │   ├── portfolio.example.json
│   │   ├── services.example.json
│   │   ├── site.example.json
│   │   └── testimonials.example.json
│   ├── portfolio/           # One JSON file per case study (slug.json)
│   │   └── bodrost.json
│   ├── content.json             # All UI copy: nav, hero, about, services, portfolio, CTA, contact, footer, cookies, etc.
│   ├── theme.json               # Brand identity: HSL colors, border radius, font families, Google Fonts URLs
│   ├── legal.json               # Legal company data: company.{name,inn,ogrn,legalAddress,siteUrl,email,phone,responsible}, documents.{privacyPolicy,consent,userAgreement} each {version,effectiveDate}
│   ├── about-values.json    # About section values list: [{ title, description }]
│   ├── carousel.json        # Hero carousel slides: [{ id, image, alt, gradient, title, subtitle }]
│   ├── advantages.json      # Advantages list: [{ icon, title, description }]
│   ├── services.json        # Services list: [{ icon, title, description }]
│   ├── testimonials.json    # Testimonials: [{ id, name, role, company, avatar, avatarColor, rating, text }]
│   └── site.json            # Global site config: phone, email, address, social, hours
├── public/                  # Static assets (favicon, images)
├── src/
│   ├── assets/              # Images, SVGs imported in components
│   ├── components/
│   │   ├── banners/
│   │   │   └── CookieBanner.tsx       # Fixed bottom/bottom-left cookie consent dialog; saves 'all'|'necessary' to localStorage
│   │   ├── layout/
│   │   │   └── Container.tsx          # Centered max-w-7xl wrapper, polymorphic `as` prop
│   │   ├── sections/
│   │   │   ├── carousel/
│   │   │   │   ├── index.tsx          # Thin orchestrator: state + timer + CarouselSlide + CarouselControls; imported as '@/components/sections/carousel'
│   │   │   │   ├── CarouselSlide.tsx  # Single slide renderer (gradient or image bg + label/title/subtitle); props: slide, isActive
│   │   │   │   └── CarouselControls.tsx # Prev/next arrows + dot indicators + slide counter; props: total, current, onPrev, onNext, onDot
│   │   │   ├── Header.tsx             # In-flow header, solid white bg, border-b, logo
│   │   │   ├── HeaderDesktopNav.tsx   # Nav links + CTA (hidden on mobile); links show underline on hover
│   │   │   ├── HeaderMobileNav.tsx    # Hamburger + dropdown (hidden on desktop)
│   │   │   ├── hero/
│   │   │   │   ├── index.tsx          # Thin orchestrator: badge + title + subtitle + HeroCTA + HeroStats; imported as '@/components/sections/hero'
│   │   │   │   ├── HeroCTA.tsx        # Two CTA buttons (primary + outline); props: cta: { label, href }[]
│   │   │   │   └── HeroStats.tsx      # 3-stat grid with icon + value + label; props: stats: { value, label }[]
│   │   │   ├── about/
│   │   │   │   ├── index.tsx          # Thin orchestrator: label + h2 + text + values list + AboutCard; imported as '@/components/sections/about'
│   │   │   │   └── AboutCard.tsx      # Right-side info card: logo letter + company name + tagline + stats grid + NPS badge; props: card: Content['about']['card']
│   │   │   ├── Services.tsx           # 6-card grid, ICON_MAP from iconMap.ts resolves icon strings (services)
│   │   │   ├── Portfolio.tsx          # Category filter + project cards (portfolioCaseMap)
│   │   │   ├── Advantages.tsx         # Dark bg, 6 glassmorphism cards, ICON_MAP from iconMap.ts (advantages)
│   │   │   ├── CallToAction.tsx       # Mid-page CTA banner
│   │   │   ├── Testimonials.tsx       # Carousel + desktop thumbnail strip (testimonials)
│   │   │   ├── contact/
│   │   │   │   ├── index.tsx              # Thin orchestrator: SectionHeader + ContactForm + ContactInfo + ContactHours; imported as '@/components/sections/contact'
│   │   │   │   ├── ContactForm.tsx        # Form state + submit; renders ContactFormFields + ContactConsent + button; shows ContactSuccess on success
│   │   │   │   ├── ContactFormFields.tsx  # Three input fields (name, contact, message); props: form, onChange; reads labels from content
│   │   │   │   ├── ContactConsent.tsx     # Consent checkbox + legal links; props: checked, onChange; reads text from content
│   │   │   │   ├── ContactSuccess.tsx     # Success panel (icon + title + text + reset button); prop: onReset
│   │   │   │   ├── ContactInfo.tsx        # Phone/email/address list + SocialLinks
│   │   │   │   └── ContactHours.tsx       # Working hours card (weekdays/saturday/sunday from siteData)
│   │   │   └── footer/
│   │   │       ├── index.tsx          # Thin orchestrator: 4-col grid + Separator + FooterBottom; imported as '@/components/sections/footer'
│   │   │       ├── FooterBrand.tsx    # Logo, description, SocialLinks (dark variant)
│   │   │       ├── FooterNav.tsx      # Nav links column (from content.nav)
│   │   │       ├── FooterServices.tsx # First 4 service titles linking to #services
│   │   │       ├── FooterContact.tsx  # Phone, email, address with lucide icons
│   │   │       └── FooterBottom.tsx   # Copyright + legal links nav + tagline
│   │   └── ui/                        # shadcn/ui primitives — DO NOT edit manually
│   │       ├── BackButton.tsx         # Fixed top-right back button (pill style, z-50, always visible) used on legal pages
│   │       ├── SectionHeader.tsx      # Shared label badge + h2 + description block; props: label, title, description?, titleHighlight?, variant ('light'|'dark'), className
│   │       ├── StarRating.tsx         # Shared star row; props: rating, size? (default 16), className? (wrapper), starClassName? (per-star, default fill-primary)
│   │       ├── TestimonialCard.tsx    # Shared blockquote card (stars + quote + avatar/name); props: testimonial, showQuoteIcon?, starSize?, starClassName?, className?
│   │       ├── SocialLinks.tsx        # Telegram + VK icon buttons; props: telegram, vk, variant ('light'|'dark'), className?; co-locates VkIcon SVG component
│   │       ├── PortfolioCard.tsx      # Full portfolio card (thumbnail + dark hover overlay + tags + details link); prop: item (PortfolioCase & { href }); reads detailsLabel from content
│   │       ├── TestimonialStrip.tsx   # Desktop-only 5-col thumbnail grid; props: active (index), onSelect (callback); reads testimonials directly
│   │       ├── ScrollToTop.tsx        # Fixed bottom-right button, appears after threshold scroll, scrolls to nav
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── separator.tsx
│   │       └── textarea.tsx
│   ├── hooks/
│   │   ├── useScrolled.ts       # Passive scroll listener, returns bool after threshold (unused since Header moved in-flow)
│   │   ├── useActiveSection.ts  # Tracks active section for nav highlight
│   │   └── useCookieConsent.ts  # Returns 'all'|'necessary'|null; reactive via CustomEvent 'cookie_consent_change'
│   ├── lib/
│   │   ├── content.ts         # content: Content — loaded from data/content.json; all UI copy
│   │   ├── aboutValues.ts      # aboutValues: AboutValue[] — loaded from data/about-values.json
│   │   ├── advantages.ts       # advantages: Advantage[] — loaded from data/advantages.json; exports Advantage type
│   │   ├── carousel.ts         # carouselSlides: CarouselSlide[] — loaded from data/carousel.json; exports CarouselSlide type
│   │   ├── iconMap.ts          # ICON_MAP: Record<string, LucideIcon> — shared icon registry; resolveIcon() helper
│   │   ├── legalData.ts        # legalData: LegalData — loaded from data/legal.json; used by legal pages
│   │   ├── portfolioCases.ts   # portfolioCaseMap: Record<slug, PortfolioCase> — glob-loaded from data/portfolio/
│   │   ├── services.ts         # services: Service[] — loaded from data/services.json; exports Service type
│   │   ├── siteData.ts         # siteData: SiteData — loaded from data/site.json; exports SiteData type
│   │   ├── testimonials.ts     # testimonials: Testimonial[] — loaded from data/testimonials.json; exports Testimonial type
│   │   └── utils.ts            # cn() helper (clsx + tailwind-merge)
│   ├── plugins/
│   │   └── themePlugin.ts     # Vite plugin: reads data/theme.json, injects CSS vars + Google Fonts into index.html
│   ├── pages/
│   │   ├── PortfolioCasePage.tsx  # Orchestrator: page header + Case* components + inline challenge section + TestimonialCard
│   │   ├── PrivacyPolicy.tsx      # /privacy-policy — reads legalData (company, documents.privacyPolicy.{version,effectiveDate})
│   │   ├── Consent.tsx            # /consent — reads legalData (company, documents.consent.{version,effectiveDate})
│   │   └── UserAgreement.tsx      # /user-agreement — reads legalData (company, documents.userAgreement.{version,effectiveDate})
│   ├── components/
│   │   ├── portfolio/
│   │   │   ├── CaseHero.tsx       # Gradient hero: badge, h1, description; props: gradient, category, title, description
│   │   │   ├── CaseOverview.tsx   # 4-col grid (client/category/year/services); reads labels from content
│   │   │   ├── CaseSolution.tsx   # 3-col solution cards with gradient accent bar; props: solution[], gradient
│   │   │   ├── CaseResults.tsx    # 3 gradient metric cards; props: results[], gradient
│   │   │   ├── CaseGallery.tsx    # Responsive image grid (first spans 2 cols if ≥3 images); props: gallery[], caseTitle
│   │   │   └── CaseCTA.tsx        # Bottom CTA block; reads content.portfolioCase.cta
│   ├── types/
│   │   ├── index.ts           # Shared TypeScript types
│   │   └── portfolio.ts       # PortfolioCase interface
│   ├── router.tsx             # RouteObject[] — "/", "/portfolio/:slug", "/privacy-policy", "/user-agreement", "/consent"
│   ├── main.tsx               # Entry: exports createRoot = ViteReactSSG({ routes })
│   └── index.css              # Tailwind import, @theme inline (references CSS vars), base styles, animate-fade-in keyframe; no hardcoded colors/fonts (injected by themePlugin)
├── .env.example
├── .prettierrc
├── components.json           # shadcn/ui config (aliases use src/ paths)
├── index.html                # title: РА «Рекламастер»; font preconnects injected by themePlugin
├── tsconfig.app.json         # paths: @/* → ./src/*, resolveJsonModule: true
└── vite.config.ts            # themePlugin + @tailwindcss/vite + @vitejs/plugin-react, @/ and @data aliases, ssgOptions
```

## Page Composition (App.tsx order)

```
<Header />          in-flow nav, solid white bg, border-b
<Carousel />        full-bleed slider, 70vh
<Hero />            #— (full-viewport)
<About />           #about
<Services />        #services
<Portfolio />       #portfolio
<Advantages />      #advantages  (dark section)
<CallToAction />    mid-page CTA
<Testimonials />    #testimonials
<Contact />         #contact
<Footer />
<ScrollToTop />     fixed bottom-right, z-50, visible after 300px scroll, navSelector="#main-nav"
<CookieBanner />    fixed bottom/bottom-left dialog, persists consent to localStorage
```

## Routes

```
/                    → App.tsx (full landing page)
/portfolio/:slug     → PortfolioCasePage.tsx (SSG per JSON file in data/portfolio/)
/privacy-policy      → PrivacyPolicy.tsx (static legal page)
/user-agreement      → UserAgreement.tsx (static legal page)
/consent             → Consent.tsx (cookie consent policy page)
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

- **`data/content.json`** — all UI copy (nav labels, hero text, section headings, form labels, footer, cookies, portfolio case labels). Exposed via `src/lib/content.ts`; used by all section components, `PortfolioCasePage`, `CookieBanner`, and `useActiveSection`. Supports template tokens (`{name}`, `{year}`, `{description}`) replaced at render time.
- **`data/theme.json`** — brand identity: HSL color values, border radius, font families, and Google Fonts URLs. Consumed at build time by `src/plugins/themePlugin.ts` which injects CSS vars and `<link>` tags into `index.html`.
- **`data/site.json`** — global site config (phone, email, address, social links, hours). Exposed via `src/lib/siteData.ts`; used by `About.tsx`, `Header.tsx`, `contact/ContactInfo.tsx`, `contact/ContactHours.tsx`, `footer/FooterBrand.tsx`, `footer/FooterContact.tsx`, `footer/FooterBottom.tsx`.
- **`data/about-values.json`** — array of `{ title, description }` for the About section values list. Exposed via `src/lib/aboutValues.ts`; used by `About.tsx`.
- **`data/carousel.json`** — array of `{ id, image, alt, gradient, title, subtitle }` for the top carousel. `image` is optional (uses `gradient` fallback when empty). Gradients use Tailwind `50/100` shades (near-white). Exposed via `src/lib/carousel.ts`; used by `Carousel.tsx`. No dark overlay — text uses `text-foreground`/`text-muted-foreground`.
- **`data/advantages.json`** — array of `{ icon, title, description }` for the Advantages section. Exposed via `src/lib/advantages.ts`; used by `Advantages.tsx`. The `icon` field is a string key resolved to a `LucideIcon` via `ICON_MAP` from `src/lib/iconMap.ts`.
- **`data/services.json`** — array of `{ icon, title, description }` for the Services section. Exposed via `src/lib/services.ts`; used by `Services.tsx` and `footer/FooterServices.tsx`. The `icon` field is a string key resolved to a `LucideIcon` via `ICON_MAP` from `src/lib/iconMap.ts`.
- **`data/testimonials.json`** — array of testimonial objects. Exposed via `src/lib/testimonials.ts`; used by `Testimonials.tsx` and `PortfolioCasePage.tsx` (looked up by `id` via `testimonialId` on a portfolio case).
- **`data/legal.json`** — company legal details: `company.{ name, inn, ogrn, legalAddress, siteUrl, email, phone, responsible }` and `documents.{ privacyPolicy, consent, userAgreement }` each with `{ version, effectiveDate }`. Exposed via `src/lib/legalData.ts`; used by `PrivacyPolicy.tsx`, `Consent.tsx`, `UserAgreement.tsx`. Gitignored — schema in `data/_schema/legal.example.json`.
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
- **Static content**: editable content in `data/*.json` exposed through `src/lib/` modules — components always import from `@/lib/`, never from `@data/` directly
- **Icon maps**: icons referenced by string key in JSON data (`icon` field), resolved to `LucideIcon` via the shared `ICON_MAP` in `src/lib/iconMap.ts`; import `ICON_MAP` or `resolveIcon()` from there — do not create local icon maps in components
- **Tailwind**: use `cn()` from `@/lib/utils` for conditional class merging
- **Sections**: self-contained in `src/components/sections/`, import Container for layout
- **Path aliases**: `@/` → `src/`, `@data` → `data/` (root-level)

## Workflow Rules

- After completing every task, always run in sequence:
  1. `pnpm format` — reformat all changed files
  2. `pnpm tsc -b --noEmit` — typecheck, fix any errors before finishing
  3. Update `CLAUDE.md` — reflect any new/changed files, data modules, components, routes, or conventions

## Key Rules

- Package manager is **pnpm only** — never use npm or yarn
- Do not add server-side logic, API routes, or dynamic data fetching (fully static SSG)
- Keep bundle lean — prefer Tailwind utilities over custom CSS
- Do not install heavy animation libraries unless explicitly requested
- `@theme inline` in `index.css` is required for Tailwind v4 + shadcn compatibility — do not revert to `@theme`
- Use **react-router-dom v6** (not v7) — required by vite-react-ssg peer dependency
- Use **native DOM event types** in handlers — React 19 deprecated synthetic event aliases (`React.FormEvent`, `React.MouseEvent`, etc.); use `SubmitEvent`, `MouseEvent`, `InputEvent` etc. instead
