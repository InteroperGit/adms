# 003 — Decompose components to maximum simplicity

## Goal

Break every component over ~50 lines into focused sub-components with a single responsibility each. Target: no component exceeds 60 lines (excluding legal pages, which are document templates). Every component should be readable in one screen.

---

## Current state (line counts)

| Component | Lines | Status |
|-----------|------:|--------|
| **PrivacyPolicy.tsx** | 232 | duplicated Section helper |
| **Consent.tsx** | 181 | duplicated Section helper |
| **UserAgreement.tsx** | 178 | duplicated Section helper |
| **PortfolioCasePage.tsx** | 117 | orchestrator, ok but has inline 404 |
| **ContactForm.tsx** | 107 | form state + fields + consent mixed |
| **Carousel.tsx** | 102 | slide rendering + controls + timer |
| **Hero.tsx** | 101 | badge + title + CTA + stats grid |
| **About.tsx** | 97 | text + info card + values list |
| **Portfolio.tsx** | 84 | filter logic + grid + CTA |
| **PortfolioCard.tsx** | 76 | thumbnail + overlay + content |
| **Testimonials.tsx** | 75 | carousel + dots + arrows |
| **ContactInfo.tsx** | 71 | 3x icon+text items + social |
| **CookieBanner.tsx** | 66 | consent dialog + handlers |
| **TestimonialCard.tsx** | 61 | quote + stars + avatar |
| **HeaderMobileNav.tsx** | 60 | toggle + overlay menu |
| **Advantages.tsx** | 58 | header + card grid |
| **SocialLinks.tsx** | 53 | VkIcon SVG + link buttons |
| **CallToAction.tsx** | 52 | banner + CTA buttons |
| **Services.tsx** | 51 | header + card grid |

Components under 50 lines are already well-decomposed and not listed.

---

## Plan

### Phase 1 — Shared legal page infrastructure

The 3 legal pages duplicate a `Section` helper component and share the same document template structure (BackButton + Container + heading + sections). Extract shared pieces.

**1.1 Create `src/components/ui/LegalSection.tsx`**

Shared section wrapper used in all 3 legal pages:

```tsx
interface LegalSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}
```

Renders an `<section>` with consistent `id`, `<h2>`, and children slot. ~15 lines.

**1.2 Create `src/components/ui/LegalPageLayout.tsx`**

Shared page shell for all legal pages:

```tsx
interface LegalPageLayoutProps {
  title: string;
  version: string;
  effectiveDate: string;
  children: React.ReactNode;
}
```

Renders BackButton + Container + `<h1>` + version/date badges + children. ~30 lines. Eliminates duplicated boilerplate in each legal page.

**1.3 Refactor legal pages to use shared components**

Each page becomes a list of `<LegalSection>` children inside `<LegalPageLayout>`. No more inline `Section` function. Estimated reduction: ~30 lines per page.

| Page | Before | After |
|------|-------:|------:|
| PrivacyPolicy.tsx | 232 | ~200 |
| Consent.tsx | 181 | ~150 |
| UserAgreement.tsx | 178 | ~150 |

Note: legal pages will still be long (150–200 lines) because they contain actual legal document text. That's acceptable — they're document templates, not UI logic.

---

### Phase 2 — Hero decomposition

**2.1 Extract `src/components/sections/hero/HeroStats.tsx`**

Stats grid (3 stat cards with value + label). Props: `stats: { value: string; label: string }[]`. ~20 lines.

**2.2 Extract `src/components/sections/hero/HeroCTA.tsx`**

Two CTA buttons (primary + outline). Props: `cta: { label: string; href: string }[]`. ~20 lines.

**2.3 Refactor `Hero.tsx` into `src/components/sections/hero/index.tsx`**

Thin orchestrator: badge + title + subtitle + `<HeroCTA>` + `<HeroStats>`. Move to subfolder.

| File | Before | After |
|------|-------:|------:|
| Hero (index.tsx) | 101 | ~55 |
| HeroStats.tsx | — | ~20 |
| HeroCTA.tsx | — | ~20 |

---

### Phase 3 — Carousel decomposition

**3.1 Extract `src/components/sections/carousel/CarouselSlide.tsx`**

Single slide renderer (gradient bg or image + title + subtitle). Props: `slide: CarouselSlide`, `isActive: boolean`. ~30 lines.

