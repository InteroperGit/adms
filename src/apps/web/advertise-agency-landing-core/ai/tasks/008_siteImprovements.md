# 008 — Site Improvements PRD

## Status: T1 ✅ done · T2 ✅ done · T3 ✅ done · T4 ✅ done (all satisfies → Zod, validate.ts covers all 26 files, 2026-03-11) · T5 ✅ done (SectionDivider, useFadeIn, count-up, CTA pulse, card hover lift, 2026-03-11) · T6 ✅ done (data/legal/*.json, src/types/legal/index.ts, LegalBlockRenderer, 2026-03-12) · T7 ✅ done (MetrikaScript, SiteDataSchema extended, 2026-03-12) | rest not started

## Goal

Bring the landing page from "functional" to "polished & production-hardened". Tasks span design refinements, accessibility fixes, SEO, performance, data validation, and developer experience. Each task is self-contained and can be completed independently.

---

## Tasks

### T1 · SEO: meta tags + canonical links + JSON-LD ✅ done

**Priority:** high · **Scope:** config + pages

Currently pages only set `document.title`. Add per-page `<meta>` tags and structured data.

**Requirements:**
- Add `data/config/seo.json` — global defaults: `og:site_name`, `og:locale`, `twitter:card`, default `og:image`
- Each portfolio case already has `images.og` and `meta` fields → inject `<meta property="og:title">`, `og:description`, `og:image`, `og:url`
- Add `<link rel="canonical">` to portfolio case pages (a case at `/portfolio/all/bodrost` and `/portfolio/branding/bodrost` is the same content — canonical should point to the category-specific URL)
- Add JSON-LD `Organization` schema on the home page (reads from `siteData` + `legalData`)
- Add JSON-LD `BreadcrumbList` on case pages (matches `<BreadCrumbs>` component)
- Create `src/components/ui/PageMeta.tsx` — renderless component that sets `<head>` tags via `document.head` manipulation (no react-helmet needed for SSG — inject at build time via vite-react-ssg `onPageRendered` or similar)
- Update `data/_schema/seo.example.json`

**Files:**
- `data/config/seo.json`, `src/types/config/seo.ts` — new
- `src/components/ui/PageMeta.tsx` — new
- `src/pages/PortfolioCasePage.tsx`, `src/pages/Home.tsx` — integrate meta
- `vite.config.ts` — possible `onPageRendered` hook

---

### T2 · Accessibility: contrast, reduced-motion, keyboard nav ✅ done

**Priority:** high · **Scope:** components + CSS

Several WCAG violations exist today. Fix them.

