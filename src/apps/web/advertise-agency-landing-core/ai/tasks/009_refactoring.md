# PDR-009: Code Review & Refactoring Plan

**Status:** In progress — R1 ✅ done, R2 ✅ done, R3 ✅ done (no-op), R4 ✅ done, R5 ✅ done, R6 ✅ done, R7 ✅ done, R8 ✅ done, R9 ✅ done, R10 ✅ done, R12 ✅ done, R13 ✅ done, R14 ✅ done, R15 ✅ done, R16 ✅ done, R17 ✅ done, R18 ✅ done, R19 ✅ done, R20 ✅ done, R21 ✅ done, R22 ✅ done, R23 ✅ done, R24 ✅ done, R25 ✅ done (no-op), R26 ✅ done, R27 ✅ done
**Date:** 2026-03-13
**Scope:** Full codebase review — component decomposition, code simplification, style consistency

---

## Executive Summary

The codebase is well-structured overall. Components are already decomposed into reasonable subcomponents, type modules follow a consistent pattern, and semantic tokens are used correctly. The issues found (28 items) are primarily:
- **Duplicated patterns** across components (swipe handling, fade-in wrapper, nav dots/arrows, CtaLinkSchema x8)
- **Bug:** consent event never dispatched — MetrikaScript won't react to consent changes
- **Dark mode violation** in BackButton (`bg-white/90`)
- **Several components with duplicated internal JSX** that can be collapsed
- **Minor style inconsistencies** (cn() usage, interface naming, import extensions)
- **Dead/unused code** and parameters

---

## R1. Duplicated touch swipe logic (3 locations) ✅ done

**Files:**
- `src/components/sections/carousel/index.tsx:36-52` — touchStart/touchEnd with 50px threshold
- `src/components/ui/imageGallery/index.tsx:56-69` — same pattern, 50px threshold
- `src/components/ui/imageGallery/ImageGalleryLightbox.tsx:78-89` — same pattern, 50px threshold

**Problem:** Identical swipe detection logic repeated 3 times — `touchStartX` ref, `onTouchStart` capturing clientX, `onTouchEnd` comparing delta against a threshold.

**Fix:** Extract a `useSwipe(onLeft, onRight, threshold?)` hook into `src/hooks/useSwipe.ts`. Returns `{ onTouchStart, onTouchEnd }` handlers. All three call sites become one-liners:

```tsx
const swipe = useSwipe(next, prev);
// ...
<div {...swipe}>
```

**Impact:** ~45 lines removed across 3 files.

---

## R2. CaseHero — duplicated JSX for image vs gradient variant ✅ done

**File:** `src/components/portfolio/CaseHero.tsx:14-55`

**Problem:** The component has two nearly identical return blocks (image hero and gradient hero). The inner content (Badge + h1 + p inside Container + centered div) is 100% identical between branches — only the outer `<section>` wrapper differs.

**Fix:** Extract the shared inner content into a local `CaseHeroContent` sub-component or simply restructure as:

```tsx
export function CaseHero({ hero, category, title, description }: CaseHeroProps) {
  const content = (
    <Container className={hero.image ? 'relative z-10' : undefined}>
      <div className="mx-auto max-w-3xl text-center">
        <Badge className="mb-6 border-0 bg-white/20 text-white backdrop-blur-sm">{category}</Badge>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h1>
        <p className="text-base text-white/80 md:text-lg">{description}</p>
      </div>
    </Container>
  );

  if (hero.image) {
    return (
      <section className="relative bg-neutral-900 py-24">
        <OptimizedImage ... />
        <div className="absolute inset-0 bg-neutral-900/60" />
        {content}
      </section>
    );
  }

  return (
    <section className={cn('bg-gradient-to-br py-24 text-white', hero.gradient)}>
      {content}
    </section>
  );
}
```

**Impact:** Removes ~10 lines of duplicated JSX.

---

## R3. Consent checkbox pattern duplicated (2 locations) ✅ done (no-op)

**Files:**
- `src/components/sections/contact/ContactConsent.tsx`
- `src/components/ui/orderForm/OrderFormConsent.tsx`

**Problem:** Both render nearly identical markup: checkbox + label with legal links rendered from an array. The structure is the same — only the data source and link rendering differ slightly (`Link` vs `Link`, one uses `joiner`, the other uses `consentJoiner`).

**Fix:** These are different enough in data shape that merging them would add complexity. **No action needed** — keeping them separate is the right tradeoff for a white-label kit where contact form and order form may diverge.