**3.2 Extract `src/components/sections/carousel/CarouselControls.tsx`**

Prev/next arrows + dot indicators + slide counter. Props: `total: number`, `current: number`, `onPrev`, `onNext`, `onDot`. ~30 lines.

**3.3 Refactor `Carousel.tsx` into `src/components/sections/carousel/index.tsx`**

Orchestrator with auto-advance timer + state. Move to subfolder.

| File | Before | After |
|------|-------:|------:|
| Carousel (index.tsx) | 102 | ~45 |
| CarouselSlide.tsx | — | ~30 |
| CarouselControls.tsx | — | ~30 |

---

### Phase 4 — About decomposition

**4.1 Extract `src/components/sections/about/AboutCard.tsx`**

Right-side info card: tagline, stat grid (4 items), NPS badge. Props: `card: Content['about']['card']`, `values: AboutValue[]`. ~40 lines.

**4.2 Refactor `About.tsx` into `src/components/sections/about/index.tsx`**

Two-column layout: left text + values list, right `<AboutCard>`. Move to subfolder.

| File | Before | After |
|------|-------:|------:|
| About (index.tsx) | 97 | ~55 |
| AboutCard.tsx | — | ~40 |

---

### Phase 5 — ContactForm decomposition

**5.1 Extract `src/components/sections/contact/ContactFormFields.tsx`**

Three input fields (name, contact, message) — just the field markup. Props: form field labels/placeholders from content. ~35 lines.

**5.2 Extract `src/components/sections/contact/ContactConsent.tsx`**

Consent checkbox + legal link. Props: `checked: boolean`, `onChange`, consent label text. ~20 lines.

**5.3 Simplify `ContactForm.tsx`**

Becomes form state + `<ContactFormFields>` + `<ContactConsent>` + submit button. Renders `<ContactSuccess>` on success.

| File | Before | After |
|------|-------:|------:|
| ContactForm.tsx | 107 | ~55 |
| ContactFormFields.tsx | — | ~35 |
| ContactConsent.tsx | — | ~20 |

---

### Phase 6 — PortfolioCard decomposition

**6.1 Extract `src/components/ui/PortfolioThumbnail.tsx`**

Card thumbnail area: image + gradient overlay + category badge + hover overlay with title. Props: `image`, `title`, `category`, `gradient`. ~35 lines.

**6.2 Simplify `PortfolioCard.tsx`**

Becomes `<PortfolioThumbnail>` + content section (tags + description + details link).

| File | Before | After |
|------|-------:|------:|
| PortfolioCard.tsx | 76 | ~45 |
| PortfolioThumbnail.tsx | — | ~35 |

---

### Phase 7 — ContactInfo decomposition

**7.1 Extract `src/components/sections/contact/ContactItem.tsx`**

Single contact item: icon + label + value (with optional link). Props: `icon: LucideIcon`, `label: string`, `value: string`, `href?: string`. ~15 lines. Reusable in FooterContact too.

**7.2 Simplify `ContactInfo.tsx`**

Three `<ContactItem>` instances + `<SocialLinks>`.

| File | Before | After |
|------|-------:|------:|
| ContactInfo.tsx | 71 | ~35 |
| ContactItem.tsx | — | ~15 |

**7.3 Simplify `FooterContact.tsx` (optional)**

Reuse `<ContactItem>` from contact folder or create a shared version in `ui/`. Currently 41 lines — would drop to ~25 lines.

---

### Phase 8 — Portfolio section decomposition

**8.1 Extract `src/components/sections/portfolio/PortfolioFilter.tsx`**

Category filter buttons with active state. Props: `categories: string[]`, `active: string`, `onChange`. ~25 lines.

**8.2 Refactor `Portfolio.tsx` into `src/components/sections/portfolio/index.tsx`**

Orchestrator: `<SectionHeader>` + `<PortfolioFilter>` + grid of `<PortfolioCard>` + CTA. Move to subfolder.

| File | Before | After |
|------|-------:|------:|
| Portfolio (index.tsx) | 84 | ~55 |
| PortfolioFilter.tsx | — | ~25 |

---

### Phase 9 — Minor extractions (50–65 line range)

These are at the threshold. Extract only if the separation is clean and improves readability.

**9.1 `CookieBanner.tsx` (66 lines) — Extract consent button group**

