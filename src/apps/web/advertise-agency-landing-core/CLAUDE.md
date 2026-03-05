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
│   │   │   ├── CookieBanner.tsx       # Fixed bottom/bottom-left cookie consent dialog; saves 'all'|'necessary' to localStorage
│   │   │   └── CookieActions.tsx      # Two consent buttons (accept all / necessary only); props: onAcceptAll, onNecessaryOnly
│   │   ├── layout/
│   │   │   └── Container.tsx          # Centered max-w-7xl wrapper, polymorphic `as` prop
│   │   ├── sections/
│   │   │   ├── carousel/
│   │   │   │   ├── index.tsx          # Thin orchestrator: state + timer + CarouselSlide + CarouselControls; imported as '@/components/sections/carousel'
│   │   │   │   ├── CarouselSlide.tsx  # Single slide renderer (gradient or image bg + label/title/subtitle); props: slide, isActive
│   │   │   │   └── CarouselControls.tsx # Prev/next arrows + dot indicators + slide counter; props: total, current, onPrev, onNext, onDot
│   │   │   ├── header/
│   │   │   │   ├── index.tsx          # In-flow header, solid white bg, border-b, logo; imported as '@/components/sections/header'
│   │   │   │   ├── HeaderDesktopNav.tsx # Nav links + CTA (hidden on mobile); links show underline on hover; props: activeSection
│   │   │   │   └── HeaderMobileNav.tsx  # Hamburger + dropdown (hidden on desktop); props: activeSection
│   │   │   ├── hero/
│   │   │   │   ├── index.tsx          # Thin orchestrator: badge + title + subtitle + HeroCTA + HeroStats; imported as '@/components/sections/hero'
│   │   │   │   ├── HeroCTA.tsx        # Two CTA buttons (primary + outline); props: cta: { label, href }[]
│   │   │   │   └── HeroStats.tsx      # 3-stat grid with icon + value + label; props: stats: { value, label }[]
│   │   │   ├── about/
│   │   │   │   ├── index.tsx          # Thin orchestrator: label + h2 + text + values list + AboutCard; imported as '@/components/sections/about'
│   │   │   │   └── AboutCard.tsx      # Right-side info card: logo letter + company name + tagline + stats grid + NPS badge; props: card: Content['about']['card']
│   │   │   ├── services/
│   │   │   │   ├── index.tsx          # bg-muted section: SectionHeader + card grid; imported as '@/components/sections/services'
│   │   │   │   └── ServiceCard.tsx    # shadcn Card with icon + title + description; props: service: Service
│   │   │   ├── portfolio/
│   │   │   │   ├── index.tsx          # Thin orchestrator: SectionHeader + PortfolioFilter + card grid + CTA; imported as '@/components/sections/portfolio'
│   │   │   │   └── PortfolioFilter.tsx # Category filter buttons with active state; props: categories, active, onChange
│   │   │   ├── advantages/
│   │   │   │   ├── index.tsx          # Dark bg section: decorative circles + SectionHeader + card grid; imported as '@/components/sections/advantages'
│   │   │   │   └── AdvantageCard.tsx  # Glassmorphism card: icon + number + title + description; props: item, index
│   │   │   ├── call-to-action/
│   │   │   │   ├── index.tsx          # bg-primary banner: dot pattern + blurs + heading + CtaButtons; imported as '@/components/sections/call-to-action'
│   │   │   │   └── CtaButtons.tsx     # Primary + outline button pair; props: cta: [CtaLink, CtaLink]
│   │   │   ├── testimonials/
│   │   │   │   ├── index.tsx          # Thin orchestrator: SectionHeader + TestimonialCard + TestimonialNav + TestimonialStrip; imported as '@/components/sections/testimonials'
│   │   │   │   └── TestimonialNav.tsx # Dot indicators + prev/next arrows; props: active, onPrev, onNext, onDot
│   │   │   ├── contact/
│   │   │   │   ├── index.tsx              # Thin orchestrator: SectionHeader + ContactForm + ContactInfo + ContactHours; imported as '@/components/sections/contact'
│   │   │   │   ├── ContactForm.tsx        # Form state + submit; renders ContactFormFields + ContactConsent + button; shows ContactSuccess on success
│   │   │   │   ├── ContactFormFields.tsx  # Three input fields (name, contact, message); props: form, onChange; reads labels from content
│   │   │   │   ├── ContactConsent.tsx     # Consent checkbox + legal links; props: checked, onChange; reads text from content
│   │   │   │   ├── ContactSuccess.tsx     # Success panel (icon + title + text + reset button); prop: onReset
│   │   │   │   ├── ContactInfo.tsx        # Three ContactItem instances + SocialLinks
│   │   │   │   ├── ContactItem.tsx        # Single contact row: icon box + label + value (with optional link); props: icon, label, value, href?
│   │   │   │   └── ContactHours.tsx       # Working hours card (weekdays/saturday/sunday from siteData)
│   │   │   └── footer/
│   │   │       ├── index.tsx          # Thin orchestrator: 4-col grid + Separator + FooterBottom; imported as '@/components/sections/footer'
│   │   │       ├── FooterBrand.tsx    # Logo, description, SocialLinks (dark variant)
│   │   │       ├── FooterNav.tsx      # Nav links column (from content.nav)
│   │   │       ├── FooterServices.tsx # First 4 service titles linking to #services
│   │   │       ├── FooterContact.tsx  # Phone, email, address via ICON_MAP + items.map()
│   │   │       └── FooterBottom.tsx   # Copyright + legal links nav + tagline
│   │   └── ui/                        # shadcn/ui primitives — DO NOT edit manually
│   │       ├── BackButton.tsx         # Fixed top-right back button (pill style, z-50, always visible) used on legal pages
│   │       ├── SectionHeader.tsx      # Shared label badge + h2 + description block; props: label, title, description?, titleHighlight?, variant ('light'|'dark'), className
│   │       ├── StarRating.tsx         # Shared star row; props: rating, size? (default 16), className? (wrapper), starClassName? (per-star, default fill-primary)
│   │       ├── TestimonialCard.tsx    # Shared blockquote card (stars + quote + avatar/name); props: testimonial, showQuoteIcon?, starSize?, starClassName?, className?
│   │       ├── SocialLinks.tsx        # Telegram + VK icon buttons; props: telegram, vk, variant ('light'|'dark'), className?; co-locates VkIcon SVG component
│   │       ├── PortfolioCard.tsx      # Full portfolio card (PortfolioThumbnail + tags + details link); prop: item (PortfolioCase & { href }); reads detailsLabel from content
│   │       ├── PortfolioThumbnail.tsx # Card thumbnail area: gradient/image bg + dot pattern fallback + dark hover overlay + category badge; props: href, image?, title, category, gradient
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
│   │   ├── iconMap.ts          # ICON_MAP: Record<string, IconComponent> — shared icon registry; resolveIcon() helper; exports IconComponent abstract type (ComponentType<{size?,className?}>)
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
│   │   ├── index.ts           # NavLink interface
│   │   ├── portfolio.ts       # PortfolioCase interface
│   │   ├── iconMap.ts         # ICON_MAP, resolveIcon(), IconComponent — shared icon registry (lucide-react)
│   │   ├── portfolioCases.ts  # portfolioCaseMap: Record<slug, PortfolioCase> — glob-loaded from data/portfolio/
│   │   ├── aboutValues.ts     # AboutValue interface + aboutValues const (from data/about-values.json)
│   │   ├── advantages.ts      # Advantage interface + advantages const (from data/advantages.json)
│   │   ├── carousel.ts        # CarouselSlide interface + carouselSlides const (from data/carousel.json)
│   │   ├── content.ts         # Content type + content const (from data/content.json)
│   │   ├── legalData.ts       # LegalData type + legalData const (from data/legal.json)
│   │   ├── services.ts        # Service interface + services const (from data/services.json)
│   │   ├── siteData.ts        # SiteData interface + siteData const (from data/site.json)
│   │   └── testimonials.ts    # Testimonial interface + testimonials const (from data/testimonials.json)
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