**Verdict:** Keep as-is. This is acceptable divergence.

---

## R4. Hardcoded Russian strings in non-data components ✅ done

**Files:**
- `src/components/ui/imageGallery/ImageGalleryLightbox.tsx:68` — `aria-label="Закрыть"`
- `src/components/sections/carousel/CarouselControls.tsx:25-26` — `"Предыдущий слайд"`, `"Следующий слайд"`
- `src/components/sections/header/HeaderMobileNav.tsx:40` — `'Close menu'` / `'Open menu'` (English, inconsistent with rest)
- `src/pages/PortfolioCategoryPage.tsx:35-38` — `"Категория не найдена."`, `"Все проекты"`
- `src/pages/PortfolioCasePage.tsx:44` — `'Главная'`
- `src/pages/PortfolioCategoryPage.tsx:52` — `'Главная'`
- `src/pages/PortfolioPage.tsx:21` — `'Главная'`
- `src/pages/OrderPage.tsx:25` — `'Главная'`
- `src/pages/PortfolioCategoryPage.tsx:25-26` — `"РА «Рекламастер»"` hardcoded in `document.title`
- `src/pages/PortfolioPage.tsx:16` — same
- `src/pages/OrderPage.tsx:20` — same

**Problem:** A white-label kit should not have client-specific strings hardcoded in components. Breadcrumb labels, error messages, and `document.title` suffixes should come from data files.

**Fix:**
1. Add `homeLabel` and `siteTitleSuffix` to `data/config/site.json` / `siteData`
2. Add `notFoundCategory` and `allProjectsLink` to `data/config/portfolio.json` / `portfolioConfig`
3. Add `closeLabel` to `data/sections/carouselContent.json` (or `imageGallery.json`)
4. Replace all hardcoded strings with data references
5. Fix English aria-labels in `HeaderMobileNav` → use Russian or add to data

**Impact:** Completes the white-label promise. ~15 small string replacements across 6-7 files.

---

## R5. `SectionDivider` variant naming uses "white" — misleading in dark mode ✅ done

**File:** `src/components/ui/SectionDivider.tsx`

**Problem:** Variant names like `white-to-muted`, `primary-to-white` reference "white" but actually resolve to `hsl(var(--background))` which adapts in dark mode. The naming is misleading for future maintainers.

**Fix:** Rename variants to use semantic names: `bg-to-muted`, `primary-to-bg`, `muted-to-bg`, etc. Update the 10 usages in `Home.tsx`.

**Impact:** Purely cosmetic/readability. Low priority.

---

## R6. `ScrollToTop` — unused `className` prop ✅ done

**File:** `src/components/ui/ScrollToTop.tsx:11`

**Problem:** `className` is declared in `ScrollToTopProps` but never used in the component body.

**Fix:** Remove the `className` prop from the interface.

**Impact:** 1 line.

---

## R7. `DarkModeToggle` — Button used without `variant`, overrides all styles ✅ done

**File:** `src/components/sections/header/DarkModeToggle.tsx`

**Problem:** Uses `<Button>` but passes a massive `className` that completely overrides Button's default styles. The Button component adds `bg-primary text-primary-foreground` by default — these are then overridden by the explicit `bg-muted text-muted-foreground`.

**Fix:** Either:
- Use `variant="ghost"` and keep only the extra classes, or
- Replace `<Button>` with a plain `<button>` since none of Button's styles or variants are actually used

**Impact:** Cleaner intent; 2-3 lines changed.

---

## R8. Inconsistent interface naming — `Props` vs descriptive names ✅ done

**Files with generic `Props`:**
- `src/components/sections/carousel/CarouselControls.tsx:4` — `interface Props`
- `src/components/sections/carousel/CarouselSlide.tsx:7` — `interface Props`
- `src/components/sections/call-to-action/CtaButtons.tsx:10` — `interface Props`
- `src/components/sections/advantages/AdvantageCard.tsx:8` — `interface Props`
- `src/components/sections/header/HeaderDesktopNav.tsx:7` — `interface Props`
- `src/components/sections/header/HeaderMobileNav.tsx:9` — `interface Props`
- `src/components/sections/header/HeaderNav.tsx:3` — `interface Props`
- `src/components/sections/header/DarkModeToggle.tsx:5` — `interface Props`
- `src/components/sections/services/ServiceCard.tsx:6` — `interface Props`

