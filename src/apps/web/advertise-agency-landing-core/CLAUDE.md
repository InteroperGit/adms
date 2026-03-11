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
- **CSS variables** injected at build time by `src/plugins/themePlugin.ts` from `data/config/theme.json` — not hardcoded in `index.css`
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
│   ├── _schema/             # Schema examples — git-tracked; JSON files showing the expected shape of each data file
│   │   ├── aboutContent.example.json
│   │   ├── aboutValues.example.json
│   │   ├── advantagesContent.example.json
│   │   ├── advantages.example.json
│   │   ├── callToAction.example.json
│   │   ├── carouselContent.example.json
│   │   ├── carousel.example.json
│   │   ├── contact.example.json
│   │   ├── cookies.example.json
│   │   ├── footer.example.json
│   │   ├── header.example.json
│   │   ├── hero.example.json
│   │   ├── imageGallery.example.json
│   │   ├── legal.example.json
│   │   ├── categories.example.json
│   │   ├── portfolioCase.example.json
│   │   ├── portfolioConfig.example.json
│   │   ├── portfolioPage.example.json
│   │   ├── portfolioSection.example.json
│   │   ├── portfolio.example.json
│   │   ├── servicesContent.example.json
│   │   ├── services.example.json
│   │   ├── site.example.json
│   │   ├── testimonialsContent.example.json
│   │   ├── testimonials.example.json
│   │   └── theme.example.json
│   │   └── orderForms.example.json
│   │   └── seo.example.json
│   ├── portfolio/           # One JSON file per case study (slug.json)
│   │   ├── bodrost.json
│   │   ├── fitstudio.json
│   │   └── techpulse.json
│   ├── sections/            # Per-section UI copy JSON files
│   │   ├── header.json          # Header/nav copy: lang, logo, nav[], navCta
│   │   ├── hero.json            # Hero section copy: badge, title, titleHighlight, subtitle, cta[], stats[]
│   │   ├── carouselContent.json # Carousel label: { label }
│   │   ├── carousel.json        # Hero carousel slides: [{ id, image, alt, gradient, title, subtitle }]
│   │   ├── aboutContent.json   # About section copy: label, title, titleHighlight, text[], card
│   │   ├── aboutValues.json    # About section values list: [{ title, description }]
│   │   ├── servicesContent.json # Services section headings: label, title, description
│   │   ├── services.json        # Services list: [{ icon, title, description }]
│   │   ├── portfolioSection.json # Portfolio section copy: label, title, description, allCategory, detailsLabel, cta
│   │   ├── portfolioPage.json  # Portfolio listing page copy: label, title, description (page-specific only)
│   │   ├── portfolioCase.json  # Portfolio case page labels: backLabel, overviewLabels, section titles, cta, notFound
│   │   ├── advantagesContent.json # Advantages section headings: label, title, titleHighlight, description
│   │   ├── advantages.json      # Advantages list: [{ icon, title, description }]
│   │   ├── callToAction.json  # CTA banner copy: title, subtitle, cta[]
│   │   ├── testimonialsContent.json # Testimonials section headings: label, title, description
│   │   ├── testimonials.json    # Testimonials: [{ id, name, role, company, avatar, avatarColor, rating, text }]
│   │   ├── imageGallery.json   # Gallery UI labels: prevLabel, nextLabel, counter template
│   │   ├── contact.json         # Contact section copy: label, title, description, form, labels
│   │   └── footer.json          # Footer copy: description, navTitle, servicesTitle, contactsTitle, copyright, tagline, legalLinks[]
│   └── config/              # Global site configuration
│       ├── site.json            # Global site config: phone, email, address, social, hours
│       ├── theme.json           # Brand identity: HSL colors, border radius, font families, Google Fonts URLs
│       ├── cookies.json         # Cookie banner copy: ariaLabel, closeLabel, title, text, privacyLink, button labels
│       ├── portfolio.json       # Shared portfolio listing config: perPage, allLabel, pagination labels, emptyLabel, cta
│       ├── categories.json      # Category registry: [{ name, slug }]; drives SSG route generation + CategoryNav
│       ├── legal.json           # Legal company data: company.{name,inn,ogrn,legalAddress,siteUrl,email,phone,responsible}, documents.{privacyPolicy,consent,userAgreement} each {version,effectiveDate}
│       ├── orderForms.json      # Order form definitions: forms (keyed by ID, each with productTypes, customerFields, consent, success), page (label, title, description, defaultFormId)
│       └── seo.json             # Global SEO defaults: siteUrl, siteName, locale, twitterCard, defaultOgImage
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
│   │   │   │   ├── CarouselSlide.tsx  # Single slide renderer (gradient or image bg + label/title/subtitle); props: slide, isActive, index; uses OptimizedImage (priority=true for index 0)
│   │   │   │   └── CarouselControls.tsx # Prev/next arrows + dot indicators + slide counter; props: total, current, onPrev, onNext, onDot
│   │   │   ├── header/
│   │   │   │   ├── index.tsx          # In-flow header, solid white bg, border-b, logo; imported as '@/components/sections/header'
│   │   │   │   ├── HeaderDesktopNav.tsx # Nav links + phone icon button (tel: link, green) + SocialLinks (colored) + CTA button (hidden on mobile); props: activeSection, isHome, forcedActiveHref
│   │   │   │   └── HeaderMobileNav.tsx  # Hamburger + dropdown (hidden on desktop); mobile menu footer: phone icon button + SocialLinks (colored) + CTA; props: activeSection, isHome, forcedActiveHref
│   │   │   ├── hero/
│   │   │   │   ├── index.tsx          # Thin orchestrator: badge + title + subtitle + HeroCTA + HeroStats; imported as '@/components/sections/hero'
│   │   │   │   ├── HeroCTA.tsx        # Two CTA buttons (primary + outline); props: cta: { label, href }[]
│   │   │   │   └── HeroStats.tsx      # 3-stat grid with icon + value + label; props: stats: { value, label }[]
│   │   │   ├── about/
│   │   │   │   ├── index.tsx          # Thin orchestrator: label + h2 + text + values list + AboutCard; imported as '@/components/sections/about'
│   │   │   │   └── AboutCard.tsx      # Right-side info card: logo letter + company name + tagline + stats grid + NPS badge; props: card: AboutSectionContent['card']
│   │   │   ├── services/
│   │   │   │   ├── index.tsx          # bg-muted section: SectionHeader + card grid; imported as '@/components/sections/services'
│   │   │   │   └── ServiceCard.tsx    # shadcn Card with icon + title + description; props: service: Service
│   │   │   ├── portfolio/
│   │   │   │   ├── index.tsx          # bg-white section: SectionHeader + PortfolioFilter + card grid (max 6 preview items) + CTA → /portfolio; imported as '@/components/sections/portfolio'
│   │   │   │   └── PortfolioFilter.tsx # Category filter buttons with active state; props: categories, active, onChange
│   │   │   ├── advantages/
│   │   │   │   ├── index.tsx          # Dark bg section: decorative circles + SectionHeader + card grid; imported as '@/components/sections/advantages'
│   │   │   │   └── AdvantageCard.tsx  # Glassmorphism card: icon + number + title + description; props: item, index
│   │   │   ├── call-to-action/
│   │   │   │   ├── index.tsx          # bg-primary banner: dot pattern + blurs + heading + CtaButtons; imported as '@/components/sections/call-to-action'
│   │   │   │   └── CtaButtons.tsx     # Primary + outline button pair; props: cta: [CtaLink, CtaLink]
│   │   │   ├── testimonials/
│   │   │   │   ├── index.tsx              # Orchestrator: SectionHeader + YandexReviews (if yandexMapsOrgId set) or TestimonialsEmpty; imported as '@/components/sections/testimonials'
│   │   │   │   ├── YandexReviews.tsx      # Yandex Maps reviews iframe widget; props: orgId; wrapped in mx-auto max-w-3xl overflow-hidden rounded-2xl sm:shadow-xl
│   │   │   │   ├── TestimonialsEmpty.tsx  # Fallback banner (MessageSquareOff icon + hint) shown when yandexMapsOrgId is absent/empty
│   │   │   │   └── TestimonialNav.tsx     # Dot indicators + prev/next arrows; props: active, onPrev, onNext, onDot
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
│   │   │       ├── FooterNav.tsx      # Nav links column (from headerContent.nav)
│   │   │       ├── FooterServices.tsx # First 4 service titles linking to #services
│   │   │       ├── FooterContact.tsx  # Phone, email, address via ICON_MAP + items.map()
│   │   │       └── FooterBottom.tsx   # Copyright + legal links nav + tagline
│   │   └── ui/                        # shadcn/ui primitives — DO NOT edit manually
│   │       ├── imageGallery/          # Reusable gallery component — no portfolio-specific logic; labels passed as props
│   │       │   ├── index.tsx          # ImageGallery orchestrator: activeIndex state, keyboard + swipe nav, lightboxOpen state; prev/next arrows + counter overlaid on image (group-hover fade); exports ImageGalleryItem, ImageGalleryProps
│   │       │   ├── ImageGalleryPreview.tsx    # Main image: bottom-gradient description overlay on desktop hover (group-hover, slides up), mobile description below; click opens lightbox
│   │       │   ├── ImageGalleryThumbnails.tsx # Horizontal snap-scroll strip; active thumb: ring-2 ring-primary + bg-primary/20 overlay; cursor-pointer on hover; scrollIntoView on change
│   │       │   └── ImageGalleryLightbox.tsx   # Fixed bg-black/90 modal: overlay nav buttons (hidden sm:flex), swipe on mobile, thumbnail strip, ESC/click-outside to close, body scroll lock
│   │       ├── orderForm/             # Configurable order form components — no backend; submission shows success state
│   │       │   ├── index.tsx          # OrderForm orchestrator: state, product tab switch, validation, submit; props: definition: OrderFormDefinition
│   │       │   ├── OrderFormField.tsx         # Single field renderer: switch on field.type → Input/Textarea/select/checkbox/radio
│   │       │   ├── OrderFormDynamicFields.tsx # Maps fields[] → OrderFormField
│   │       │   ├── OrderFormCustomerFields.tsx # Separator heading + OrderFormDynamicFields for customer data
│   │       │   ├── OrderFormConsent.tsx       # Consent checkbox + legal links (mirrors ContactConsent pattern)
│   │       │   ├── OrderFormSuccess.tsx       # Icon + title + text + reset button (mirrors ContactSuccess)
│   │       │   └── OrderFormProductTabs.tsx   # Horizontal scrollable tab bar for product type selection
│   │       ├── BackButton.tsx         # Fixed top-right back button (pill style, z-50, always visible) used on legal pages
│   │       ├── OptimizedImage.tsx     # Drop-in <img> replacement: <picture>+<source type="image/webp" srcset> in production; plain <img> fallback in dev (import.meta.env.DEV); props: src, alt, sizes?, priority?, width?, height?, className?; priority=true → loading="eager" fetchPriority="high"
│   │       ├── BreadCrumbs.tsx        # Pill-style breadcrumb nav bar (border-b, bg-white); props: items[]{label, href?}; last/no-href item shown as primary-tinted pill; used on PortfolioCasePage
│   │       ├── LegalPageLayout.tsx    # Shared layout for legal pages: BackButton + h1 + version footer + children; props: title, version, effectiveDate, children
│   │       ├── LegalSection.tsx       # Legal content section block: h2 + children div; props: id?, title, children
│   │       ├── SectionHeader.tsx      # Shared label badge + h2 + description block; props: label, title, description?, titleHighlight?, variant ('light'|'dark'), className
│   │       ├── StarRating.tsx         # Shared star row; props: rating, size? (default 16), className? (wrapper), starClassName? (per-star, default fill-primary)
│   │       ├── TestimonialCard.tsx    # Shared blockquote card (stars + quote + avatar/name); props: testimonial, showQuoteIcon?, starSize?, starClassName?, className?
│   │       ├── SocialLinks.tsx        # Telegram + VK icon buttons; props: telegram, vk, variant ('light'|'dark'|'colored'), className?; colored = brand bg tint always visible; dark = white/subtle; light = white bg + brand on hover; brand colors: Telegram #2AABEE, VK #0077FF
│   │       ├── PortfolioCard.tsx      # Full portfolio card (PortfolioThumbnail + tags + details link); prop: item (PortfolioCase & { href }); reads detailsLabel from portfolioSectionContent
│   │       ├── PortfolioThumbnail.tsx # Card thumbnail area: gradient/image bg + dot pattern fallback + dark hover overlay + category badge; props: href, image?, title, category, gradient
│   │       ├── TestimonialStrip.tsx   # Desktop-only 5-col thumbnail grid; props: active (index), onSelect (callback); reads testimonials directly
│   │       ├── HomeHashScroll.tsx     # Renderless component; watches location, smoothly scrolls to `#<id>` element when navigating to `/#<anchor>` from any non-home page; placed in App.tsx
│   │       ├── ScrollToTop.tsx        # Fixed bottom-right button; visible after threshold scroll OR immediately if page already scrolled past threshold on mount; scrolls to top via window.scrollTo
│   │       ├── SectionDivider.tsx    # SVG wave divider; props: variant ('to-white'|'to-muted'|'to-muted-light'|'to-dark'|'to-primary'), flipX?; renders absolute bottom-0 inside section — bg is transparent so section's own background (gradient or solid) shows through; placed as last child inside each section
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── separator.tsx
│   │       └── textarea.tsx
│   ├── hooks/
│   │   ├── useFadeIn.ts         # IntersectionObserver-based scroll-triggered fade-in; returns { ref: RefObject<HTMLElement>, isVisible: boolean }; respects prefers-reduced-motion; apply fade-in-section + is-visible CSS classes
│   │   ├── useScrolled.ts       # Passive scroll listener, returns bool after threshold (unused since Header moved in-flow)
│   │   ├── useActiveSection.ts  # Tracks active section for nav highlight
│   │   └── useCookieConsent.ts  # Returns 'all'|'necessary'|null; reactive via CustomEvent 'cookie_consent_change'
│   ├── lib/
│   │   ├── utils.ts            # cn() helper (clsx + tailwind-merge)
│   │   └── categorySlug.ts     # categorySlug(name) — looks up category name in categories const, returns slug; falls back to 'all'
│   │   └── imageSrcSet.ts      # resolveImageSrcSet(src, widths?) — pure helper: returns srcset string for /images/ paths; importable by components and plugins
│   ├── plugins/
│   │   ├── themePlugin.ts     # Vite plugin: reads data/config/theme.json, injects CSS vars + Google Fonts into index.html
│   │   └── imageResizePlugin.ts # Vite plugin (build-only): sharp-based WebP resizer; reads public/images/**; outputs _optimized/<name>-<w>w.webp per breakpoint; skips unchanged files via SHA-256 manifest; re-exports resolveImageSrcSet
│   ├── pages/
│   │   ├── Home.tsx               # Landing page content: Carousel → Hero → About → Services → Portfolio → Advantages → CallToAction → Testimonials → Contact; wrapped in <main>
│   │   ├── PortfolioPage.tsx      # Standalone /portfolio page: SectionHeader + PortfolioGrid (activeSlug=null); sets document.title
│   │   ├── PortfolioCategoryPage.tsx # /portfolio/:categorySlug: filters by category, renders SectionHeader + PortfolioGrid; "all" shows everything; unknown slug → not-found; sets document.title
│   │   ├── PortfolioCasePage.tsx  # /portfolio/:categorySlug/:caseSlug: BreadCrumbs (Home→Portfolio→Category→Case) + CaseHero + CaseOverview + BlockRenderer loop + CaseCTA
│   │   ├── PrivacyPolicy.tsx      # /privacy-policy — reads legalData (company, documents.privacyPolicy.{version,effectiveDate})
│   │   ├── Consent.tsx            # /consent — reads legalData (company, documents.consent.{version,effectiveDate})
│   │   └── UserAgreement.tsx      # /user-agreement — reads legalData (company, documents.userAgreement.{version,effectiveDate})
│   │   └── OrderPage.tsx          # /order — standalone order form page; reads ?form=<id> via useSearchParams; SectionHeader + form selector + OrderForm
│   ├── components/
│   │   ├── portfolio/
│   │   │   ├── blocks/
│   │   │   │   ├── BlockRenderer.tsx  # Central dispatcher: switch on block.__component → renders matching *Block component; props: block, caseGradient, caseTitle; wraps in py-4 (sparse) or py-8
│   │   │   │   ├── HeadingBlock.tsx   # h2/h3/h4 with STYLES const; mx-auto max-w-3xl font-heading
│   │   │   │   ├── ParagraphBlock.tsx # <p> with dangerouslySetInnerHTML; align prop (left/center); mx-auto max-w-3xl
│   │   │   │   ├── ListBlock.tsx      # ordered/unordered/checklist; checklist uses inline SVG check icons (primary color)
│   │   │   │   ├── ImageBlock.tsx     # <figure>+<img>+<figcaption>; size: small→max-w-md, medium→max-w-2xl, full→max-w-5xl
│   │   │   │   ├── GalleryBlock.tsx   # Wraps <ImageGallery>; reads labels from portfolioCaseContent + imageGalleryContent; props: block, caseTitle
│   │   │   │   ├── VideoBlock.tsx     # YouTube/Rutube → <iframe> embed; local .mp4/.webm/.ogg → <video>; aspect-ratio padding-top trick
│   │   │   │   ├── MetricsBlock.tsx   # 3-col KPI grid; color.type gradient/solid/primary/accent → colored bg + white text; otherwise white card + text-primary metric
│   │   │   │   ├── CardsBlock.tsx     # Grid of white cards; columns 2/3/4 (default 3); color.type → accent bar (gradient/solid/primary/accent)
│   │   │   │   ├── TableBlock.tsx     # overflow-x-auto table; bg-muted/60 thead; striped rows; highlight rows get bg-primary/5; optional total?: string[] — tfoot on desktop, summary card on mobile (total[0] as header label, remaining cells as label↔value pairs)
│   │   │   │   ├── ChartBlock.tsx     # Pure CSS/SVG charts: bar, horizontal-bar, progress (div-based); line, pie (SVG); no chart library; color?: BlockColor
│   │   │   │   ├── BlockquoteBlock.tsx # Variant A (testimonialId): renders <TestimonialCard>; Variant B (text+author): styled <blockquote> with border-l-4 border-primary
│   │   │   │   ├── CalloutBlock.tsx   # Colored left-border box; type→color map (info=blue, success=green, warning=amber, note=gray); icons from ICON_MAP
│   │   │   │   ├── DividerBlock.tsx   # line→<hr>; dots→three centered spans; space→<div className="py-8">
│   │   │   │   └── CodeBlock.tsx      # <pre><code> bg-muted font-mono; optional language tab header; optional figcaption
│   │   │   │   └── OrderFormBlock.tsx # Looks up orderFormsData.forms[formId], renders <OrderForm>; optional block.title
│   │   │   ├── CategoryNav.tsx    # Link-based category filter tabs; prop: activeSlug (null=all); "Все"→/portfolio; each cat→/portfolio/{slug}; reads categories + portfolioConfig.allLabel
│   │   │   ├── Pagination.tsx     # Prev/next buttons + page label; props: current, total, prevLabel, nextLabel, pageLabel, onPrev, onNext
│   │   │   ├── PortfolioGrid.tsx  # Shared grid + pagination + CTA; props: items, activeSlug; builds hrefs as /portfolio/{activeSlug??'all'}/{slug}; reads ?page via useSearchParams internally
│   │   │   ├── CaseHero.tsx       # Hero: hero.image present → OptimizedImage (absolute inset-0 object-cover, priority) + bg-black/50 overlay; no image → bg-gradient-to-br hero.gradient; props: hero, category, title, description
│   │   │   ├── CaseOverview.tsx   # 4-col grid (client/category/year/services); reads labels from content
│   │   │   └── CaseCTA.tsx        # Bottom CTA block; reads portfolioCaseContent.cta
│   ├── types/
│   │   ├── config/
│   │   │   ├── siteData.ts           # SiteData interface + siteData const (from data/config/site.json)
│   │   │   ├── theme.ts              # Theme interface + ThemeColors interface + theme const (from data/config/theme.json); app-side only — themePlugin uses its own local Theme type due to tsconfig.node.json constraints
│   │   │   ├── cookies.ts            # CookiesContent interface + cookiesContent const (from data/config/cookies.json); CtaLink inline
│   │   │   ├── portfolioConfig.ts    # PortfolioConfig interface + portfolioConfig const (from data/config/portfolio.json); shared listing config for all portfolio pages
│   │   │   ├── categories.ts         # Category interface + categories const (from data/config/categories.json); { name, slug }[]
│   │   │   └── legalData.ts          # LegalData interface + DocumentVersion interface + legalData const (from data/config/legal.json)
│   │   │   ├── orderForms.ts         # OrderFormsData interface + FormFieldDefinition + ProductType + OrderFormDefinition + orderFormsData const (from data/config/orderForms.json)
│   │   │   └── imageOptimization.ts  # ImageOptimizationConfig interface — shared by siteData.ts, imageResizePlugin.ts, and any component using optimized images
│   │   │   └── seo.ts                # SeoConfig interface + seoConfig const (from data/config/seo.json): siteUrl, siteName, locale, twitterCard, defaultOgImage
│   │   ├── sections/
│   │   │   ├── header.ts             # HeaderContent interface + headerContent const (from data/sections/header.json); CtaLink inline
│   │   │   ├── hero.ts               # HeroContent interface + heroContent const (from data/sections/hero.json); CtaLink inline
│   │   │   ├── carousel.ts           # CarouselSlide interface + carouselSlides const (from data/sections/carousel.json)
│   │   │   ├── carouselContent.ts    # CarouselSectionContent interface + carouselContent const (from data/sections/carouselContent.json)
│   │   │   ├── aboutContent.ts       # AboutSectionContent interface + aboutContent const (from data/sections/aboutContent.json)
│   │   │   ├── aboutValues.ts        # AboutValue interface + aboutValues const (from data/sections/aboutValues.json)
│   │   │   ├── servicesContent.ts    # ServicesSectionContent interface + servicesSectionContent const (from data/sections/servicesContent.json)
│   │   │   ├── services.ts           # Service interface + services const (from data/sections/services.json)
│   │   │   ├── advantagesContent.ts  # AdvantagesSectionContent interface + advantagesContent const (from data/sections/advantagesContent.json)
│   │   │   ├── advantages.ts         # Advantage interface + advantages const (from data/sections/advantages.json)
│   │   │   ├── callToAction.ts       # CallToActionContent interface + callToActionContent const (from data/sections/callToAction.json); CtaLink inline
│   │   │   ├── testimonialsContent.ts # TestimonialsSectionContent interface + testimonialsSectionContent const (from data/sections/testimonialsContent.json)
│   │   │   ├── testimonials.ts       # Testimonial interface + testimonials const (from data/sections/testimonials.json)
│   │   │   ├── contact.ts            # ContactContent interface + contactContent const (from data/sections/contact.json); CtaLink inline
│   │   │   └── footer.ts             # FooterContent interface + footerContent const (from data/sections/footer.json); CtaLink inline
│   │   ├── portfolio/
│   │   │   ├── index.ts              # PortfolioCase interface (hero:{image?,gradient}, content:ContentBlock[], images:{preview?,og?}) + GalleryImage interface + PortfolioSectionContent interface + portfolioSectionContent const — imported as '@/types/portfolio'
│   │   │   ├── blocks.ts             # ContentBlock discriminated union + all 14 block interfaces + BlockColor interface ({type:'solid'|'gradient'|'primary'|'accent'; value?:string})
│   │   │   ├── portfolioCaseContent.ts # PortfolioCaseContent interface + portfolioCaseContent const (from data/sections/portfolioCase.json)
│   │   │   ├── portfolioCases.ts     # portfolioCaseMap: Record<slug, PortfolioCase> — glob-loaded from data/portfolio/
│   │   │   └── imageGallery.ts       # ImageGalleryContent interface + imageGalleryContent const (from data/sections/imageGallery.json)
│   │   └── shared/
│   │       ├── index.ts              # NavLink interface
│   │       └── iconMap.ts            # ICON_MAP, resolveIcon(), IconComponent — shared icon registry (lucide-react)
│   ├── router.tsx             # Nested RouteObject[]: App as root layout (no path), children: Home ("/"), PortfolioPage ("/portfolio"), PortfolioCategoryPage ("/portfolio/:categorySlug"), PortfolioCasePage ("/portfolio/:categorySlug/:caseSlug"), legal pages
│   ├── main.tsx               # Entry: exports createRoot = ViteReactSSG({ routes })
│   └── index.css              # Tailwind import, @theme inline (references CSS vars), base styles, animate-fade-in keyframe; no hardcoded colors/fonts (injected by themePlugin)
├── .env.example
├── .prettierrc
├── components.json           # shadcn/ui config (aliases use src/ paths)
├── index.html                # title: РА «Рекламастер»; font preconnects injected by themePlugin
├── tsconfig.app.json         # paths: @/* → ./src/*, @data/* → ./data/*; resolveJsonModule: true; include: ["src"]
└── vite.config.ts            # themePlugin + @tailwindcss/vite + @vitejs/plugin-react, @/ and @data aliases, ssgOptions
```

## Layout (App.tsx — wraps all routes via `<Outlet />`)

```
<Header />          in-flow nav, solid white bg, border-b
<Outlet />          page content rendered here
<Footer />
<ScrollToTop />     fixed bottom-right, z-50, visible after 300px scroll, navSelector="#main-nav"
<CookieBanner />    fixed bottom/bottom-left dialog, persists consent to localStorage
```

## Home page composition (Home.tsx — rendered at "/")

```
<main>
  <Carousel />      full-bleed slider, 70vh
  <Hero />          #— (full-viewport)
  <About />         #about
  <Services />      #services
  <Portfolio />     #portfolio
  <Advantages />    #advantages  (dark section)
  <CallToAction />  mid-page CTA
  <Testimonials />  #testimonials
  <Contact />       #contact
