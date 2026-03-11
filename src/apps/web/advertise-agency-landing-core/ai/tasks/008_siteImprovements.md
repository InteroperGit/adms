# 008 — Site Improvements PRD

## Status: T1 ✅ done · T2 ✅ done · T3 ✅ done · T4 ✅ done (all satisfies → Zod, validate.ts covers all 26 files, 2026-03-11) · T5 ✅ done (SectionDivider, useFadeIn, count-up, CTA pulse, card hover lift, 2026-03-11) | rest not started

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

### T6 · Legal pages: migrate hardcoded content to JSON

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

### T7 · Analytics: Yandex Metrika + cookie consent integration

**Priority:** medium · **Scope:** config + components

Add analytics support that respects the existing cookie consent system.

**Requirements:**
- Add `data/config/site.json` fields: `yandexMetrikaId?: string`, `googleAnalyticsId?: string`
- Create `src/components/analytics/MetrikaScript.tsx` — renderless component that injects Yandex Metrika script tag **only when** `useCookieConsent() === 'all'`
- On consent change (via `cookie_consent_change` event), dynamically load or unload the analytics script
- Add `noscript` fallback image tag for Metrika
- Track virtual page views on route change (via `useLocation()` + `ym('hit', path)`)
- Integrate in `App.tsx` alongside `CookieBanner`
- Update `data/_schema/site.example.json` with analytics fields

**Files:**
- `src/components/analytics/MetrikaScript.tsx` — new
- `src/App.tsx` — add `<MetrikaScript />`
- `src/types/config/siteData.ts` — extend `SiteData` interface
- `data/_schema/site.example.json` — update

---

### T8 · DX: JSON schema validation in IDE + new-client CLI

**Priority:** low · **Scope:** config + tooling

Improve developer experience when configuring data for new clients.

**Requirements:**
- Generate JSON Schema files (`.schema.json`) from Zod schemas (T4 prerequisite) and place in `data/_schema/`
- Add `"$schema": "../_schema/<name>.schema.json"` hints to all data JSON files so VS Code provides autocomplete and inline validation
- Create `scripts/new-client.ts` — interactive CLI that prompts for company name, colors (hex → HSL conversion), phone, email, social links; generates all `data/config/` and `data/sections/` files from templates
- Add `pnpm new-client` script to `package.json`

**Files:**
- `data/_schema/*.schema.json` — generated JSON Schema files
- `scripts/new-client.ts` — new CLI script
- `package.json` — new script

---

### T9 · Performance: bundle analysis + icon tree-shaking

**Priority:** low · **Scope:** build config

The `ICON_MAP` in `src/types/shared/iconMap.ts` imports all icons used anywhere in JSON data. If the map grows, it bloats the bundle. Audit and optimize.

**Requirements:**
- Add `rollup-plugin-visualizer` (or `vite-bundle-analyzer`) as dev dependency; add `pnpm analyze` script
- Run Lighthouse CI on the built `dist/` and document baseline scores
- Audit `ICON_MAP` — remove any icons not referenced in any JSON data file. Create a build-time script `scripts/check-icons.ts` that cross-references `ICON_MAP` keys with all icon references in `data/**/*.json`
- Verify Tailwind CSS v4 tree-shaking is working (no unused utilities in output CSS)
- Check `vite.config.ts` `build.rollupOptions` for optimal chunk splitting (vendor, sections, portfolio)

**Files:**
- `vite.config.ts` — add visualizer plugin (dev only)
- `scripts/check-icons.ts` — new
- `package.json` — `analyze` and `check-icons` scripts

---

### T10 · Design: dark mode toggle support

**Priority:** low · **Scope:** theme + components

The theme system already uses CSS variables. Extend it to support dark mode.

**Requirements:**
- Add `data/config/theme.json` field: `darkColors: { ... }` — same shape as `colors` but with dark mode HSL values
- Update `themePlugin.ts` to inject dark mode CSS vars under `@media (prefers-color-scheme: dark)` and `.dark` class selector
- Add dark mode toggle button in Header (sun/moon icon, stores preference in localStorage)
- Create `useDarkMode()` hook — reads preference from localStorage + system preference, toggles `.dark` class on `<html>`
- Audit all sections for dark mode compatibility — at minimum: Header, Footer, Hero, Services (bg-muted), Contact form, Cookie banner, Legal pages
- Update `data/_schema/theme.example.json` with `darkColors` field

**Files:**
- `src/plugins/themePlugin.ts` — dark mode CSS var injection
- `src/hooks/useDarkMode.ts` — new hook
- `src/components/sections/header/HeaderDesktopNav.tsx` — toggle button
- `data/_schema/theme.example.json` — update
- Multiple components — dark mode class adjustments

---

## Priority Summary

| # | Task | Priority | Effort | Dependencies |
|---|------|----------|--------|--------------|
| T1 | SEO: meta tags + canonical + JSON-LD | high | medium | — |✅ done |
| T2 | Accessibility: contrast, motion, keyboard | high | medium | — |✅ done |
| T3 | Image optimization: lazy + srcset | high | small | — | ✅ done |
| T4 | Data validation: Zod schemas | medium | medium | — | ✅ done |
| T5 | Design: section transitions + micro-interactions | medium | medium | T2 (reduced-motion) |✅ done |
| T6 | Legal pages: migrate to JSON | medium | medium | — |
| T7 | Analytics: Yandex Metrika + consent | medium | small | — |
| T8 | DX: JSON Schema + new-client CLI | low | medium | T4 (Zod schemas) |
| T9 | Performance: bundle analysis + icons | low | small | — |
| T10 | Dark mode toggle | low | large | — |
