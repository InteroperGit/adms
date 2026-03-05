# 002 — Make site reusable for multiple clients

## Goal

Transform the current Рекламастер landing into a **white-label landing-page kit**: swap one `data/` folder and a theme file — get a fully branded site for a new client. Zero component edits per client.

---

## Current state (problems)

| Area | What's hardcoded | Where |
|------|------------------|-------|
| Hero section | Stats (10+ лет, 500+ проектов, 300+ клиентов), badge, headline, subheadline, 2 CTA labels | `Hero.tsx` |
| About section | H2, body paragraph, info-card stats (2014, 500+, 120+, 35, NPS 9.4) | `About.tsx` |
| Carousel header | "РА «Рекламастер»" | `Carousel.tsx` |
| CallToAction | Heading, subheading, 2 button labels | `CallToAction.tsx` |
| Services / Portfolio / Advantages / Testimonials | Section labels, H2, descriptions | Each `.tsx` |
| Contact | Form labels, placeholders, consent text, success message, day-of-week labels | `Contact.tsx` |
| Footer | Logo letter "Р", copyright template, tagline, legal link labels | `Footer.tsx` |
| Header | Logo letter "Р", CTA button "Связаться" | `Header.tsx`, `HeaderDesktopNav.tsx`, `HeaderMobileNav.tsx` |
| PortfolioCasePage | All section titles, 404 text, CTA block | `PortfolioCasePage.tsx` |
| Legal pages | All text inline, placeholder tokens (ИНН, ОГРН, etc.) | `PrivacyPolicy.tsx`, `Consent.tsx`, `UserAgrrement.tsx` |
| Nav links | Label strings in `NAV_LINKS` | `constants.ts` |
| Theme | HSL values in CSS `:root`, font families | `index.css` |
| Icon maps | Separate `ICON_MAP` per component, no shared registry | `Services.tsx`, `Advantages.tsx` |

---

## Plan

### Phase 1 — Unified content config (`data/content.json`)

Create a single **`data/content.json`** that holds every piece of UI copy currently hardcoded in components. One file per client is all you replace.

**1.1 Design the schema**

```jsonc
// data/content.json
{
  "lang": "ru",                          // <html lang>
  "logo": {
    "letter": "Р",                       // single-char logo
    "text": "Рекламастер"                // text beside logo
  },
  "nav": [
    { "label": "О нас",       "href": "#about" },
    { "label": "Услуги",      "href": "#services" },
    { "label": "Портфолио",   "href": "#portfolio" },
    { "label": "Контакты",    "href": "#contact" }
  ],
  "navCta": "Связаться",
  "hero": {
    "badge": "Рекламное агентство полного цикла",
    "title": "Реклама, которая продаёт",
    "titleHighlight": "продаёт",         // word(s) to gradient-highlight
    "subtitle": "Разрабатываем стратегии...",
    "cta": [
      { "label": "Обсудить проект", "href": "#contact" },
      { "label": "Наши работы",     "href": "#portfolio" }
    ],
    "stats": [
      { "value": "10+",  "label": "лет на рынке" },
      { "value": "500+", "label": "реализованных проектов" },
      { "value": "300+", "label": "довольных клиентов" }
    ]
  },
  "about": {
    "label": "О нас",
    "title": "Больше 10 лет создаём рекламу, которой доверяют",
    "text": "Основанное в 2014 году...",
    "card": {
      "tagline": "Рекламное агентство полного цикла",
      "stats": [
        { "label": "Основано", "value": "2014" },
        { "label": "Проектов",  "value": "500+" },
        { "label": "Клиентов",  "value": "120+" },
        { "label": "Специалистов", "value": "35" }
      ],
      "nps": { "label": "Средний NPS", "value": "9.4" }
    }
  },
  "services": {
    "label": "Услуги",
    "title": "Что мы делаем",
    "description": "Полный цикл рекламных услуг..."
  },
  "portfolio": {
    "label": "Портфолио",
    "title": "Наши работы",
    "description": "Избранные проекты из разных отраслей...",
    "cta": { "label": "Обсудить ваш проект", "href": "#contact" },
    "allCategory": "Все"
  },
  "advantages": {
    "label": "Почему мы",
    "title": "Почему клиенты выбирают Рекламастер",
    "description": "Мы не просто подрядчик..."
  },
  "callToAction": {
    "title": "Готовы запустить рекламу, которая работает?",
    "subtitle": "Оставьте заявку сегодня...",
    "cta": [
      { "label": "Получить стратегию", "href": "#contact" },
      { "label": "Смотреть кейсы",     "href": "#portfolio" }
    ]
  },
  "testimonials": {
    "label": "Отзывы",
    "title": "Что говорят клиенты",
    "description": "Нам доверяют компании из разных отраслей..."
  },
  "contact": {
    "label": "Контакты",
    "title": "Обсудим ваш проект?",
    "description": "Оставьте заявку — перезвоним...",
    "form": {
      "name":    { "label": "Ваше имя",            "placeholder": "Иван Иванов" },
      "contact": { "label": "Телефон или email",   "placeholder": "+7 (999) 000-00-00 или mail@example.com" },
      "message": { "label": "Расскажите о задаче", "placeholder": "Кратко опишите..." },
      "consent": "Я даю согласие на обработку персональных данных",
      "submit":  "Отправить заявку",
      "success": { "title": "Заявка отправлена!", "text": "Мы свяжемся с вами в ближайшее время." }
    },
    "dayLabels": { "weekdays": "Пн–Пт", "saturday": "Суббота", "sunday": "Воскресенье" }
  },
  "footer": {
    "description": "Рекламное агентство полного цикла...",
    "copyright": "© {year} {name}. Все права защищены.",
    "tagline": "Реклама, которая работает.",
    "legalLinks": [
      { "label": "Политика конфиденциальности", "href": "/privacy-policy" },
      { "label": "Согласие на обработку данных", "href": "/consent" },
      { "label": "Пользовательское соглашение", "href": "/user-agreement" }
    ]
  },
  "portfolioCase": {
    "backLabel": "Назад к портфолио",
    "overviewLabels": { "client": "Клиент", "category": "Категория", "year": "Год", "services": "Услуги" },
    "challengeTitle": "Задача",
    "solutionTitle": "Решение",
    "resultsTitle": "Результаты",
    "galleryTitle": "Галерея",
    "cta": { "title": "Готовы к похожему результату?", "subtitle": "...", "label": "Обсудить проект" },
    "notFound": { "title": "Страница не найдена", "back": "Вернуться к портфолио" }
  },
  "cookies": {
    "title": "Мы используем cookie",
    "text": "Технически необходимые файлы...",
    "acceptAll": "Принять все",
    "necessaryOnly": "Только необходимые"
  }
}
```