</main>
```

## Routes

```
/                              → Home.tsx (landing page content, inside App layout)
/portfolio                     → PortfolioPage.tsx (all cases, paginated)
/portfolio/:categorySlug       → PortfolioCategoryPage.tsx (filtered listing; "all" shows everything)
/portfolio/:categorySlug/:caseSlug → PortfolioCasePage.tsx (SSG per JSON file; back→ /:categorySlug)
/privacy-policy                → PrivacyPolicy.tsx (static legal page, inside App layout)
/user-agreement                → UserAgreement.tsx (static legal page, inside App layout)
/consent                       → Consent.tsx (cookie consent policy page, inside App layout)
/order                         → OrderPage.tsx (standalone order form page, inside App layout)
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

UI copy is split into one JSON file per section — each section component imports only its own content module. No global `content.json` exists.

| Data file | Type module | Used by |
|---|---|---|
| `data/sections/header.json` | `src/types/sections/header.ts` → `headerContent` | `header/`, `footer/FooterNav.tsx`, `about/AboutCard.tsx`, `useActiveSection.ts` |
| `data/sections/hero.json` | `src/types/sections/hero.ts` → `heroContent` | `hero/` |
| `data/sections/carouselContent.json` | `src/types/sections/carouselContent.ts` → `carouselContent` | `carousel/CarouselSlide.tsx` |
| `data/sections/aboutContent.json` | `src/types/sections/aboutContent.ts` → `aboutContent` | `about/` |
| `data/sections/servicesContent.json` | `src/types/sections/servicesContent.ts` → `servicesSectionContent` | `services/` |
| `data/sections/portfolioPage.json` | `src/types/sections/portfolioPage.ts` → `portfolioPageContent` | `PortfolioPage.tsx`; page-specific copy only (`label`, `title`, `description`) |
| `data/config/portfolio.json` | `src/types/config/portfolioConfig.ts` → `portfolioConfig` | `PortfolioGrid.tsx`; shared listing config (`perPage`, pagination labels, `emptyLabel`, `allLabel`, `cta`) |
| `data/config/categories.json` | `src/types/config/categories.ts` → `categories` | `CategoryNav.tsx`, `PortfolioCategoryPage.tsx`, `src/lib/categorySlug.ts`; `[{ name, slug }]` |
| `data/sections/advantagesContent.json` | `src/types/sections/advantagesContent.ts` → `advantagesContent` | `advantages/` |
| `data/sections/callToAction.json` | `src/types/sections/callToAction.ts` → `callToActionContent` | `call-to-action/` |
| `data/sections/testimonialsContent.json` | `src/types/sections/testimonialsContent.ts` → `testimonialsSectionContent` | `testimonials/` |
| `data/sections/contact.json` | `src/types/sections/contact.ts` → `contactContent` | `contact/` (all sub-components) |
| `data/sections/footer.json` | `src/types/sections/footer.ts` → `footerContent` | `footer/` (all sub-components) |
| `data/sections/portfolioCase.json` | `src/types/portfolio/portfolioCaseContent.ts` → `portfolioCaseContent` | `PortfolioCasePage.tsx`, `portfolio/Case*.tsx` |
| `data/sections/imageGallery.json` | `src/types/portfolio/imageGallery.ts` → `imageGalleryContent` | `portfolio/blocks/GalleryBlock.tsx` |
| `data/config/cookies.json` | `src/types/config/cookies.ts` → `cookiesContent` | `banners/` |
| `data/config/orderForms.json` | `src/types/config/orderForms.ts` → `orderFormsData` | `ui/orderForm/`, `portfolio/blocks/OrderFormBlock.tsx`, `OrderPage.tsx` |
| `data/config/seo.json` | `src/types/config/seo.ts` → `seoConfig` | `src/plugins/ssgMetaPlugin.ts` (`onPageRendered`) |