**Requirements:**
- **Advantages section:** number overlay uses `text-white/10` — fails WCAG AA. Change to `text-white/5` or add `aria-hidden="true"` (numbers are purely decorative)
- **`prefers-reduced-motion`:** add global `@media (prefers-reduced-motion: reduce)` in `index.css` that disables carousel auto-advance, scroll animations, fade-in keyframe, and smooth-scroll. Also disable `ScrollToTop` smooth scroll when preference is set
- **Skip-to-content link:** add a `<a href="#main-content" class="sr-only focus:not-sr-only">` as the first child in `App.tsx`; add `id="main-content"` to `<main>` in `Home.tsx` (and each page's primary container)
- **Focus-visible styles:** ensure all interactive elements (buttons, links, card links) have visible focus ring when navigating by keyboard. Tailwind's `focus-visible:ring-2 ring-primary` should be default. Audit `PortfolioCard`, `CtaButtons`, `CategoryNav` tabs, `SocialLinks`
- **Mobile menu body scroll lock:** when `HeaderMobileNav` dropdown is open, prevent background page scroll (`document.body.style.overflow = 'hidden'`)
- **Yandex Reviews iframe:** add `loading="lazy"` attribute

**Files:**
- `src/index.css` — reduced-motion media query
- `src/App.tsx` — skip link
- `src/components/sections/advantages/AdvantageCard.tsx` — aria-hidden on number
- `src/components/sections/header/HeaderMobileNav.tsx` — scroll lock
- `src/components/sections/testimonials/YandexReviews.tsx` — lazy loading
- `src/components/ui/ScrollToTop.tsx` — respect reduced-motion

---

### T3 · Image optimization: responsive resizing + lazy loading + srcset ✅ done

**Priority:** high · **Scope:** build pipeline + components

Portfolio images and carousel slides load full-size regardless of viewport. Add a Vite build-time image processing step that generates multiple sized variants and uses them via `srcset`/`sizes` — mirroring Next.js `<Image>` behaviour but fully static.

#### 3a · Build-time image resizing (Vite plugin) ✅ done

Create `src/plugins/imageResizePlugin.ts` — a Vite plugin that runs during SSG build:

- Uses **`sharp`** (dev dependency) to process every image under `public/images/`
- Generates WebP variants at breakpoints: **320 w, 640 w, 960 w, 1280 w, 1920 w**
- Outputs to `public/images/_optimized/<original-name>-<w>w.webp` (preserves originals as fallback)
- Skips already-generated files (content hash check) to keep rebuilds fast
- Exports a helper `resolveImageSrcSet(src: string): string` that returns the `srcset` string for a given original path

**Configuration** — add to `data/config/site.json`:
```json
"imageOptimization": {
  "widths": [320, 640, 960, 1280, 1920],
  "quality": 82,
  "format": "webp"
}
```

#### 3b · Shared `<OptimizedImage>` component ✅ done

Create `src/components/ui/OptimizedImage.tsx` — drop-in `<img>` replacement:

```ts
interface OptimizedImageProps {
  src: string;           // original path (e.g. /images/hero.jpg)
  alt: string;
  sizes?: string;        // responsive sizes string, default '100vw'
  priority?: boolean;    // true → eager + fetchpriority="high", false → lazy (default)
  width?: number;
  height?: number;
  className?: string;
}
```

- Renders `<picture>` with `<source type="image/webp" srcset="..." sizes="...">` + `<img>` fallback (original src)
- `priority={true}` → `loading="eager" fetchpriority="high"`; default → `loading="lazy" decoding="async"`
- Falls back gracefully: if `_optimized` variants don't exist (dev mode), renders plain `<img src>`
- Provides sensible default `sizes`:
  - `PortfolioThumbnail` → `"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`
  - `CaseHero` / `CarouselSlide` → `"100vw"`
  - `ImageGalleryPreview` → `"(max-width: 768px) 100vw, 800px"`
  - `ImageBlock` size prop maps: small → `"(max-width: 768px) 100vw, 448px"`, medium → `"(max-width: 768px) 100vw, 672px"`, full → `"100vw"`

#### 3c · Component updates ✅ done

Replace bare `<img>` tags with `<OptimizedImage>` in:

| Component | `priority` | `sizes` |
|---|---|---|
| `CarouselSlide.tsx` | `true` for index 0, `false` for rest | `"100vw"` |
| `CaseHero.tsx` | `true` | `"100vw"` |
| `PortfolioThumbnail.tsx` | `false` | `"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"` |
| `ImageGalleryPreview.tsx` | `false` | `"(max-width: 768px) 100vw, 800px"` |
| `ImageGalleryLightbox.tsx` | `false` | `"100vw"` |
| `ImageGalleryThumbnails.tsx` | `false` | `"80px"` |
| `ImageBlock.tsx` | `false` | derived from `block.size` prop |

Also add `width` and `height` attributes to all `<img>` / `<OptimizedImage>` where dimensions are known from data, to prevent CLS.

**Files:**
- `src/plugins/imageResizePlugin.ts` — new Vite plugin (uses `sharp`)
- `src/components/ui/OptimizedImage.tsx` — new shared component
- `src/components/sections/carousel/CarouselSlide.tsx`
- `src/components/ui/PortfolioThumbnail.tsx`
- `src/components/ui/imageGallery/ImageGalleryPreview.tsx`
- `src/components/ui/imageGallery/ImageGalleryLightbox.tsx`
- `src/components/ui/imageGallery/ImageGalleryThumbnails.tsx`
- `src/components/portfolio/blocks/ImageBlock.tsx`
- `src/components/portfolio/CaseHero.tsx`
- `vite.config.ts` — register `imageResizePlugin`
- `data/config/site.json` — add `imageOptimization` config block

---

### T4 · Data validation: Zod schemas at build time ✅ done

**Priority:** medium · **Scope:** types + build

Currently JSON data is validated only by `satisfies` at compile time — this catches type mismatches but not missing required fields in actual JSON files (since they're gitignored). Add runtime validation.

**Requirements:**
- Add `zod` as a dev dependency
- Each type module (`src/types/config/*.ts`, `src/types/sections/*.ts`) calls `schema.parse(raw)` at import time — throws a clear error message if JSON is invalid (shows which field is wrong)
- Add a `pnpm validate` script that imports all type modules and catches any parse errors (useful as pre-build check)
- Portfolio case files: validate each case in `portfolioCases.ts` glob loop with a `PortfolioCaseSchema`

**Files:**
- `src/lib/schema/*.ts` — new Zod schemas
- `src/types/config/*.ts`, `src/types/sections/*.ts` — add `.parse()` calls
- `package.json` — add `validate` script

---

### T5 · Design: section transition polish + micro-interactions ✅ done

**Priority:** medium · **Scope:** components + CSS

Sections currently stack with flat boundaries. Add subtle visual transitions between sections and micro-interactions on interactive elements.

**Requirements:**
- **Section dividers:** add subtle curved SVG dividers or gradient fades between key section transitions: Hero→About (light→white), Services→Portfolio (muted→white), Advantages→CTA (dark→primary), CTA→Testimonials (primary→white). Implement as `<SectionDivider variant="dark-to-primary" />` component
- **Card hover effects:** `ServiceCard` and `PortfolioCard` should have a subtle lift + shadow transition on hover (currently only shadow-md; add `transform: translateY(-2px)` with `transition-all duration-200`)
- **Stat counters (Hero):** add count-up animation on viewport entry (IntersectionObserver triggers CSS counter animation or a lightweight `useCountUp` hook). Respect `prefers-reduced-motion`
- **CTA buttons pulse:** primary CTA buttons (`HeroCTA`, `CtaButtons`) should have a subtle pulse ring animation on idle to draw attention. Disable with `prefers-reduced-motion`
- **Scroll-triggered fade-in:** sections fade in as they enter the viewport. Use `IntersectionObserver` + `opacity/translate` CSS transition. Create `useFadeIn()` hook that returns a ref + `isVisible` boolean. Respect `prefers-reduced-motion`

**Files:**
- `src/components/ui/SectionDivider.tsx` — new
- `src/components/sections/hero/HeroStats.tsx` — count-up
- `src/hooks/useFadeIn.ts` — new
- `src/index.css` — pulse keyframe, fade-in utility
- Multiple section index files — apply fade-in

---

### T6 · Legal pages: migrate hardcoded content to JSON ✅ done

**Priority:** medium · **Scope:** data + pages

Legal page content (Privacy Policy, User Agreement, Consent) is currently hardcoded JSX in page components. This breaks the white-label promise — each new client needs different legal text.

**Requirements:**
- Create `data/legal/privacyPolicy.json`, `data/legal/userAgreement.json`, `data/legal/consent.json` — each contains `sections: [{ id?, title, paragraphs: string[] }]` array
- Support token substitution in paragraph text: `{company.name}`, `{company.inn}`, `{company.email}`, `{company.siteUrl}` etc. (resolved at render time from `legalData`)
- Create `src/types/legal/` module to load these files
- Refactor `PrivacyPolicy.tsx`, `UserAgreement.tsx`, `Consent.tsx` to iterate over sections array and render `<LegalSection>` + `<p>` elements from data
- Add `data/_schema/legalContent.example.json` — schema example
- Update `data/README.md` with new legal content files

**Files:**
- `data/legal/*.json` — new data folder
- `src/types/legal/` — new type modules
- `src/pages/PrivacyPolicy.tsx`, `UserAgreement.tsx`, `Consent.tsx` — refactor
- `data/_schema/legalContent.example.json` — new

---

### T7 · Analytics: Yandex Metrika + cookie consent integration ✅ done

**Priority:** medium · **Scope:** config + components

Add analytics support that respects the existing cookie consent system.

**Current state:**
- `SiteDataSchema` (Zod) in `src/types/config/siteData.ts` — does **not** have analytics fields yet; existing optional fields: `yandexMapsOrgId`, `yandexMapUrl`, `imageOptimization`
- `useCookieConsent()` hook (`src/hooks/useCookieConsent.ts`) returns `'all' | 'necessary' | null`; listens to `cookie_consent_change` CustomEvent
- `App.tsx` already renders `<CookieBanner />` — analytics component goes alongside it
- `data/_schema/site.example.json` exists but lacks both `imageOptimization` and analytics fields
- No `src/components/analytics/` directory exists yet
- `scripts/validate.ts` validates `site.json` via `SiteDataSchema` — new optional fields are picked up automatically

**Requirements:**
- Extend `SiteDataSchema` in `src/types/config/siteData.ts` with optional fields: `yandexMetrikaId?: string`, `googleAnalyticsId?: string` (use `z.string().optional()`)
- Create `src/components/analytics/MetrikaScript.tsx` — renderless component that:
  - Reads `siteData.yandexMetrikaId`; renders nothing if absent/empty
  - Injects Yandex Metrika `<script>` tag **only when** `useCookieConsent() === 'all'`
  - On consent change (hook re-renders on `cookie_consent_change` event), dynamically loads or removes the script
  - Adds `<noscript><img>` fallback for Metrika
  - Tracks virtual page views on route change via `useLocation()` + `ym('hit', path)`
- Integrate `<MetrikaScript />` in `App.tsx` alongside `<CookieBanner />`
- Update `data/_schema/site.example.json` with `yandexMetrikaId` and `googleAnalyticsId` fields (also add missing `imageOptimization` example)

**Files:**
- `src/components/analytics/MetrikaScript.tsx` — new
- `src/App.tsx` — add `<MetrikaScript />`
- `src/types/config/siteData.ts` — extend `SiteDataSchema` (Zod, not interface)
- `data/_schema/site.example.json` — update with analytics + imageOptimization fields

---

### T8 · DX: JSON schema validation in IDE + new-client CLI

**Priority:** low · **Scope:** config + tooling

Improve developer experience when configuring data for new clients.

**Current state:**
- T4 is done ✅ — all type modules export Zod schemas (naming convention: `XxxSchema`, e.g. `SiteDataSchema`, `ThemeSchema`, `HeaderContentSchema`, `PortfolioCaseSchema`, `LegalContentSchema`)
- `scripts/validate.ts` validates 26+ JSON files using those Zod schemas (run via `pnpm validate` / `vite-node`)
- `data/_schema/*.example.json` files exist as human-readable shape references but provide no IDE autocomplete
- No `*.schema.json` files exist yet
- `vite-node` is already in devDependencies — use for running new scripts
- `package.json` scripts: `validate`, `typecheck`, `format`, `lint`, `dev`, `build`, `preview`

**Requirements:**
- Install `zod-to-json-schema` (dev dependency) for converting Zod schemas to JSON Schema
- Create `scripts/generate-json-schemas.ts` — imports all `XxxSchema` exports from `src/types/config/`, `src/types/sections/`, `src/types/portfolio/`, `src/types/legal/`; converts each to JSON Schema via `zodToJsonSchema()`; writes to `data/_schema/<name>.schema.json`
- Add `"$schema": "../_schema/<name>.schema.json"` hints to all `data/config/`, `data/sections/`, `data/legal/`, `data/portfolio/` JSON files so VS Code provides autocomplete and inline validation
- Add `pnpm gen-schemas` script to `package.json` (runs `vite-node scripts/generate-json-schemas.ts`)
- Create `scripts/new-client.ts` — interactive CLI (use `readline` or `@inquirer/prompts`) that prompts for:
  - Company name, phone, email, address, social links
  - Brand colors (hex → HSL conversion)
  - Font choices (heading, body) + Google Fonts URLs
  Generates all `data/config/` and `data/sections/` files from templates based on existing `data/_schema/*.example.json` shape
- Add `pnpm new-client` script to `package.json` (runs `vite-node scripts/new-client.ts`)

**Files:**
- `scripts/generate-json-schemas.ts` — new (uses `zod-to-json-schema`)
- `data/_schema/*.schema.json` — generated JSON Schema files
- `scripts/new-client.ts` — new CLI script
- `package.json` — add `gen-schemas` and `new-client` scripts

---

### T9 · Performance: bundle analysis + icon tree-shaking

**Priority:** low · **Scope:** build config

The `ICON_MAP` in `src/types/shared/iconMap.ts` imports all icons used anywhere in JSON data. If the map grows, it bloats the bundle. Audit and optimize.

**Current state:**
- `ICON_MAP` currently has **20 icons** from `lucide-react`: Lightbulb, MonitorSmartphone, Megaphone, LayoutTemplate, BarChart3, Share2, CircleDollarSign, Clock, UserRound, LineChart, Building2, Handshake, Phone, Mail, MapPin, Info, CheckCircle, AlertTriangle, StickyNote, RectangleHorizontal, Box
- No bundle analysis tooling installed; no `pnpm analyze` script
- `vite.config.ts` has no `build.rollupOptions` — default chunk splitting
- `vite-node` available for running scripts (already in devDeps)
- `scripts/validate.ts` pattern is the template for new build scripts

**Requirements:**
- Add `rollup-plugin-visualizer` (or `vite-bundle-analyzer`) as dev dependency; add `pnpm analyze` script (opens HTML report from `dist/stats.html`)
- Run Lighthouse CI on the built `dist/` and document baseline scores in a `docs/performance.md` or similar
- Create `scripts/check-icons.ts` — reads all `data/**/*.json` files, extracts all `"icon": "..."` string values, compares against `ICON_MAP` keys; reports unused icons (to remove) and missing icons (referenced in data but not in map). Run via `pnpm check-icons` (`vite-node scripts/check-icons.ts`)
- Verify Tailwind CSS v4 tree-shaking is working (no unused utilities in output CSS) — check final CSS size in analyze report
- Review `vite.config.ts` `build.rollupOptions` for optimal chunk splitting:
  - `vendor` chunk: react, react-dom, react-router-dom, zod
  - `icons` chunk: lucide-react
  - Let Vite handle the rest with default splitting

**Files:**
- `vite.config.ts` — add visualizer plugin (dev/build only) + rollupOptions chunk splitting
- `scripts/check-icons.ts` — new
- `package.json` — add `analyze` and `check-icons` scripts

---

### T10 · Design: dark mode toggle support

**Priority:** low · **Scope:** theme + components

The theme system already uses CSS variables. Extend it to support dark mode.

**Current state:**
- `ThemeSchema` and `ThemeColorsSchema` are **Zod schemas** in `src/types/config/theme.ts` — 19 color keys (background, foreground, card, cardForeground, popover, popoverForeground, primary, primaryForeground, secondary, secondaryForeground, muted, mutedForeground, accent, accentForeground, destructive, destructiveForeground, border, input, ring)
- `themePlugin.ts` (`src/plugins/themePlugin.ts`) reads `data/config/theme.json` and injects `:root { --xxx: ... }` CSS vars + Google Fonts `<link>` tags into `index.html` via `transformIndexHtml()` hook
- **Important:** `themePlugin.ts` uses its own **local** `Theme` interface (not the app-side Zod schema) because it runs under `tsconfig.node.json` — both must be updated in sync
- `buildCss(theme)` function generates CSS string; `COLOR_KEY_MAP` maps camelCase keys → kebab-case CSS var names
- `index.css` uses `@theme inline` for Tailwind v4 — references CSS vars like `--primary`, `--muted`, etc.
- `theme.example.json` has `colors`, `radius`, `fonts`, `fontUrls` — no `darkColors`
- Header components: `HeaderDesktopNav.tsx` and `HeaderMobileNav.tsx` — toggle button goes in desktop nav (visible slot), mirrored in mobile menu
- No `useDarkMode` hook exists; no `.dark` class logic anywhere

**Requirements:**
- Extend `ThemeColorsSchema` in `src/types/config/theme.ts` with optional `darkColors` field: `darkColors: ThemeColorsSchema.optional()` (same shape as `colors`)
- Update local `Theme` interface in `themePlugin.ts` to add `darkColors?: Record<string, string>`
- Update `buildCss()` in `themePlugin.ts` to generate an additional block:
  ```css
  @media (prefers-color-scheme: dark) { :root { ... } }
  .dark { ... }
  ```
  using `theme.darkColors` (skip if absent)
- Create `src/hooks/useDarkMode.ts` — reads preference from `localStorage('theme-mode')` + `matchMedia('(prefers-color-scheme: dark)')`; toggles `.dark` class on `<html>`; returns `{ isDark: boolean, toggle: () => void }`
- Add dark mode toggle button (Sun/Moon icon from `lucide-react`) in `HeaderDesktopNav.tsx` (next to phone icon + social links) and `HeaderMobileNav.tsx` (in mobile menu footer)
- Audit all sections for dark mode compatibility — at minimum: Header, Footer, Hero, Services (`bg-muted`), Contact form, Cookie banner, Legal pages, Portfolio cards
- Update `data/_schema/theme.example.json` with `darkColors` field showing example dark HSL values

**Files:**
- `src/types/config/theme.ts` — extend `ThemeSchema` with optional `darkColors`
- `src/plugins/themePlugin.ts` — dark mode CSS var injection (update both local `Theme` type and `buildCss()`)
- `src/hooks/useDarkMode.ts` — new hook
- `src/components/sections/header/HeaderDesktopNav.tsx` — add toggle button
- `src/components/sections/header/HeaderMobileNav.tsx` — add toggle button
- `data/_schema/theme.example.json` — add `darkColors` example
- Multiple section components — dark mode class adjustments where needed

---

## Priority Summary

| # | Task | Priority | Effort | Dependencies |
|---|------|----------|--------|--------------|
| T1 | SEO: meta tags + canonical + JSON-LD | high | medium | — | ✅ done |
| T2 | Accessibility: contrast, motion, keyboard | high | medium | — | ✅ done |
| T3 | Image optimization: lazy + srcset | high | small | — | ✅ done |
| T4 | Data validation: Zod schemas | medium | medium | — | ✅ done |
| T5 | Design: section transitions + micro-interactions | medium | medium | T2 (reduced-motion) | ✅ done |
| T6 | Legal pages: migrate to JSON | medium | medium | — | ✅ done |
| T7 | Analytics: Yandex Metrika + consent | medium | small | — (useCookieConsent + SiteDataSchema ready) | ✅ done |
| T8 | DX: JSON Schema + new-client CLI | low | medium | T4 ✅ (Zod schemas exported) |
| T9 | Performance: bundle analysis + icons | low | small | — |
| T10 | Dark mode toggle | low | large | — (themePlugin + ThemeSchema ready) |
