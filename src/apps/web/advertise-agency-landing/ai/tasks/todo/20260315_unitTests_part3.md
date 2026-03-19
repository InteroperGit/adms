# Plan: Unit Tests — Part 3: Section Components

**Status**: pending (blocked by Part 1 Task 0)
**Date**: 2026-03-15
**Series**: 3 of 4 (`20260315_unitTests_part1.md` → `_part2.md` → `_part3.md` → `_part4.md`)
**Prerequisite**: Part 1 Task 0 (test infrastructure) must be completed first. Part 2 is recommended but not strictly required.

## Goal

Add unit tests for page section components: header, hero, about, services, advantages, carousel, call-to-action, testimonials, and contact.

---

## Task 15: Header Section — `src/components/sections/header/`

**Model**: Claude Haiku 4.5

**Test file:** `src/components/sections/header/header.test.tsx`

| Component | Tests |
|-----------|-------|
| `Header` | renders logo, desktop nav, mobile hamburger, `ScrollProgress` bar present |
| `HeaderDesktopNav` | renders nav links, renders dark mode toggle, renders social links |
| `HeaderMobileNav` | hamburger opens menu, renders nav links in drawer, closes on link click |
| `HeaderNav` | renders all nav items, active link has active class |
| `DarkModeToggle` | renders Sun/Moon icon, clicking calls toggle |

**Mocking notes:**
- Mock `useTheme`, `useActiveSection`, `useInViewport`
- Wrap in `MemoryRouter`

**Validation:** `pnpm test src/components/sections/header`

---

## Task 16: Hero Section — `src/components/sections/hero/`

**Model**: Claude Haiku 4.5

**Test file:** `src/components/sections/hero/hero.test.tsx`

| Component | Tests |
|-----------|-------|
| `Hero` | renders badge, title, subtitle, CTA buttons, stats section |
| `HeroCTA` | renders primary and secondary buttons with correct labels and hrefs |
| `HeroStats` | renders stat items from data |
| `CountingStat` | renders icon, label, animated number (mock timers) |

**Validation:** `pnpm test src/components/sections/hero`

---

## Task 17: About Section — `src/components/sections/about/`

**Model**: Claude Haiku 4.5

**Test file:** `src/components/sections/about/about.test.tsx`

| Component | Tests |
|-----------|-------|
| `About` | renders section header, about text, values, about card |
| `AboutText` | renders paragraphs from content data |
| `AboutValues` | renders list of values with icons |
| `AboutCard` | renders logo, tagline, stat items, has pulse animation class |

**Validation:** `pnpm test src/components/sections/about`

---

## Task 18: Services & Advantages Sections

**Model**: Claude Haiku 4.5

**Test file:** `src/components/sections/services-advantages.test.tsx`

| Component | Tests |
|-----------|-------|
| `Services` | renders section header, renders service cards grid |
| `ServiceCard` | renders icon, title, description inside `ItemCard`, has `icon-shake` class |
| `Advantages` | renders section header, renders advantage cards grid |
| `AdvantageCard` | renders icon, index number (padded), title, description inside `ItemCard` |

**Validation:** `pnpm test src/components/sections/services-advantages`

---

## Task 19: Carousel Section — `src/components/sections/carousel/`

**Model**: Claude Sonnet 4.6

**Test file:** `src/components/sections/carousel/carousel.test.tsx`

| Component | Tests |
|-----------|-------|
| `Carousel` | renders slides, auto-advances (mock timers), pauses on hover |
| `CarouselSlide` | renders image or gradient background, renders text content |
| `CarouselControls` | prev/next buttons call handlers, renders dot indicators, renders slide counter |

**Validation:** `pnpm test src/components/sections/carousel`

---

## Task 20: Call-to-Action & Testimonials Sections

**Model**: Claude Haiku 4.5

**Test file:** `src/components/sections/cta-testimonials.test.tsx`

| Component | Tests |
|-----------|-------|
| `CallToAction` | renders title, subtitle, CTA buttons |
| `CtaButtons` | renders primary and secondary buttons, buttons have correct hrefs |
| `Testimonials` | renders section header, renders Yandex reviews or empty state |

**Validation:** `pnpm test src/components/sections/cta-testimonials`

---

## Task 21: Contact Section — `src/components/sections/contact/`

**Model**: Claude Sonnet 4.6

**Test file:** `src/components/sections/contact/contact.test.tsx`

| Component | Tests |
|-----------|-------|
| `Contact` | renders section header, renders form and info columns |
| `ContactForm` | renders fields, validates required fields, shows success on submit |
| `ContactFormFields` | renders name, contact, message inputs |
| `ContactConsent` | renders checkbox, renders legal links |
| `ContactSuccess` | renders success icon, title, description, reset button |
| `ContactInfo` | renders phone, email, address with icons |
| `ContactHours` | renders weekday, Saturday, Sunday hours |
| `ContactMap` | renders iframe in dark mode with border, renders with shadow in light mode |

**Validation:** `pnpm test src/components/sections/contact`

---

## Summary — Part 3

| Task | Test File | Scope | Est. Tests |
|------|-----------|-------|------------|
| 15 | `src/components/sections/header/header.test.tsx` | 5 header components | ~15 |
| 16 | `src/components/sections/hero/hero.test.tsx` | 4 hero components | ~12 |
| 17 | `src/components/sections/about/about.test.tsx` | 4 about components | ~12 |
| 18 | `src/components/sections/services-advantages.test.tsx` | 4 service/advantage components | ~12 |
| 19 | `src/components/sections/carousel/carousel.test.tsx` | 3 carousel components | ~10 |
| 20 | `src/components/sections/cta-testimonials.test.tsx` | 3 CTA/testimonial components | ~8 |
| 21 | `src/components/sections/contact/contact.test.tsx` | 7 contact components | ~20 |
| **Subtotal** | **7 test files** | | **~89 tests** |

## Execution Order

All tasks in Part 3 are independent — they can be done in any order after Part 1 Task 0 is complete.

```
Part 1 Task 0 (setup) ← prerequisite
  ├── Task 15 (header) ← start here
  ├── Task 16 (hero)
  ├── Task 17 (about)
  ├── Task 18 (services/advantages)
  ├── Task 19 (carousel)
  ├── Task 20 (CTA/testimonials)
  └── Task 21 (contact)
```

## Session Strategy

Each task is designed to be completable in **one Claude session**:

1. **Start session** → Read this plan, identify which task to work on
2. **Run:** `pnpm test` to confirm existing tests pass
3. **Implement** the test file for the chosen task
4. **Run:** `pnpm test <path>` to validate
5. **Commit:** `git add <test-file> && git commit -m "test(taskN): add tests for <area>"`

To do **all Part 3 tasks in one session**, work through them in order (15 → 16 → ... → 21), committing after each task passes. Then proceed to Part 4.