**1.2 Create typed lib module `src/lib/content.ts`**

```ts
import raw from '@data/content.json';
export type Content = typeof raw;
export const content: Content = raw;
```

**1.3 Create example schema `data/_schema/content.example.json`**

Copy the full structure with placeholder values so new clients have a template.

**1.4 Migrate components** (one by one, no layout changes)

For each section, replace every hardcoded string with a field from `content.*`:

| Component | Reads from |
|-----------|------------|
| `Header.tsx` | `content.logo`, `content.navCta` |
| `HeaderDesktopNav.tsx` | `content.nav`, `content.navCta` |
| `HeaderMobileNav.tsx` | `content.nav`, `content.navCta` |
| `Hero.tsx` | `content.hero` (badge, title, titleHighlight, subtitle, cta, stats) |
| `Carousel.tsx` | `content.logo.text` (replaces hardcoded "РА «Рекламастер»") |
| `About.tsx` | `content.about` (label, title, text, card stats, NPS) |
| `Services.tsx` | `content.services` (label, title, description) |
| `Portfolio.tsx` | `content.portfolio` (label, title, description, cta, allCategory) |
| `Advantages.tsx` | `content.advantages` (label, title, description) |
| `CallToAction.tsx` | `content.callToAction` (title, subtitle, cta[]) |
| `Testimonials.tsx` | `content.testimonials` (label, title, description) |
| `Contact.tsx` | `content.contact` (label, title, description, form fields, dayLabels) |
| `Footer.tsx` | `content.footer`, `content.logo`, `content.nav` |
| `PortfolioCasePage.tsx` | `content.portfolioCase` |
| `CookieBanner.tsx` | `content.cookies` |

**1.5 Delete `NAV_LINKS` from `constants.ts`**

Navigation now comes from `content.nav`. `constants.ts` only keeps non-content constants (`STORAGE_KEY`, `CONSENT_EVENT`).

---

### Phase 2 — Theme config (`data/theme.json`)

Move brand identity out of CSS so a new client only swaps a JSON file.

**2.1 Design the schema**

```jsonc
// data/theme.json
{
  "colors": {
    "primary":    "17 93% 52%",       // HSL without hsl()
    "accent":     "262 83% 58%",
    "background": "0 0% 100%",
    "foreground": "230 20% 7%",
    "muted":      "220 20% 97%",
    "mutedForeground": "220 9% 46%",
    "border":     "220 13% 91%"
  },
  "fonts": {
    "heading": "Plus Jakarta Sans",
    "body": "Inter"
  },
  "fontUrls": [
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300..800&display=swap",
    "https://fonts.googleapis.com/css2?family=Inter:wght@300..600&display=swap"
  ]
}
```

