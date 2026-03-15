# Data Map — JSON → Types → Components

All JSON data lives in `data/content/` (gitignored except `_schema/`). Components **never** import from `@data/` directly — always go through `src/types/`.

Path alias: `@data` → `./data/content`

## sections/ — per-section UI copy

| JSON file | Type module | Export | Used by |
|---|---|---|---|
| `sections/header.json` | `src/types/sections/header.ts` | `headerContent` | `header/`, `footer/FooterNav.tsx`, `about/AboutCard.tsx`, `useActiveSection.ts` |
| `sections/hero.json` | `src/types/sections/hero.ts` | `heroContent` | `hero/` |
| `sections/carousel.json` | `src/types/sections/carousel.ts` | `carouselSlides` | `carousel/` |
| `sections/carouselContent.json` | `src/types/sections/carouselContent.ts` | `carouselContent` | `carousel/CarouselSlide.tsx` |
| `sections/aboutContent.json` | `src/types/sections/aboutContent.ts` | `aboutContent` | `about/` |
| `sections/aboutValues.json` | `src/types/sections/aboutValues.ts` | `aboutValues` | `about/` |
| `sections/servicesContent.json` | `src/types/sections/servicesContent.ts` | `servicesSectionContent` | `services/` |
| `sections/services.json` | `src/types/sections/services.ts` | `services` | `services/`, `footer/FooterServices.tsx` |
| `sections/advantagesContent.json` | `src/types/sections/advantagesContent.ts` | `advantagesContent` | `advantages/` |
| `sections/advantages.json` | `src/types/sections/advantages.ts` | `advantages` | `advantages/` |
| `sections/callToAction.json` | `src/types/sections/callToAction.ts` | `callToActionContent` | `call-to-action/` |
| `sections/testimonialsContent.json` | `src/types/sections/testimonialsContent.ts` | `testimonialsSectionContent` | `testimonials/` |
| `sections/testimonials.json` | `src/types/sections/testimonials.ts` | `testimonials` | `PortfolioCasePage.tsx` (TestimonialCard) |
| `sections/contact.json` | `src/types/sections/contact.ts` | `contactContent` | `contact/` (all sub-components) |
| `sections/footer.json` | `src/types/sections/footer.ts` | `footerContent` | `footer/` (all sub-components) |
| `sections/portfolioSection.json` | `src/types/portfolio/index.ts` | `portfolioSectionContent` | `sections/portfolio/` |
| `sections/portfolioPage.json` | `src/types/sections/portfolioPage.ts` | `portfolioPageContent` | `PortfolioPage.tsx` |
| `sections/portfolioCase.json` | `src/types/portfolio/portfolioCaseContent.ts` | `portfolioCaseContent` | `PortfolioCasePage.tsx`, `portfolio/Case*.tsx` |
| `sections/imageGallery.json` | `src/types/portfolio/imageGallery.ts` | `imageGalleryContent` | `portfolio/blocks/GalleryBlock.tsx` |

## config/ — global site configuration

| JSON file | Type module | Export | Notes |
|---|---|---|---|
| `config/site.json` | `src/types/config/siteData.ts` | `siteData` | phone, email, address, social, hours; optional: `yandexMapsOrgId`, `yandexMapUrl`, `yandexMetrikaId`, `imageOptimization` |
| `config/theme.json` | `src/types/config/theme.ts` | `theme` | HSL colors, optional `darkColors`, border-radius, font families, Google Fonts URLs; consumed at build time by `themePlugin.ts` |
| `config/cookies.json` | `src/types/config/cookies.ts` | `cookiesContent` | Cookie banner copy |
| `config/portfolio.json` | `src/types/config/portfolioConfig.ts` | `portfolioConfig` | perPage, allLabel, pagination labels, emptyLabel, cta |
| `config/categories.json` | `src/types/config/categories.ts` | `categories` | `[{ name, slug }]`; drives SSG route generation + CategoryNav |
| `config/legal.json` | `src/types/config/legalData.ts` | `legalData` | Company legal details (name, INN, OGRN, etc.) + document versions |
| `config/orderForms.json` | `src/types/config/orderForms.ts` | `orderFormsData` | Form definitions keyed by ID (productTypes, customerFields, consent, success) |
| `config/seo.json` | `src/types/config/seo.ts` | `seoConfig` | siteUrl, siteName, locale, twitterCard, defaultOgImage; read at build time by `ssgMetaPlugin.ts` |
| `config/notFound.json` | `src/types/config/notFound.ts` | `notFoundContent` | Global 404 page copy: title, code, description, backLabel, backHref |

## legal/ — legal page content

| JSON file | Type module | Export |
|---|---|---|
| `legal/privacyPolicy.json` | `src/types/legal/index.ts` | `privacyPolicyContent` |
| `legal/userAgreement.json` | `src/types/legal/index.ts` | `userAgreementContent` |
| `legal/consent.json` | `src/types/legal/index.ts` | `consentContent` |

Legal content shape: `{ title, sections[{ id?, title, blocks[] }] }`. Block types: `p`, `ul`, `ol`, `dl` (`{term,def}[]`), `contact` (`{label,field}[]` where `field` is a key of `legalData.company`). Text supports `{company.X}` tokens + inline HTML. Rendered by `LegalBlockRenderer.tsx`.

## portfolio/ — case studies

| Source | Type module | Export |
|---|---|---|
| `portfolio/*.json` (one per case) | `src/types/portfolio/portfolioCases.ts` | `portfolioCaseMap` (glob-loaded) |

Case shape: `slug`, `title`, `category`, `description`, `hero: { image?, gradient }`, `tags[]`, `meta`, `overview`, `content: ContentBlock[]`, `images: { preview?, og? }`. Content blocks defined in `src/types/portfolio/blocks.ts`; dispatched by `BlockRenderer.tsx`.

Portfolio glob: `import.meta.glob('@data/portfolio/*.json', { eager: true, import: 'default' })`

## Schema infrastructure

- **JSON Schema files**: `pnpm gen-schemas` → `data/_schema/schema/<name>.schema.json` (gitignored; uses `z.toJSONSchema()` from Zod v4 built-in)
- **Schema examples**: `data/_schema/examples/` (git-tracked) — `.example.json` files for each data file; object-root files include `"$schema": "../../schema/<name>.schema.json"`
- **Array-root files** (categories, carousel, etc.) covered by `.vscode/settings.json` generated by `gen-schemas`
- **New-client CLI**: `pnpm new-client` generates a full `data/content/` structure with customised `site.json`, `theme.json`, `seo.json`, `header.json` + template copies with `$schema` refs

## Type module conventions

- Each module exports: a **Zod schema** (`export const XxxSchema = z.object({…})`), a TypeScript type via `z.infer<>`, and a parsed const (`Schema.parse(rawJson)`)
- **Do not use `satisfies`** for data consts — Zod parse replaces it
- `src/types/shared/iconMap.ts` — `ICON_MAP`, `resolveIcon()`, `IconComponent`; icons referenced by string key in JSON, **do not** import from `lucide-react` directly in components
- `CtaLink` interface defined inline in each type file that needs it (no shared file)