- **`data/config/theme.json`** — brand identity: HSL color values, border radius, font families, and Google Fonts URLs. Consumed at build time by `src/plugins/themePlugin.ts` which injects CSS vars and `<link>` tags into `index.html`. App-side type: `Theme` + `ThemeColors` in `src/types/config/theme.ts`.
- **`data/config/site.json`** — global site config (phone, email, address, social links, hours). Optional fields: `yandexMapsOrgId` (enables Yandex reviews widget in Testimonials), `yandexMapUrl` (enables Yandex map iframe in ContactInfo), `imageOptimization` (widths/quality/format for imageResizePlugin). Exposed via `src/types/config/siteData.ts`; used by `header/`, `contact/`, `footer/`, `testimonials/`.
- **`data/sections/aboutValues.json`** — array of `{ title, description }` for the About section values list. Exposed via `src/types/sections/aboutValues.ts`; used by `about/`.
- **`data/sections/carousel.json`** — array of `{ id, image, alt, gradient, title, subtitle }` for the top carousel. `image` is optional (uses `gradient` fallback when empty). Exposed via `src/types/sections/carousel.ts`; used by `carousel/`.
- **`data/sections/advantages.json`** — array of `{ icon, title, description }` for the Advantages section. Exposed via `src/types/sections/advantages.ts`; used by `advantages/`. The `icon` field is a string key resolved via `ICON_MAP` from `src/types/shared/iconMap.ts`.
- **`data/sections/services.json`** — array of `{ icon, title, description }` for the Services section. Exposed via `src/types/sections/services.ts`; used by `services/` and `footer/FooterServices.tsx`. The `icon` field is a string key resolved via `ICON_MAP` from `src/types/shared/iconMap.ts`.
- **`data/sections/testimonials.json`** — array of testimonial objects. Exposed via `src/types/sections/testimonials.ts`; used by `PortfolioCasePage.tsx` (TestimonialCard). The Testimonials section now uses the Yandex widget instead of this data directly.
- **`data/config/legal.json`** — company legal details. Exposed via `src/types/config/legalData.ts`; used by legal pages. Gitignored — schema in `data/_schema/legal.example.json`.
- **`data/config/seo.json`** — global SEO defaults: `siteUrl`, `siteName`, `locale`, `twitterCard`, `defaultOgImage`. Read at build time by `src/plugins/ssgMetaPlugin.ts` (`onPageRendered`) to inject OG tags, canonical links, and JSON-LD into every static HTML page. Schema in `data/_schema/seo.example.json`.
- **`data/config/orderForms.json`** — order form definitions: `forms` (keyed by ID, each with `productTypes`, `customerFields`, `consent`, `success`), `page` (listing page copy). Exposed via `src/types/config/orderForms.ts`; used by `ui/orderForm/`, `portfolio/blocks/OrderFormBlock.tsx`, `OrderPage.tsx`. Schema in `data/_schema/orderForms.example.json`.
- **`data/portfolio/<slug>.json`** — one file per portfolio case study, typed as `PortfolioCase` (`src/types/portfolio/index.ts`, imported as `@/types/portfolio`). Shape: `slug`, `title`, `category`, `description`, `hero: { image?, gradient }`, `tags[]`, `meta`, `overview`, `content: ContentBlock[]`, `images: { preview?, og? }`. The `content` array is a dynamic zone of ordered blocks rendered by `BlockRenderer`. Block types defined in `src/types/portfolio/blocks.ts`.
- `data/` is at project root (not inside `src/`); path alias `@data` → `./data`.
- Components **never** import from `@data/` directly — always go through `src/types/`.
- All shared types, interfaces, consts, and data modules live in `src/types/` (organised into `config/`, `sections/`, `portfolio/`, `shared/` subfolders); only `utils.ts` stays in `src/lib/`.
- Portfolio collection loaded via `import.meta.glob('@data/portfolio/*.json', { eager: true, import: 'default' })` — see `src/types/portfolio/portfolioCases.ts`.
- Schema examples tracked in `data/_schema/` as JSON files showing the expected shape of each data file. The actual data files are gitignored.
- All data const exports use the `satisfies` operator (`export const x = data satisfies Type`) — validates JSON shape against the interface while preserving the narrow inferred type.