- **`data/content.json`** — all UI copy (nav labels, hero text, section headings, form labels, footer, cookies, portfolio case labels). Exposed via `src/types/content.ts`; used by all section components, `PortfolioCasePage`, `CookieBanner`, and `useActiveSection`. Supports template tokens (`{name}`, `{year}`, `{description}`) replaced at render time.
- **`data/theme.json`** — brand identity: HSL color values, border radius, font families, and Google Fonts URLs. Consumed at build time by `src/plugins/themePlugin.ts` which injects CSS vars and `<link>` tags into `index.html`.
- **`data/site.json`** — global site config (phone, email, address, social links, hours). Exposed via `src/types/siteData.ts`; used by `header/`, `contact/ContactInfo.tsx`, `contact/ContactHours.tsx`, `footer/`.
- **`data/about-values.json`** — array of `{ title, description }` for the About section values list. Exposed via `src/types/aboutValues.ts`; used by `about/`.
- **`data/carousel.json`** — array of `{ id, image, alt, gradient, title, subtitle }` for the top carousel. `image` is optional (uses `gradient` fallback when empty). Exposed via `src/types/carousel.ts`; used by `carousel/`.
- **`data/advantages.json`** — array of `{ icon, title, description }` for the Advantages section. Exposed via `src/types/advantages.ts`; used by `advantages/`. The `icon` field is a string key resolved via `ICON_MAP` from `src/types/iconMap.ts`.
- **`data/services.json`** — array of `{ icon, title, description }` for the Services section. Exposed via `src/types/services.ts`; used by `services/` and `footer/FooterServices.tsx`. The `icon` field is a string key resolved via `ICON_MAP` from `src/types/iconMap.ts`.
- **`data/testimonials.json`** — array of testimonial objects. Exposed via `src/types/testimonials.ts`; used by `testimonials/` and `PortfolioCasePage.tsx`.
- **`data/legal.json`** — company legal details. Exposed via `src/types/legalData.ts`; used by legal pages. Gitignored — schema in `data/_schema/legal.example.json`.
- **`data/portfolio/<slug>.json`** — one file per portfolio case study, typed as `PortfolioCase` (`src/types/portfolio.ts`).
- `data/` is at project root (not inside `src/`); path alias `@data` → `./data`.
- Components **never** import from `@data/` directly — always go through `src/types/`.
- All shared types, interfaces, consts, and data modules live in `src/types/`; only `utils.ts` stays in `src/lib/`.
- Portfolio collection loaded via `import.meta.glob('@data/portfolio/*.json', { eager: true, import: 'default' })` — see `src/types/portfolioCases.ts`.
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
- **Static content**: all data, types, and shared modules live in `src/types/` — components import from `@/types/`, never from `@data/` directly; only `cn()` utility stays in `@/lib/utils`
- **Icon maps**: icons referenced by string key in JSON data (`icon` field), resolved to `IconComponent` via the shared `ICON_MAP` in `src/types/iconMap.ts`; import `ICON_MAP`, `resolveIcon()`, or `IconComponent` type from there — do not import from `lucide-react` directly in components, do not create local icon maps
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
