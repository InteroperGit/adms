# Plan: Unit Tests — Part 3: Section Components

**Status**: in-progress (Task 15 ✅ 2026-03-21)
**Date**: 2026-03-15
**Series**: 3 of 4 (`20260315_unitTests_part1.md` → `_part2.md` → `_part3.md` → `_part4.md`)
**Prerequisite**: Part 1 Task 0 (test infrastructure) must be completed first. Part 2 is recommended but not strictly required.

## Goal

Add unit tests for page section components: header, hero, about, services, advantages, carousel, call-to-action, testimonials, and contact.

**Convention:** one test file per component, co-located next to the source file (`ComponentName.test.tsx`).

---

## Task 15: Header Section — `src/components/sections/header/` ✅ 2026-03-21

**Model**: Claude Haiku 4.5

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `Header.test.tsx` | `Header` | renders logo, desktop nav, mobile hamburger, `ScrollProgress` bar present |
| `HeaderDesktopNav.test.tsx` | `HeaderDesktopNav` | renders nav links, renders dark mode toggle, renders social links |
| `HeaderMobileNav.test.tsx` | `HeaderMobileNav` | hamburger opens menu, renders nav links in drawer, closes on link click |
| `HeaderNav.test.tsx` | `HeaderNav` | renders all nav items, active link has active class |
| `DarkModeToggle.test.tsx` | `DarkModeToggle` | renders Sun/Moon icon, clicking calls toggle |

**Mocking notes:**
- Mock `useTheme`, `useActiveSection`, `useInViewport`
- Wrap in `MemoryRouter`

**Validation:** `pnpm test src/components/sections/header`

---

## Task 16: Hero Section — `src/components/sections/hero/` ✅ 2026-03-21

**Model**: Claude Haiku 4.5

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `Hero.test.tsx` | `Hero` | renders badge, title, subtitle, CTA buttons, stats section |
| `HeroCTA.test.tsx` | `HeroCTA` | renders primary and secondary buttons with correct labels and hrefs |
| `HeroStats.test.tsx` | `HeroStats` | renders stat items from data |
| `CountingStat.test.tsx` | `CountingStat` | renders icon, label, animated number (mock timers) |

**Validation:** `pnpm test src/components/sections/hero`

---

## Task 17: About Section — `src/components/sections/about/` ✅ 2026-03-21

**Model**: Claude Haiku 4.5

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `About.test.tsx` | `About` | renders section header, about text, values, about card |
| `AboutText.test.tsx` | `AboutText` | renders paragraphs from content data |
| `AboutValues.test.tsx` | `AboutValues` | renders list of values with icons |
| `AboutCard.test.tsx` | `AboutCard` | renders logo, tagline, stat items, has pulse animation class |

**Validation:** `pnpm test src/components/sections/about`

---

## Task 18: Services & Advantages Sections ✅ 2026-03-21

**Model**: Claude Haiku 4.5

**Test files:** one per component, co-located in their respective subfolders

| Test file | Component | Tests |
|-----------|-----------|-------|
| `src/components/sections/services/Services.test.tsx` | `Services` | renders section header, renders service cards grid |
| `src/components/sections/services/ServiceCard.test.tsx` | `ServiceCard` | renders icon, title, description inside `ItemCard`, has `icon-shake` class |
| `src/components/sections/advantages/Advantages.test.tsx` | `Advantages` | renders section header, renders advantage cards grid |
| `src/components/sections/advantages/AdvantageCard.test.tsx` | `AdvantageCard` | renders icon, index number (padded), title, description inside `ItemCard` |

**Validation:** `pnpm test src/components/sections/services src/components/sections/advantages`

---

## Task 19: Carousel Section — `src/components/sections/carousel/`

**Model**: Claude Sonnet 4.6

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `Carousel.test.tsx` | `Carousel` | renders slides, auto-advances (mock timers), pauses on hover |
| `CarouselSlide.test.tsx` | `CarouselSlide` | renders image or gradient background, renders text content |
| `CarouselControls.test.tsx` | `CarouselControls` | prev/next buttons call handlers, renders dot indicators, renders slide counter |

**Validation:** `pnpm test src/components/sections/carousel`

---

## Task 20: Call-to-Action & Testimonials Sections

**Model**: Claude Haiku 4.5

**Test files:** one per component, co-located in their respective subfolders

| Test file | Component | Tests |
|-----------|-----------|-------|
| `src/components/sections/call-to-action/CallToAction.test.tsx` | `CallToAction` | renders title, subtitle, CTA buttons |
| `src/components/sections/call-to-action/CtaButtons.test.tsx` | `CtaButtons` | renders primary and secondary buttons, buttons have correct hrefs |
| `src/components/sections/testimonials/Testimonials.test.tsx` | `Testimonials` | renders section header, renders Yandex reviews or empty state |

**Validation:** `pnpm test src/components/sections/call-to-action src/components/sections/testimonials`

---

## Task 21: Contact Section — `src/components/sections/contact/`

**Model**: Claude Sonnet 4.6

**Test files:** one per component

| Test file | Component | Tests |
|-----------|-----------|-------|
| `Contact.test.tsx` | `Contact` | renders section header, renders form and info columns |
| `ContactForm.test.tsx` | `ContactForm` | renders fields, validates required fields, shows success on submit |
| `ContactFormFields.test.tsx` | `ContactFormFields` | renders name, contact, message inputs |
| `ContactConsent.test.tsx` | `ContactConsent` | renders checkbox, renders legal links |
| `ContactSuccess.test.tsx` | `ContactSuccess` | renders success icon, title, description, reset button |
| `ContactInfo.test.tsx` | `ContactInfo` | renders phone, email, address with icons |
| `ContactHours.test.tsx` | `ContactHours` | renders weekday, Saturday, Sunday hours |
| `ContactMap.test.tsx` | `ContactMap` | renders iframe in dark mode with border, renders with shadow in light mode |

**Validation:** `pnpm test src/components/sections/contact`

---

## Summary — Part 3

| Task | Test Files | Scope | Est. Tests |
|------|-----------|-------|------------|
| 15 | 5 files in `src/components/sections/header/` | 5 header components | ~15 |
| 16 | 4 files in `src/components/sections/hero/` | 4 hero components | ~12 |
| 17 | 4 files in `src/components/sections/about/` | 4 about components | ~12 |
| 18 | 4 files in `sections/services/` + `sections/advantages/` | 4 service/advantage components | ~12 |
| 19 | 3 files in `src/components/sections/carousel/` | 3 carousel components | ~10 |
| 20 | 3 files in `sections/call-to-action/` + `sections/testimonials/` | 3 CTA/testimonial components | ~8 |
| 21 | 8 files in `src/components/sections/contact/` | 8 contact components | ~20 |
| **Subtotal** | **~31 test files** | | **~89 tests** |

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
3. **Implement** one test file per component, co-located next to the source file
4. **Run:** `pnpm test <path>` to validate
5. **Commit:** `git add <test-files> && git commit -m "test(taskN): add tests for <area>"`

To do **all Part 3 tasks in one session**, work through them in order (15 → 16 → ... → 21), committing after each task passes. Then proceed to Part 4.