**2.2 Vite plugin or build script to inject theme**

Create a small Vite plugin (`src/plugins/themePlugin.ts`) that:
1. Reads `data/theme.json` at build time
2. Generates a `theme.css` string with `:root { --primary: ...; }` values
3. Injects it via `transformIndexHtml` or writes to a virtual module

This replaces the hardcoded HSL values currently in `index.css`.

**2.3 Dynamic Google Fonts loading**

Replace static `@import url(...)` in `index.css` with `<link>` tags generated from `theme.fontUrls` via the same Vite plugin (injected into `index.html`).

**2.4 Update `index.css`**

Remove hardcoded HSL values and font `@import` statements. Keep only:
- `@theme inline` block (referencing CSS vars, not values)
- Base styles (`h1`/`h2` clamp, selection, link colors)
- `animate-fade-in` keyframe

---

### Phase 3 — Shared icon registry

**3.1 Create `src/lib/iconMap.ts`**

```ts
import { Lightbulb, MonitorSmartphone, ... } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb, MonitorSmartphone, Megaphone, LayoutTemplate,
  BarChart3, Share2, CircleDollarSign, Clock, UserRound,
  LineChart, Building2, Handshake,
  // add more as needed
};

export function resolveIcon(key: string): LucideIcon | undefined {
  return ICON_MAP[key];
}
```

**3.2 Migrate components**

Replace local `ICON_MAP` objects in `Services.tsx` and `Advantages.tsx` with imports from `src/lib/iconMap.ts`. Single source of truth, easy to extend for new icon keys in a client's JSON.

---

### Phase 4 — Legal pages from data

**4.1 Create `data/legal.json`**

```jsonc
{
  "company": {
    "name": "ИП Иванов И.И.",
    "inn": "1234567890",
    "ogrn": "1234567890123",
    "legalAddress": "г. Москва, ул. Примерная, д. 1",
    "siteUrl": "https://example.com",
    "email": "info@example.com"
  },
  "effectiveDate": "04 марта 2026 г."
}
```

**4.2 Create typed module `src/lib/legalData.ts`**

**4.3 Replace `[УКАЖИТЕ ...]` placeholders in legal pages**

Each legal page reads from `legalData.company.*` instead of showing placeholder tokens. No manual find-and-replace needed per client.

---

### Phase 5 — Component decomposition

Break large monolithic components into small, focused, reusable pieces. This makes it easier to compose different page layouts per client and reduces cognitive load.

**5.1 Shared `SectionHeader` component**

The same pattern (label badge + `<h2>` + description `<p>`) is repeated in 7 sections: Services, Portfolio, Advantages, Testimonials, Contact, About, Hero. Extract to `src/components/ui/SectionHeader.tsx`:

```tsx
interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
}
```

Migrate: `Services.tsx`, `Portfolio.tsx`, `Advantages.tsx`, `Testimonials.tsx`, `Contact.tsx`. (About and Hero have slightly different layouts — keep inline.)

**5.2 Shared `StarRating` component**

Star rating rendering is duplicated in `Testimonials.tsx` (main card + strip) and `PortfolioCasePage.tsx`. Extract to `src/components/ui/StarRating.tsx`:

```tsx
interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}
```

**5.3 Shared `TestimonialCard` component**

The testimonial blockquote (stars + quote text + author avatar + name/role) appears in both `Testimonials.tsx` (carousel) and `PortfolioCasePage.tsx`. Extract to `src/components/ui/TestimonialCard.tsx` and reuse in both places.

**5.4 Shared `SocialLinks` component**

Social links block (Telegram icon + VK inline SVG) is duplicated in `Contact.tsx` and `Footer.tsx` with identical SVG. Extract to `src/components/ui/SocialLinks.tsx`. Also extract the VK SVG into a `VkIcon` component in the same file.

**5.5 Decompose `Contact.tsx` (275 lines → 4 sub-components)**

| New component | Location | Responsibility | ~Lines |
|---|---|---|---|
| `ContactForm.tsx` | `src/components/sections/contact/` | Form state, validation, consent checkbox, submit | ~90 |
| `ContactSuccess.tsx` | `src/components/sections/contact/` | Success message after form submit | ~20 |
| `ContactInfo.tsx` | `src/components/sections/contact/` | Phone, email, address list + social links | ~60 |
| `ContactHours.tsx` | `src/components/sections/contact/` | Working hours card | ~25 |