**Files with descriptive names:**
- `src/components/portfolio/CaseHero.tsx:7` — `interface CaseHeroProps`
- `src/components/ui/SocialLinks.tsx:30` — `interface SocialLinksProps`
- `src/components/portfolio/PortfolioGrid.tsx:11` — `interface PortfolioGridProps`
- All contact subcomponents use descriptive names

**Problem:** ~9 components use bare `Props`; ~20+ use descriptive `{ComponentName}Props`. Inconsistent.

**Fix:** Rename all `interface Props` to `interface {ComponentName}Props` for consistency and grep-ability.

**Impact:** ~9 files, 2 lines each. No logic changes.

---

## R9. `import.meta.env.DEV` passed as prop to OptimizedImage everywhere ✅ done

**Files:** Every OptimizedImage usage passes `dev={import.meta.env.DEV}`:
- `CarouselSlide.tsx:29`, `CaseHero.tsx:24`, `ImageGalleryLightbox.tsx:97,133`, `PortfolioThumbnail.tsx:35`

**Problem:** `import.meta.env.DEV` is a global constant available everywhere. Passing it as a prop adds noise to every call site.

**Fix:** Read `import.meta.env.DEV` directly inside `OptimizedImage` instead of accepting it as a prop. Remove the `dev` prop from `OptimizedImageProps` and all call sites.

**Impact:** Removes `dev={import.meta.env.DEV}` from ~5 call sites. Simpler API.

---

## R10. `BlockRenderer` — IIFE for switch can be simplified ✅ done

**File:** `src/components/portfolio/blocks/BlockRenderer.tsx:29-68`

**Problem:** Uses an immediately-invoked function expression `const rendered = (() => { switch ... })()` to assign a variable, then checks `if (rendered === null)` below. This pattern is unusual and adds nesting.

**Fix:** Convert to a standalone `renderBlock()` function:

```tsx
function renderBlock(block: ContentBlock, caseGradient: string, caseTitle: string): React.ReactNode {
  switch (block.__component) {
    case 'heading': return <HeadingBlock block={block} />;
    // ...
    default: return null;
  }
}

export function BlockRenderer({ block, caseGradient, caseTitle }: BlockRendererProps) {
  const rendered = renderBlock(block, caseGradient, caseTitle);
  if (!rendered) return null;
  const spacing = SPARSE_BLOCKS.has(block.__component) ? 'py-4' : 'py-8';
  return <div className={spacing}>{rendered}</div>;
}
```

**Impact:** Cleaner code, easier to test the switch in isolation.

---

## R11. `ChartBlock` — large file (283 lines), 5 chart types in one module ✅ done

**File:** `src/components/portfolio/blocks/ChartBlock.tsx`

**Problem:** 283 lines with 5 private chart components (`BarChart`, `HorizontalBarChart`, `ProgressChart`, `LineChart`, `PieChart`) plus helpers. While each chart is ~30-40 lines, the file is one of the longest in the project.

**Fix:** The file is already well-organized with clear section comments. Each sub-chart is small. Splitting into 5 files would add folder overhead for little gain.

**Verdict:** Keep as-is. The internal decomposition (5 named functions + 1 dispatcher) is already good. If any chart grows significantly, split then.

---

## R12. `PortfolioCategoryPage` and `PortfolioPage` — near-duplicates ✅ done

**Files:**
- `src/pages/PortfolioPage.tsx` (36 lines)
- `src/pages/PortfolioCategoryPage.tsx` (70 lines)

**Problem:** `PortfolioPage` is essentially `PortfolioCategoryPage` where `categorySlug = 'all'` with no "not found" handling. The structure (BreadCrumbs → section → Container → SectionHeader → PortfolioGrid) is identical.

**Fix:** Merge into one component. `PortfolioPage` can simply render `<PortfolioCategoryPage />` with a pre-set slug, or the route can point to the same component (the category page already handles `isAll`).

However: SSG generates separate routes for `/portfolio` and `/portfolio/:categorySlug`. Merging would require route restructuring.

**Verdict:** Low priority. The duplication is small (36 lines) and the two pages serve distinct routes. Can merge if desired but the cost/benefit is marginal.

---

## R13. `document.title` set imperatively in `useEffect` ✅ done

**Files:**
- `src/pages/PortfolioPage.tsx:15-17`
- `src/pages/PortfolioCategoryPage.tsx:23-29`
- `src/pages/OrderPage.tsx:19-21`