Extract `src/components/banners/CookieActions.tsx` (~15 lines): two buttons (accept all / necessary only). Keeps CookieBanner at ~50 lines.

**9.2 `Testimonials.tsx` (75 lines) — Extract navigation controls**

Extract `src/components/sections/testimonials/TestimonialNav.tsx` (~20 lines): prev/next arrows + dot indicators. Refactor Testimonials into subfolder.

| File | Before | After |
|------|-------:|------:|
| Testimonials (index.tsx) | 75 | ~55 |
| TestimonialNav.tsx | — | ~20 |

**9.3 `HeaderMobileNav.tsx` (60 lines) — no change**

Already at the threshold; hamburger + overlay are tightly coupled. Leave as-is.

**9.4 `Advantages.tsx` (58 lines) — no change**

Clean single-responsibility. Leave as-is.

**9.5 `Services.tsx` (51 lines) — no change**

Clean single-responsibility. Leave as-is.

**9.6 `CallToAction.tsx` (52 lines) — no change**

Clean single-responsibility. Leave as-is.

**9.7 `SocialLinks.tsx` (53 lines) — no change**

VkIcon SVG is co-located by design. Leave as-is.

**9.8 `TestimonialCard.tsx` (61 lines) — no change**

Quote + stars + avatar are tightly coupled. Extracting avatar (~9 lines) has minimal value. Leave as-is.

---

### Phase 10 — PortfolioCasePage cleanup

**10.1 Extract `src/pages/NotFoundCase.tsx`**

404 fallback for invalid portfolio slugs. Currently inline in PortfolioCasePage (~12 lines). ~20 lines as standalone.

**10.2 Simplify `PortfolioCasePage.tsx`**

Already a clean orchestrator of Case* components. After extracting NotFoundCase: ~100 lines. Acceptable for a page-level orchestrator.

---

## Execution order & dependencies

```
Phase 1 (Legal shared infra)     independent, high duplication savings
Phase 2 (Hero decompose)         independent
Phase 3 (Carousel decompose)     independent
Phase 4 (About decompose)        independent
Phase 5 (ContactForm decompose)  independent
Phase 6 (PortfolioCard decompose) independent
Phase 7 (ContactInfo decompose)  independent
Phase 8 (Portfolio decompose)    independent
Phase 9 (Minor extractions)      independent, lowest priority
Phase 10 (CasePage cleanup)      independent, lowest priority
```

All phases are independent — they touch different component files. Phases 1–8 are high/medium priority. Phases 9–10 are optional improvements.

---

## New files summary

| Phase | New files | Location |
|-------|-----------|----------|
| 1 | LegalSection.tsx, LegalPageLayout.tsx | `src/components/ui/` |
| 2 | HeroStats.tsx, HeroCTA.tsx, index.tsx | `src/components/sections/hero/` |
| 3 | CarouselSlide.tsx, CarouselControls.tsx, index.tsx | `src/components/sections/carousel/` |
| 4 | AboutCard.tsx, index.tsx | `src/components/sections/about/` |
| 5 | ContactFormFields.tsx, ContactConsent.tsx | `src/components/sections/contact/` |
| 6 | PortfolioThumbnail.tsx | `src/components/ui/` |
| 7 | ContactItem.tsx | `src/components/sections/contact/` |
| 8 | PortfolioFilter.tsx, index.tsx | `src/components/sections/portfolio/` |
| 9 | CookieActions.tsx, TestimonialNav.tsx | `src/components/banners/`, `src/components/sections/testimonials/` |
| 10 | NotFoundCase.tsx | `src/pages/` |

Total: ~18 new files, 0 deleted (old files become subfolder index.tsx or are simplified in place).

---

## Result

After all phases:

| Metric | Before | After |
|--------|-------:|------:|
| Components over 100 lines (excl. legal) | 3 (Hero, Carousel, ContactForm) | 0 |
| Components 60–100 lines | 8 | 2–3 |
| Components under 60 lines | 34 | 47+ |
| Avg. component size | ~54 lines | ~35 lines |
| Max component size (non-legal) | 117 (PortfolioCasePage) | ~55 |

Every non-legal component fits on one screen. Each has a single, clear responsibility. Subfolder pattern (`hero/index.tsx` + sub-components) keeps the file tree navigable without deep nesting.