`Contact.tsx` becomes a thin orchestrator (~40 lines) composing these four.

**5.6 Decompose `Footer.tsx` (175 lines → sub-components)**

| New component | Location | Responsibility | ~Lines |
|---|---|---|---|
| `FooterBrand.tsx` | `src/components/sections/footer/` | Logo, description, social links | ~35 |
| `FooterNav.tsx` | `src/components/sections/footer/` | Navigation links column | ~20 |
| `FooterServices.tsx` | `src/components/sections/footer/` | First 4 service titles | ~20 |
| `FooterContact.tsx` | `src/components/sections/footer/` | Phone, email, address | ~25 |
| `FooterBottom.tsx` | `src/components/sections/footer/` | Copyright + legal links + tagline | ~30 |

`Footer.tsx` becomes a grid layout composing these five (~30 lines).

**5.7 Decompose `PortfolioCasePage.tsx` (233 lines → sub-components)**

| New component | Location | Responsibility | ~Lines |
|---|---|---|---|
| `CaseHero.tsx` | `src/components/portfolio/` | Gradient hero with badge, title, description | ~15 |
| `CaseOverview.tsx` | `src/components/portfolio/` | 4-column client/category/year/services grid | ~20 |
| `CaseSolution.tsx` | `src/components/portfolio/` | 3-column solution cards | ~20 |
| `CaseResults.tsx` | `src/components/portfolio/` | 3 metric cards with gradient | ~20 |
| `CaseGallery.tsx` | `src/components/portfolio/` | Responsive image gallery grid | ~25 |
| `CaseCTA.tsx` | `src/components/portfolio/` | Bottom call-to-action block | ~15 |

`PortfolioCasePage.tsx` becomes a sequence of these + existing `TestimonialCard` (~60 lines). Note: challenge section is too small (~6 lines JSX) to extract — keep inline.

**5.8 Extract `PortfolioCard` from `Portfolio.tsx`**

The card inside the grid (thumbnail + content + tags + link) is ~55 lines. Extract to `src/components/ui/PortfolioCard.tsx`. Makes `Portfolio.tsx` cleaner and the card reusable in other layouts.

**5.9 Extract `TestimonialStrip` from `Testimonials.tsx`**

The desktop 5-column thumbnail grid at the bottom is a self-contained block (~30 lines). Extract to `src/components/ui/TestimonialStrip.tsx`.

---

### Phase 6 — Clean up & DX

**6.1 Fix filename typo**

Rename `src/pages/UserAgrrement.tsx` → `src/pages/UserAgreement.tsx`. Update import in `router.tsx`.

**6.2 Update schema examples**

Add `data/_schema/content.example.json`, `data/_schema/theme.example.json`, `data/_schema/legal.example.json` so new client setup is obvious.

**6.3 Add `data/README.md`**

Short doc explaining:
- What each JSON file does
- How to create a new client config
- Which files to copy/edit

**6.4 Update CLAUDE.md**

Reflect new data architecture, theme system, icon registry, component decomposition, and content module.

---

## Execution order & dependencies

```
Phase 1 (content.json)        ←  largest, do first
  └─ 1.1 schema → 1.2 lib module → 1.3 example → 1.4 migrate components → 1.5 cleanup
Phase 2 (theme.json)           ←  independent of Phase 1
  └─ 2.1 schema → 2.2 vite plugin → 2.3 fonts → 2.4 css cleanup
Phase 3 (icon registry)        ←  small, independent
  └─ 3.1 create → 3.2 migrate
Phase 4 (legal data)           ←  independent
  └─ 4.1 schema → 4.2 lib module → 4.3 migrate pages
Phase 5 (component decompose)  ←  after Phase 1 (components already reference content.*)
  └─ 5.1 SectionHeader → 5.2 StarRating → 5.3 TestimonialCard → 5.4 SocialLinks
     → 5.5 Contact split → 5.6 Footer split → 5.7 CasePage split → 5.8 PortfolioCard → 5.9 TestimonialStrip
Phase 6 (cleanup)              ←  after all phases
  └─ 6.1 rename → 6.2 schemas → 6.3 readme → 6.4 claude.md
```

Phases 1–4 are independent and can be done in any order. Phase 5 depends on Phase 1 (migrated components). Phase 6 is final cleanup.

---

## Result

After all phases, creating a site for a new client requires:

1. Copy `data/` folder
2. Edit 4 JSON files: `content.json`, `theme.json`, `legal.json`, `site.json`
3. Replace data collections: `services.json`, `advantages.json`, `testimonials.json`, `carousel.json`, `about-values.json`, `portfolio/*.json`
4. `pnpm build`

**Zero component code changes per client.**