**Problem:** Three pages set `document.title` via `useEffect`. This is imperative and fragile — if the component unmounts, the title stays. More importantly, for SSG the title is set by `ssgMetaPlugin`, so this only affects client-side navigation.

**Fix:** Consider using a tiny `useDocumentTitle(title)` hook to centralize and ensure cleanup:

```ts
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

**Impact:** 3 files simplified, consistent pattern.

---

## R14. `import` with `.tsx` extension ✅ done

**File:** `src/App.tsx:9` — `import { ScrollToTop } from '@/components/ui/ScrollToTop.tsx'`
**File:** `src/components/sections/header/DarkModeToggle.tsx:3` — `import { Button } from '@/components/ui/button.tsx'`

**Problem:** Only 2 imports in the entire project use the `.tsx` extension. All other imports omit extensions (as is conventional).

**Fix:** Remove `.tsx` from both import paths.

**Impact:** 2 lines. Consistency.

---

## R15. `useScrolled` hook exists but is unused ✅ done

**File:** `src/hooks/useScrolled.ts` (14 lines)

**Problem:** Per MEMORY.md: "useScrolled hook no longer used in Header". If nothing else uses it, it's dead code.

**Fix:** Grep for usage. If unused, delete the file.

**Impact:** 1 file deleted.

---

## R16. `TestimonialNav` and `TestimonialStrip` import data directly ✅ done

**Files:**
- `src/components/sections/testimonials/TestimonialNav.tsx:2` — imports `testimonials` just for `.length`
- `src/components/ui/TestimonialStrip.tsx:3` — imports `testimonials` for iteration

**Problem:** These components import the data const directly rather than receiving it via props. This breaks the white-label pattern where components should be data-agnostic.

**Fix:** Pass `testimonials` (or at least the count/items) as props from the parent. The parent (`Testimonials/index.tsx`) already has access to data.

**Impact:** Minor refactor, 2-3 files.

---

## R17. `HeroCTA` — array indexing without safety ✅ done

**File:** `src/components/sections/hero/HeroCTA.tsx:12-25`

**Problem:** Accesses `cta[0]` and `cta[1]` directly without checking array length. If the data has only one CTA, this crashes.

**Fix:** Add a guard or map over the array:

```tsx
export function HeroCTA({ cta }: HeroCTAProps) {
  const [primary, secondary] = cta;
  return (
    <div className="flex ...">
      {primary && <Button ...>{primary.label}<ArrowRight /></Button>}
      {secondary && <Button variant="outline" ...>{secondary.label}</Button>}
    </div>
  );
}
```

**Impact:** 2 lines added, prevents potential crash.

---

## R18. `CtaButtons` — typed as tuple `[CtaLink, CtaLink]` with local interface ✅ done

**File:** `src/components/sections/call-to-action/CtaButtons.tsx:6-8`

**Problem:** Defines a local `CtaLink` interface that's identical to the one used elsewhere. Also, the parent `CallToAction` passes `[callToAction.cta[0], callToAction.cta[1]]` — manually indexing into the array to create a tuple.

**Fix:** Accept `cta: { label: string; href: string }[]` and iterate, or import the type from the data module.

**Impact:** Minor cleanup, 3-5 lines.

---

## R19. `useCookieConsent` — CONSENT_EVENT never dispatched ✅ done

**File:** `src/hooks/useCookieConsent.ts:12-13`

**Problem:** The hook listens for a `'cookie_consent_change'` CustomEvent, but `CookieBanner.tsx` never dispatches it — it only calls `localStorage.setItem` and `setDismissed`. The event listener is dead code.

**Fix:** Either:
1. Remove the event listener from `useCookieConsent` (the hook reads from localStorage on init, which is sufficient), or
2. Add `dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))` in `CookieBanner.save()`

Option 2 is needed if MetrikaScript should react to consent changes without page reload.

**Impact:** Bug fix — currently MetrikaScript won't pick up consent changes until page reload.

---

## R20. `STORAGE_KEY` duplicated between CookieBanner and useCookieConsent ✅ done

**Files:**
- `src/components/banners/CookieBanner.tsx:9` — `const STORAGE_KEY = 'cookie_consent'`
- `src/hooks/useCookieConsent.ts:11` — `const STORAGE_KEY = 'cookie_consent'`

**Problem:** Same localStorage key defined in two files. If one changes, the other silently breaks.

**Fix:** Export `STORAGE_KEY` from `useCookieConsent.ts` and import it in `CookieBanner.tsx`. Or define in a shared `src/lib/consent.ts`.

**Impact:** 3 lines changed. Prevents desync bugs.

---

## R21. `CtaLinkSchema` duplicated 8 times across type modules ✅ done

**Files (each defines identical `z.object({ label: z.string(), href: z.string() })`):**
- `src/types/sections/header.ts:4`
- `src/types/sections/hero.ts:4`
- `src/types/sections/callToAction.ts:4`
- `src/types/sections/contact.ts:4`
- `src/types/sections/footer.ts:4`
- `src/types/config/cookies.ts:4`
- `src/types/config/portfolioConfig.ts:4`
- `src/types/portfolio/index.ts:7`

**Problem:** The same 3-line Zod schema is copy-pasted 8 times. Three files also re-export `type CtaLink` independently.

**Fix:** Create `src/types/shared/ctaLink.ts`:
```ts
import { z } from 'zod/v4';
export const CtaLinkSchema = z.object({ label: z.string(), href: z.string() });
export type CtaLink = z.infer<typeof CtaLinkSchema>;
```
Import in all 8 modules. Remove local definitions and re-exports.

**Impact:** Removes ~24 lines of duplication. Single source of truth.

---

## R22. `FormState` type duplicated in ContactForm and ContactFormFields ✅ done

**Files:**
- `src/components/sections/contact/ContactForm.tsx:9`
- `src/components/sections/contact/ContactFormFields.tsx:6`

**Problem:** Both files define `type FormState = { name: string; contact: string; message: string }` independently.

**Fix:** Define once in `ContactForm.tsx` (the parent) and export it, or extract to a shared file. Since `ContactFormFields` is a child, importing from parent is simplest.

**Impact:** 1 line removed, 1 import added.

---

## R23. Fade-in section wrapper pattern repeated 6 times ✅ done

**Pattern repeated in:** About, Advantages, Services, Portfolio, Contact, Testimonials — all use:
```tsx
const { ref, isVisible } = useFadeIn();
// ...
<section ref={ref}>
  <div className={cn('fade-in-section', isVisible && 'is-visible')}>
    ...
  </div>
