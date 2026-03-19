# src/types/ Subfolder Structure (refactored March 2026)
`src/types/` is organised into 5 subfolders: `config/`, `sections/`, `portfolio/`, `blocks/`, `shared/`.

**config/** — global site configuration
| JSON file | types module | export |
|---|---|---|
| `data/config/site.json` | `src/types/config/siteData.ts` | `siteData` |
| `data/config/theme.json` | `src/types/config/theme.ts` | `theme` |
| `data/config/cookies.json` | `src/types/config/cookies.ts` | `cookiesContent` |
| `data/config/legal.json` | `src/types/config/legalData.ts` | `legalData` |
| `data/config/portfolio.json` | `src/types/config/portfolioConfig.ts` | `portfolioConfig` |
| `data/config/categories.json` | `src/types/config/categories.ts` | `categories` |
| `data/config/orderForms.json` | `src/types/config/orderForms.ts` | `orderFormsData` |
| `data/config/notFound.json` | `src/types/config/notFound.ts` | `notFoundContent` |

**sections/** — per-section UI copy (T11, organized into subfolders)
| JSON file | types module | export |
|---|---|---|
| `data/sections/header.json` | `src/types/sections/header/header.ts` | `headerContent` |
| `data/sections/hero.json` | `src/types/sections/hero/hero.ts` | `heroContent` |
| `data/sections/carousel.json` | `src/types/sections/carousel/carousel.ts` | `carouselSlides` |
| `data/sections/carouselContent.json` | `src/types/sections/carousel/carouselContent.ts` | `carouselContent` |
| `data/sections/aboutContent.json` | `src/types/sections/about/aboutContent.ts` | `aboutContent` |
| `data/sections/aboutValues.json` | `src/types/sections/about/aboutValues.ts` | `aboutValues` |
| `data/sections/servicesContent.json` | `src/types/sections/services/servicesContent.ts` | `servicesSectionContent` |
| `data/sections/services.json` | `src/types/sections/services/services.ts` | `services` |
| `data/sections/advantagesContent.json` | `src/types/sections/advantages/advantagesContent.ts` | `advantagesContent` |
| `data/sections/advantages.json` | `src/types/sections/advantages/advantages.ts` | `advantages` |
| `data/sections/callToAction.json` | `src/types/sections/call-to-action/callToAction.ts` | `callToActionContent` |
| `data/sections/testimonialsContent.json` | `src/types/sections/testimonials/testimonialsContent.ts` | `testimonialsSectionContent` |
| `data/sections/testimonials.json` | `src/types/sections/testimonials/testimonials.ts` | `testimonials` |
| `data/sections/contact.json` | `src/types/sections/contact/contact.ts` | `contactContent` |
| `data/sections/footer.json` | `src/types/sections/footer/footer.ts` | `footerContent` |
| `data/sections/portfolioPage.json` | `src/types/sections/portfolio/portfolioPage.ts` | `portfolioPageContent` |

**portfolio/** — portfolio case data & related types
| JSON file | types module | export |
|---|---|---|
| `data/sections/portfolioSection.json` | `src/types/portfolio/index.ts` | `portfolioSectionContent` (import as `@/types/portfolio`) |
| `data/sections/portfolioCase.json` | `src/types/portfolio/portfolioCaseContent.ts` | `portfolioCaseContent` |
| `data/portfolio/**/*.json` (nested) | `src/types/portfolio/portfolioCases.ts` | `portfolioCaseMap` (glob-loaded, slug from JSON field) |

**legal/** — legal page content (T6, March 2026)
| JSON file | types module | exports |
|---|---|---|
| `data/legal/privacyPolicy.json` | `src/types/legal/index.ts` | `privacyPolicyContent` |
| `data/legal/userAgreement.json` | `src/types/legal/index.ts` | `userAgreementContent` |
| `data/legal/consent.json` | `src/types/legal/index.ts` | `consentContent` |

- Block types in `LegalContentSchema`: `p` (text), `ul`, `ol`, `dl` ({term,def}[]), `contact` ({label,field}[] — field is key of `legalData.company`)
- Text fields support `{company.X}` tokens + inline HTML; rendered via `dangerouslySetInnerHTML` in `LegalBlockRenderer.tsx`
- `data/legal/` is gitignored; schema example: `data/_schema/legalContent.example.json`

**shared/** — shared primitives
| module | exports |
|---|---|
| `src/types/shared/iconMap.ts` | `ICON_MAP`, `resolveIcon()`, `IconComponent` |
| `src/types/shared/imageGallery.ts` | `ImageGalleryContentSchema`, `ImageGalleryContent`, `imageGalleryContent` (moved from portfolio/ in T12) |
| `src/types/shared/index.ts` | `NavLink` interface |