## SSG Build

- `vite-react-ssg` with `dirStyle: 'nested'` → `dist/portfolio/<slug>/index.html`.
- `includedRoutes` in `vite.config.ts` generates: `/portfolio`, `/portfolio/all`, `/portfolio/{catSlug}` per category, `/portfolio/all/{caseSlug}` for every case, `/portfolio/{catSlug}/{caseSlug}` for cases in their own category.
- `vite.config.ts` imports `'vite-react-ssg'` to activate `ssgOptions` type augmentation.
- Adding a new category = add one entry to `data/config/categories.json`; SSG picks it up automatically.
- Adding a new case = add `data/portfolio/{slug}.json`; no config change needed.

## Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add <component>
```

Files are placed in `src/components/ui/` — never edit them manually.

## Conventions

- **Components**: `PascalCase` files, one component per file — e.g. `PortfolioCard.tsx`
- **Other source files** (hooks, utils, type modules, helpers): `camelCase` — e.g. `portfolioConfig.ts`, `categorySlug.ts`, `useScrolled.ts`
- **Plan files** in `ai/tasks/`: `NNN_planName.md` — zero-padded number prefix, camel_case name — e.g. `006_portfolioPage.md`
- **Static content**: all data, types, and shared modules live in `src/types/` — components import from `@/types/`, never from `@data/` directly; `cn()` utility stays in `@/lib/utils`; `categorySlug()` helper in `@/lib/categorySlug`
- **Icon maps**: icons referenced by string key in JSON data (`icon` field), resolved to `IconComponent` via the shared `ICON_MAP` in `src/types/shared/iconMap.ts`; import `ICON_MAP`, `resolveIcon()`, or `IconComponent` type from there — do not import from `lucide-react` directly in components, do not create local icon maps
- **Tailwind**: use `cn()` from `@/lib/utils` for conditional class merging
- **Sections**: self-contained in `src/components/sections/`, import Container for layout
- **Path aliases**: `@/` → `src/`, `@data` → `data/` (root-level)

## Workflow Rules

- After completing every task, always run in sequence:
  1. `pnpm format` — reformat all changed files
  2. `pnpm tsc -b --noEmit` — typecheck, fix any errors before finishing
  3. `pnpm lint` — fix any new lint errors (`badge.tsx` / `button.tsx` are shadcn-generated — do not edit; their `react-refresh` rule is suppressed via ESLint override)
  4. Update `CLAUDE.md` — reflect any new/changed files, data modules, components, routes, or conventions
  5. Mark the completed task as **✅ done** in its plan file (`ai/tasks/NNN_*.md`) — update the task header or status table so the next session can see what is already implemented

## Key Rules

- **After modifying or creating any component**, review its Tailwind classes and improve them — consolidate redundant utilities, apply responsive variants, use semantic color tokens (`bg-primary`, `text-muted-foreground`, etc.) instead of raw values, and ensure consistent spacing scale
- **`cn()` from `@/lib/utils`** — do NOT reach for it by default; only add it when you identify a concrete need: conditional classes, merging a `className` prop from outside, combining multiple expressions, or a static string long enough to hurt readability (then split across lines inside `cn()`); a short static string stays as a plain string literal
- Package manager is **pnpm only** — never use npm or yarn
- Do not add server-side logic, API routes, or dynamic data fetching (fully static SSG)
- Keep bundle lean — prefer Tailwind utilities over custom CSS
- Do not install heavy animation libraries unless explicitly requested
- `@theme inline` in `index.css` is required for Tailwind v4 + shadcn compatibility — do not revert to `@theme`
- Use **react-router-dom v6** (not v7) — required by vite-react-ssg peer dependency
- Use **native DOM event types** in handlers — React 19 deprecated synthetic event aliases (`React.FormEvent`, `React.MouseEvent`, etc.); use `SubmitEvent`, `MouseEvent`, `InputEvent` etc. instead
- **Always use curly braces** in `if`/`else`/`for`/`while` bodies — enforced by ESLint `curly: ['error', 'all']` + `brace-style: ['error', '1tbs', { allowSingleLine: false }]`; body is always on a new line; `lint --fix` enforces this after `format`
