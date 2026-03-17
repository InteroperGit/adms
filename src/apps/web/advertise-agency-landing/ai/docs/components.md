# Components Guide

## Sections Layout

**Home.tsx (/):** Carousel (70vh) → Hero → About → Services → Portfolio → Advantages (dark) → CallToAction → Testimonials → Contact

**App.tsx layout:**
```
<Header />              # in-flow, border-b border-border shadow-sm
  <Outlet />            # page content
<Footer />
<ScrollToTop />
<CookieBanner />
<MetrikaScript />
```

All sections are self-contained in `src/components/sections/`, using `Container` for consistent layout width.

## SectionBadge Component

`src/components/ui/section/SectionBadge.tsx` — used to label section headings.

**Props:**
- `label` (string, required) — badge text
- `variant?` (`'light' | 'dark'`, default: `'light'`) — color scheme
- `className?` (string, optional) — additional Tailwind classes

## Portfolio Components

Located in `src/components/portfolio/`.

### PortfolioGrid.tsx

Shared grid component for portfolio listing pages.

**Props:**
- `items: PortfolioCase[]` — cases to display
- `activeSlug: string | null` — current category filter

**Behavior:**
- Builds hrefs as `/portfolio/${activeSlug ?? 'all'}/${slug}`
- Reads `?page` via `useSearchParams` internally
- Renders: `CategoryNav` + card grid + `Pagination` + CTA button

### CategoryNav.tsx

Link-based category filter tabs for portfolio pages.

**Props:**
- `activeSlug: string | null` — current active category slug; `null` or `"all"` are equivalent

**Routes:**
- "Все" (all) → `/portfolio` (active when `null` or `"all"`)
- Category tabs → `/portfolio/{slug}` (e.g., `/portfolio/branding`)

Reads `categories` const + `portfolioConfig.allLabel` from config.

### Pagination.tsx

Previous/next navigation + page label display.

**Props:**
- `current` (number) — current page index (0-based)
- `total` (number) — total number of pages
- `prevLabel` (string) — "Previous" button text
- `nextLabel` (string) — "Next" button text
- `pageLabel` (string) — format string for page display (e.g., `"Page {current} of {total}"`)
- `onPrev: () => void` — previous button handler
- `onNext: () => void` — next button handler

## Carousel Component

`src/components/sections/Carousel.tsx` — full-bleed hero slider.

**Features:**
- Dimensions: full-width, 70vh height
- Auto-advances every 5 seconds
- Pauses on hover
- Crossfade transition (700ms)
- Displays slide counter + dot indicators + prev/next arrows

**JSON Schema (data/sections/carousel.json):**
Each slide has:
- `title` (string) — slide headline
- `description` (string, optional) — subtitle
- `image` (string, optional) — image path; if empty, falls back to `gradient` class
- `gradient` (string) — Tailwind gradient class (used if no image)
- `cta?` (CtaLink, optional) — call-to-action link

```typescript
interface CarouselSlide {
  title: string;
  description?: string;
  image?: string;        // falls back to gradient if empty
  gradient: string;      // Tailwind class: "from-blue-500 to-purple-600"
  cta?: { text: string; href: string };
}
```

## Header

**Style:**
- In-flow (not fixed) — `bg-background border-b border-border shadow-sm`
- No scroll-aware logic (e.g., hide-on-scroll)

**Features:**
- `useActiveSection` hook tracks scroll position for nav highlight
- `useTheme` (from `@/hooks/useTheme`) called in `header/index.tsx`; passes `isDark` + `toggle` to nav sub-components
- Sun/Moon theme toggle button:
  - Desktop: in `HeaderDesktopNav` (between SocialLinks and CTA button)
  - Mobile: in `HeaderMobileNav` (in menu footer)

**Data:**
- Navigation links from `data/sections/header.json` → `headerContent.nav`
- Links auto-tracked for highlighting by `useActiveSection`

## Legal Page Content

Legal pages (Privacy Policy, User Agreement, Consent) render blocks from JSON.

**Block types in `LegalContentSchema`:**
- `p` (text) — paragraph with optional `{company.X}` tokens + inline HTML
- `ul` — unordered list
- `ol` — ordered list
- `dl` — definition list: `{ term: string; def: string }[]`
- `contact` — contact details: `{ label: string; field: string }[]` where `field` is a key of `legalData.company`

**Example contact block:**
```json
{
  "id": "legal-contact",
  "title": "Contact Info",
  "blocks": [
    {
      "__component": "contact",
      "items": [
        { "label": "Email", "field": "email" },
        { "label": "Phone", "field": "phone" }
      ]
    }
  ]
}
```

Text fields support `{company.X}` tokens (e.g., `{company.name}`, `{company.email}`) which are substituted at runtime. Rendered via `dangerouslySetInnerHTML` in `LegalBlockRenderer.tsx`.

## Icons

Icons are referenced by **string key** in JSON data, never imported directly from `lucide-react`.

**System:**
- `src/types/shared/iconMap.ts` exports `ICON_MAP: Record<string, LucideIcon>` + `resolveIcon(key: string): LucideIcon`
- JSON stores icon names as strings (e.g., `"icon": "settings"`)
- Components call `resolveIcon(key)` to get the icon component
- **Do NOT** create local icon maps in components — always use the centralized `ICON_MAP`

**Example:**
```typescript
// In JSON
{ "icon": "settings", "text": "Configuration" }

// In component
import { resolveIcon } from '@/types/shared/iconMap';
const IconComponent = resolveIcon(data.icon);
```