</section>
```

**Problem:** 3 lines of boilerplate + the `cn()` wrapper repeated in every section.

**Fix:** Extract a `<FadeInSection>` wrapper component:
```tsx
export function FadeInSection({ id, className, children }: FadeInSectionProps) {
  const { ref, isVisible } = useFadeIn();
  return (
    <section ref={ref} id={id} className={className}>
      <div className={cn('fade-in-section', isVisible && 'is-visible')}>
        {children}
      </div>
    </section>
  );
}
```

**Impact:** ~12 lines removed across 6 files. Simpler section templates.

---

## R24. `BackButton` uses hardcoded `bg-white/90` — breaks dark mode ✅ done

**File:** `src/components/ui/BackButton.tsx:18`

**Problem:** `bg-white/90` violates the "never `bg-white`" rule. In dark mode the button will be a white blob on a dark background.

**Fix:** Replace with `bg-background/90` or `bg-card/90`.

**Impact:** 1 class change.

---

## R25. Duplicated nav dots + arrow buttons across Carousel and Testimonials ✅ done (no-op)

**Files:**
- `src/components/sections/carousel/CarouselControls.tsx:39-51` — dot indicators
- `src/components/sections/testimonials/TestimonialNav.tsx:16-26` — nearly identical dot indicators
- `src/components/sections/carousel/CarouselControls.tsx:23-35` — prev/next arrow buttons
- `src/components/sections/testimonials/TestimonialNav.tsx:29-42` — nearly identical prev/next buttons

**Problem:** Two components render the same dot indicator + arrow button UI with minor class differences.

**Fix:** Extract `<DotIndicators>` and/or `<ArrowNavButtons>` shared components into `src/components/ui/`.

**Verdict:** `TestimonialNav.tsx` no longer exists — it was removed when testimonials was refactored to use the Yandex Reviews widget (R16). No duplication remains. The other arrow button consumers (`ImageGalleryNavButtons.tsx`, `ImageGalleryLightbox.tsx`) already have distinct styling and context. No extraction needed.

---

## R26. `HeroStats` (105 lines) — `CountingStat` should be extracted ✅ done

**File:** `src/components/sections/hero/HeroStats.tsx`

**Problem:** 105 lines — one of the largest section subcomponents. Contains an embedded `CountingStat` component (lines 13-53) with its own state, effects, and animation logic.

**Fix:** Extract `CountingStat` to `src/components/sections/hero/CountingStat.tsx`. Consider also extracting the counting animation to a `useCountUp(target, animate, duration?)` hook.

**Impact:** HeroStats drops to ~30 lines. Animation logic becomes reusable.

---

## R27. `ALL_ITEMS` duplicated across portfolio pages ✅ done

**Files:**
- `src/pages/PortfolioPage.tsx:10` — `const ALL_ITEMS = Object.values(portfolioCaseMap)`
- `src/pages/PortfolioCategoryPage.tsx:13` — identical line

**Problem:** Same derived constant computed in two separate files.

**Fix:** Export `ALL_ITEMS` from `src/types/portfolio/portfolioCases.ts` (where `portfolioCaseMap` is already defined) or create a shared constant.

**Impact:** 1 line removed, 1 import changed per file.

---

## R28. Redundant `import './index.css'` in App.tsx ✅ done

**File:** `src/App.tsx:1` — `import './index.css'`
**Also in:** `src/main.tsx:6` — `import './index.css'`

**Problem:** CSS is imported in both `main.tsx` and `App.tsx`. Only one is needed (typically `main.tsx` since it's the entry point).

**Fix:** Remove the import from `App.tsx`.

**Impact:** 1 line removed.

---

## Priority Matrix

| ID  | Category          | Impact | Effort | Priority |
|-----|-------------------|--------|--------|----------|
| R19 | Bug fix (consent) | High   | Small  | **P1**   |
| R21 | DRY / Schema      | High   | Small  | **P1**   |
| R1  | DRY / Extract hook| High   | Small  | **P1**   |
| R4  | White-label       | High   | Medium | **P1**   |
| R23 | DRY / Wrapper     | Medium | Small  | **P1**   |
| R24 | Dark mode bug     | Medium | Tiny   | **P1**   |
| R9  | API simplification| Medium | Small  | **P1**   |
| R20 | DRY / Constant    | Medium | Tiny   | **P1**   |
| R14 | Consistency       | Low    | Tiny   | **P1**   |
| R15 | Dead code         | Low    | Tiny   | **P1**   |
| R28 | Dead import       | Low    | Tiny   | **P1**   |
| R2  | DRY / Component   | Medium | Small  | **P2**   |
| R22 | DRY / Type        | Low    | Tiny   | **P2**   |
| R26 | Decomposition     | Medium | Small  | **P2**   |
| R25 | DRY / UI          | Medium | Small  | **P2**   |
| R27 | DRY / Constant    | Low    | Tiny   | **P2**   |
| R8  | Consistency       | Low    | Small  | **P2**   |
| R10 | Code clarity      | Medium | Small  | **P2**   |
| R13 | DRY / Hook        | Low    | Small  | **P2**   |
| R17 | Safety            | Medium | Tiny   | **P2**   |
| R6  | Dead code         | Low    | Tiny   | **P2**   |
| R7  | Semantic HTML     | Low    | Tiny   | **P2**   |
| R16 | White-label       | Medium | Small  | **P3**   |
| R18 | Cleanup           | Low    | Tiny   | **P3**   |
| R5  | Naming            | Low    | Medium | **P3**   |
| R12 | DRY / Pages       | Low    | Medium | **P3**   |

---

## Positive observations (things NOT to change)

1. **Component decomposition is already good** — sections are split into 2-4 subcomponents each. No monolithic 500+ line components.
2. **Consistent Tailwind usage** — semantic tokens (`bg-background`, `bg-card`, `text-foreground`) used everywhere. No raw `bg-white` in sections.
3. **Type modules follow a strict pattern** — Zod schema → inferred type → parsed const. Consistent across all 30+ modules.
4. **cn() usage is appropriate** — used for conditional classes and className merging, not overused for static strings.
5. **Dark mode** is correctly implemented via CSS vars + `.dark` class.
6. **SectionHeader, SectionBadge, SectionIconBox** reuse is excellent — all sections use the same header pattern.
7. **Portfolio blocks** are well-decomposed — one component per block type, clean dispatcher.
8. **Footer** decomposition into 5 sub-components is clean and maintainable.
9. **Contact** section decomposition (8 subcomponents) is thorough.
10. **Data/component separation** is well-maintained — components import from `@/types/`, never from `@data/`.
