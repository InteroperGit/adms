# PDR: Code Refactoring & Improvements

**Status:** In Progress
**Date:** 2026-03-17
**Scope:** Full codebase review — DRY, type safety, semantic HTML, accessibility, theming, build utils

---

## Executive Summary

Follow-up codebase review after PDR-009 (March 13) and the components refactoring (March 17). The codebase is in good shape overall. This PDR identifies **18 items** across:

- **Duplicate build utilities** across 3 files (readJson, walkJsonFiles, extractYearMonth)
- **Inline `fontFamily` style** repeated in 4 components instead of a Tailwind utility
- **Semantic HTML bug** (`<ul>` used for ordered list)
- **Duplicate runtime patterns** (dark mode filter, phone formatting, color resolution, portfolio glob)
- **Missing dev warnings** for silent failures
- **String interpolation pattern** used in 8+ places without a shared utility
- **Minor consistency/accessibility issues**

---

## R1. Duplicate build-time utilities across 3 files ✅

**Status:** ✅ COMPLETED (2026-03-17, 23:35)

**Files:**
- `react-router.config.ts:26-51` — `readJson<T>()`, `walkJsonFiles()`, `extractYearMonth()`
- `src/plugins/seoMetaPlugin.ts:92-117` — identical `readJson<T>()`, `walkJsonFiles()`, `extractYearMonth()`
- `scripts/validate.ts` — own `walkJsonFiles()`

**Solution Applied:**
1. Created `scripts/buildUtils.ts` exporting all three functions: `readJson<T>()`, `walkJsonFiles()`, `extractYearMonth()`
2. Updated `react-router.config.ts` to import from buildUtils (removed 26 lines, cleaned unused imports)
3. Updated `src/plugins/seoMetaPlugin.ts` to import from buildUtils (removed 26 lines)
4. Updated `scripts/validate.ts` to import from buildUtils (removed 14 lines)
5. Fixed unused imports: removed `existsSync` from `react-router.config.ts`, cleaned `validate.ts` imports
6. Verified build passes: format ✓ | lint ✓ | typecheck ✓ | build ✓ (2626 modules, 13.12s total)

**Impact:** Removed ~66 lines of duplication, single source of truth for build logic. Build tested and passing.

---

## R2. Inline `fontFamily` style repeated in 4 components ✅

**Status:** ✅ COMPLETED (2026-03-17, 23:40)

**Files:**
- `src/components/sections/about/AboutCard.tsx:62-63`
- `src/components/sections/hero/CountingStat.tsx:41`
- `src/components/sections/carousel/CarouselSlide.tsx:57`
- `src/components/sections/advantages/AdvantageCard.tsx:29`

**Solution Applied:**
1. Added utility class to `src/index.css` at end of file:
   ```css
   @layer utilities {
     .font-heading {
       font-family: var(--font-heading), serif;
     }
   }
   ```
2. Updated `AboutCard.tsx` line 61: Replaced inline style with `className="font-heading font-bold text-foreground"`
3. Updated `CountingStat.tsx` line 50: Replaced inline style with `className="font-heading text-3xl font-bold text-foreground"`
4. Updated `CarouselSlide.tsx` line 56: Replaced inline style with `className="font-heading mb-4 text-3xl font-bold leading-tight md:text-5xl lg:text-6xl"`
5. Updated `AdvantageCard.tsx` line 29: Replaced inline style with `className="font-heading text-3xl font-bold text-foreground/25 dark:text-foreground/40"`
6. Verified all changes: format ✓ | lint ✓ | typecheck ✓ | build ✓ (2621 modules, 10s total)

**Impact:** Removed 4 inline style objects (~18 bytes each), cleaner code, enables responsive variants (`md:font-heading`). Utility class works on any element, not just headings.

---

## R3. `OrderedListBlock` uses `<ul>` instead of `<ol>` ✅

**Status:** ✅ COMPLETED (2026-03-17, 23:44)

**File:** `src/components/blocks/ListBlock/OrderedListBlock.tsx`

**Problem:**
Line 20 had `<ul>` for an ordered list component. Screen readers would announce "bullet list" instead of "numbered list", and semantic structure was wrong.

**Solution Applied:**
- Changed `<ul>` → `<ol>` on line 20
- Changed closing `</ul>` → `</ol>` on line 47
- JSDoc already correctly documented as "ol element with numbered items" (line 14)

**Verification:** All checks passed — format ✓ | lint ✓ | typecheck ✓ | build ✓ (2621 modules, 11.24s total)

**Impact:** Fixed semantic HTML bug. Screen readers now correctly announce "numbered list" per WCAG standards. Proper `<ol>` element structure for ordered content.

--- 

## R4. Duplicate dark mode invert filter string ✅

**Status:** ✅ COMPLETED (2026-03-17, 23:52)

**Files:**
- `src/components/sections/contact/ContactMap.tsx:37-39`
- `src/components/sections/testimonials/YandexReviews.tsx:35-37`
- `src/libs/utils.ts` — new constant export

**Solution Applied:**
1. Added constant to `src/libs/utils.ts`:
   ```ts
   export const DARK_IFRAME_FILTER =
     'invert(1) hue-rotate(180deg) saturate(1.6) brightness(1.1) contrast(1.05)';
   ```
2. Updated `ContactMap.tsx`:
   - Added import: `import { cn, DARK_IFRAME_FILTER } from '@/libs/utils';`
   - Replaced 3-line filter expression with: `filter: isDark ? DARK_IFRAME_FILTER : 'none'`
3. Updated `YandexReviews.tsx`:
   - Fixed import extension: changed `'@/libs/utils.ts'` → `'@/libs/utils'` (also resolves R12)
   - Added DARK_IFRAME_FILTER to import
   - Replaced 3-line filter expression with: `filter: isDark ? DARK_IFRAME_FILTER : 'none'`
   - Removed Russian comment (logic now self-documenting via constant)
4. Verified: lint ✓ | typecheck ✓ | build ✓ (2621 modules, 8.21s total)

**Impact:** Single source of truth for dark mode iframe filter. Removed ~12 lines of duplication. Bonus: fixed R12 import extension issue in YandexReviews.

---

## R5. Duplicate phone number formatting ✅

**Status:** ✅ COMPLETED (2026-03-17, 23:55)

**Files:**
- `src/components/sections/contact/ContactInfo.tsx:31`
- `src/components/sections/footer/FooterContact.tsx:23`
- `src/libs/utils.ts` — new function export

**Solution Applied:**
1. Added function to `src/libs/utils.ts`:
   ```ts
   export function phoneHref(phone: string): string {
     return `tel:${phone.replace(/\D/g, '')}`;
   }
   ```
2. Updated `ContactInfo.tsx`:
   - Added import: `import { phoneHref } from '@/libs/utils';`
   - Changed href from: `href={`tel:${phone.replace(/\D/g, '')}`}`
   - To: `href={phoneHref(phone)}`
3. Updated `FooterContact.tsx`:
   - Added import: `import { phoneHref } from '@/libs/utils';`
   - Changed from: `href: `tel:${phone.replace(/\D/g, '')}`
   - To: `href: phoneHref(phone)`
4. Verified: lint ✓ | typecheck ✓ | build ✓ (2621 modules, 11.96s total)

**Impact:** Removed duplicate regex pattern. Single source of truth for phone formatting logic. Prevents divergence if formatting rules change (e.g., adding country code prefix). Cleaner, more maintainable code.

---

## R6. Duplicate portfolio glob in section component ✅

**Status:** ✅ COMPLETED (2026-03-18)

**Files:**
- `src/types/portfolio/portfolioCases.ts:4-7` — glob + Zod parse → exports `portfolioCaseMap` and `allPortfolioCases`
- `src/components/sections/portfolio/index.tsx:14-17` — re-globs same files without Zod validation

**Problem:** The Portfolio section component re-runs `import.meta.glob('@data/portfolio/**/*.json')` instead of importing the already-parsed `allPortfolioCases`. This causes the glob to be evaluated twice in the module graph. The section adds `href` per item — this logic should live alongside the data.

**Solution Applied:**
1. Added `allPortfolioCasesWithHrefs` export to `src/types/portfolio/portfolioCases.ts` — maps `allPortfolioCases` with computed `href` using `categorySlug()` and `extractYearMonth()`, typed as `(PortfolioCase & { href: string })[]`
2. Updated `src/components/sections/portfolio/index.tsx` — removed duplicate `import.meta.glob`, removed `categorySlug`/`extractYearMonth` imports, imports `allPortfolioCasesWithHrefs` directly from `@/types/portfolio/portfolioCases` (not via barrel to avoid circular dependency)
3. Did NOT re-export from `@/types/portfolio/index.ts` — would create circular dependency (`index.ts` → `portfolioCases.ts` → `index.ts`) causing "Two different types with this name exist" TS error
4. Verified: format ✓ | lint ✓ | typecheck ✓ | build ✓ (2621 modules, 11.63s total)

**Impact:** Medium — removed duplicate glob evaluation, all portfolio data now goes through Zod validation. Component reduced by ~12 lines.

---

## R7. Duplicate color resolution logic in 3 list block components ✅

**Status:** ✅ COMPLETED (2026-03-18)

**Files:**
- `src/components/blocks/ListBlock/UnorderedListBlock.tsx:17-34`
- `src/components/blocks/ListBlock/OrderedListBlock.tsx:17-34`
- `src/components/blocks/ListBlock/ChecklistBlock.tsx:40-56`

**Problem:** All three list blocks contain identical color resolution logic:
```ts
const isEven = i % 2 === 0;
const rowColors = block.colors ? (isEven ? block.colors.even : block.colors.odd) : undefined;
const bgStyle = rowColors?.background ? { backgroundColor: resolveColor(rowColors.background) } : undefined;
const textStyle = rowColors?.text ? { color: resolveColor(rowColors.text) } : undefined;
const textClass = rowColors?.text ? 'leading-relaxed' : defaultTextClass;
```

**Fix:** Extract a helper function to `src/libs/resolveColor.ts` (already exists):
```ts
export function resolveListItemStyles(colors: BlockColor | undefined, index: number) {
  const rowColors = colors ? (index % 2 === 0 ? colors.even : colors.odd) : undefined;
  return {
    bgStyle: rowColors?.background ? { backgroundColor: resolveColor(rowColors.background) } : undefined,
    textStyle: rowColors?.text ? { color: resolveColor(rowColors.text) } : undefined,
    textClass: rowColors?.text ? 'leading-relaxed' : 'text-muted-foreground leading-relaxed',
  };
}
```
Replace in all three components with a single call.

**Impact:** Medium — removes ~18 lines of duplication across 3 files.

---

## R8. String interpolation via `.replace()` chains in 8+ places

**Status:** ✅ COMPLETED (2026-03-18)

**Files:**
- `src/components/sections/footer/FooterBottom.tsx:19` — `.replace('{year}', ...).replace('{name}', ...)`
- `src/components/portfolio/Pagination.tsx:38` — `.replace('{current}', ...).replace('{total}', ...)`
- `src/components/ui/imageGallery/index.tsx:104-105` — `.replace('{current}', ...).replace('{total}', ...)`
- `src/components/sections/carousel/CarouselControls.tsx:71` — `.replace('{index}', ...)`
- `src/components/blocks/GalleryBlock.tsx:29` — `.replace('{title}', ...)`
- `src/components/sections/about/AboutText.tsx:25` — `.replace('{name}', ...)`
- `src/components/sections/footer/FooterBrand.tsx:19` — `.replace('{description}', ...)`

**Solution Applied:**
1. Added `interpolate(template, values)` to `src/libs/utils.ts` — replaces `{key}` tokens via single regex; unmatched tokens preserved
2. Updated all 7 components to import and use `interpolate()` instead of chained `.replace()` calls
3. Verified: format ✓ | lint ✓ | typecheck ✓ | build ✓ (2621 modules, 7.53s total)

**Impact:** Medium — DRY, cleaner call sites, safer (unmatched tokens preserved instead of silently left). Removed ~14 chained `.replace()` calls.

---

## R9. Missing dev warnings for silent failures

**Status:** ✅ COMPLETED (2026-03-18)

**Files:**
- `src/components/blocks/BlockquoteBlock.tsx:22-23` — returns `null` when `testimonialId` not found
- `src/components/ui/legal/LegalBlockRenderer.tsx:5-8` — `applyTokens()` replaces unknown `{company.X}` tokens with empty string
- `src/plugins/seoMetaPlugin.ts:236-238` — `processBuiltHtml()` returns silently if `seo.json` missing

**Solution Applied:**
1. `BlockquoteBlock.tsx` — added `if (import.meta.env.DEV) console.warn(...)` before `return null` when testimonial ID not found
2. `LegalBlockRenderer.tsx` — added `if (!value && import.meta.env.DEV) console.warn(...)` in `applyTokens()` for unknown `{company.X}` tokens
3. `seoMetaPlugin.ts` — added `console.warn(...)` (no DEV guard — build-time code, always relevant) when `seo.json` is missing
4. Verified: format ✓ | lint ✓ | typecheck ✓ | build ✓ (2621 modules)

**Impact:** Medium — data issues now surface immediately during development instead of silently failing.

---

## R10. `React.FC` usage in ErrorFallback

**Status:** ✅ COMPLETED (2026-03-18)

**File:** `src/components/error/ErrorFallback.tsx:38`

**Solution Applied:**
- Changed `export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ onReset }) => {` → `export function ErrorFallback({ onReset }: ErrorFallbackProps) {`
- Removed `import React from 'react'` (no other React API used)
- Combined with R11 in the same edit pass
- Verified: format ✓ | lint ✓ | typecheck ✓

**Impact:** Low-Medium — consistency with rest of codebase, removes deprecated pattern.

---

## R11. Unnecessary `cn()` wrapping static strings in ErrorFallback

**Status:** ✅ COMPLETED (2026-03-18)

**File:** `src/components/error/ErrorFallback.tsx:50-68`

**Solution Applied:**
- Replaced 5 instances of `cn('static classes')` with plain `"static classes"` strings
- Kept the one legitimate `cn()` call on the action button (conditional multi-line merge)
- Combined with R10 in the same edit pass
- Verified: format ✓ | lint ✓ | typecheck ✓

**Impact:** Low — readability, removes misleading conditional-logic implication.

---

## R12. Import with `.ts` extension in YandexReviews

**Status:** ✅ COMPLETED (2026-03-18)

**File:** `src/components/sections/testimonials/YandexReviews.tsx:1`

**Problem:**
```tsx
import { cn } from '@/libs/utils.ts';
```
Only import in the entire codebase that uses `.ts` extension. All others omit it.

**Fix:** Remove `.ts` extension: `import { cn } from '@/libs/utils';`

**Impact:** Low — consistency.

---

## R13. Carousel missing accessibility attributes

**Status:** ✅ COMPLETED (2026-03-18)

**File:** `src/components/sections/carousel/index.tsx`

**Changes Applied:**
1. Added optional `ariaLabel` field to `CarouselSectionContentSchema` in `src/types/sections/carousel/carouselContent.ts`
   - Allows clients to customize the carousel's ARIA label via data
   - Defaults to "Featured projects" if not provided
2. Changed carousel container from `<div>` to `<section>` with accessibility attributes:
   - `role="region"` — identifies carousel as a landmark region
   - `aria-roledescription="carousel"` — describes the region's purpose
   - `aria-label={carouselContent.ariaLabel ?? 'Featured projects'}` — provides accessible name
3. Added `aria-live="polite"` to the active slide's text content in `CarouselSlide.tsx`
   - Combined with `aria-atomic="true"` to announce slide changes to screen readers
   - Sets `aria-live="off"` for inactive slides
4. Verified: format ✓ | lint ✓ | typecheck ✓ | build ✓ (2621 modules, 9.69s total)

**Impact:** High — improves WCAG 2.1 SC 1.3.1 (Info and Relationships), SC 4.1.2 (Name, Role, Value) compliance. Screen readers now properly announce carousel region and slide transitions.

---

## R14. Hardcoded iframe `title` attributes (Russian strings in components)

**Status:** ✅ COMPLETED (2026-03-18)

**Files Modified:**
- `src/types/sections/contact/contact.ts` — added `mapTitle` field to schema
- `src/types/sections/testimonials/testimonialsContent.ts` — added `reviewsTitle` field to schema
- `src/components/sections/contact/ContactMap.tsx` — accepts `title` prop, removed hardcoded "Мы на карте"
- `src/components/sections/testimonials/YandexReviews.tsx` — accepts `title` prop, removed hardcoded "Отзывы на Яндекс.Картах"
- `src/components/sections/contact/ContactInfo.tsx` — passes `mapTitle` to `<ContactMap>`
- `src/components/sections/testimonials/index.tsx` — passes `reviewsTitle` to `<YandexReviews>`
- `data/content/sections/contact/contact.json` — added `mapTitle: "Мы на карте"`
- `data/content/sections/testimonials/testimonialsContent.json` — added `reviewsTitle: "Отзывы на Яндекс.Картах"`

**Solution Applied:**
1. Added `mapTitle` (required string) to `ContactContentSchema`
2. Added `reviewsTitle` (required string) to `TestimonialsSectionContentSchema`
3. Updated component signatures to accept `title` prop (ContactMap, YandexReviews)
4. Updated parent components to destructure and pass these data values
5. Updated JSON data files with Russian translations
6. Verified: format ✓ | lint ✓ | typecheck ✓ | build ✓ (2621 modules, 8.51s total)

**Impact:** Medium — completes white-label promise for iframe accessibility labels. New clients can now customize iframe titles via JSON data instead of hardcoded component strings. Maintains Russian translations for current client while enabling future white-label customization.

---

## R15. `seoMetaPlugin` no-op stub is confusing

**Status:** Pending

**File:** `src/plugins/seoMetaPlugin.ts:325-327`

**Problem:**
```ts
export function seoMetaPlugin(): Plugin {
  return { name: 'seo-meta-plugin' };
}
```
Exports a Vite plugin that does nothing. The actual processing happens in `scripts/postbuild-seo.ts` calling `processBuiltHtml()`. Readers may not understand why the plugin is empty.

**Fix:** The comment on line 323 already explains this. Consider renaming to `seoMetaPluginStub()` for clarity, or removing the export entirely if `vite.config.ts` no longer imports it.

**Impact:** Low — readability only.

---

## R16. `ContactMap` and `YandexReviews` share near-identical iframe wrapper pattern ✅

**Status:** ✅ COMPLETED (2026-03-18)

**Files Modified:**
- `src/components/ui/YandexIframe.tsx` — new shared component (renamed from DarkIframe)
- `src/components/sections/contact/ContactMap.tsx` — refactored to use YandexIframe
- `src/components/sections/testimonials/YandexReviews.tsx` — refactored to use YandexIframe

**Solution Applied:**
1. Created `src/components/ui/YandexIframe.tsx` — reusable iframe component for Yandex embeds with props:
   - `src`, `title`, `height`, `isDark` (required)
   - `className`, `loading` (optional; loading defaults to 'eager')
   - Handles all dark mode logic: `DARK_IFRAME_FILTER` conditional, border vs shadow styling, `cn()` merge
2. Updated `ContactMap.tsx`:
   - Changed import to `YandexIframe`
   - Return value now uses `<YandexIframe src={url} title={title} height={360} isDark={isDark} className={className} />`
   - Added default `isDark = false` to prop destructuring
   - Reduced file from 45 to 26 lines
3. Updated `YandexReviews.tsx`:
   - Changed import to `YandexIframe`
   - Return value now uses `<YandexIframe src={...} title={title} height={650} isDark={isDark} className="mx-auto max-w-3xl" loading="lazy" />`
   - Reduced file from 43 to 27 lines
4. Cleanup: `src/components/ui/DarkIframe.tsx` can be deleted (now superseded by YandexIframe)
5. Verified: format ✓ | lint ✓ | typecheck ✓ | build ✓ (2622 modules, 5.29s total)

**Impact:** High — removed ~35 lines of duplicate iframe wrapper logic. YandexIframe is semantically named for its primary use case (Yandex Maps/reviews). Both components now thin wrappers. Future Yandex embeds can reuse this component directly.

---

## R17. ContactMap missing `loading="lazy"` on iframe ✅

**Status:** ✅ COMPLETED (2026-03-18)

**File:** `src/components/sections/contact/ContactMap.tsx:24`

**Solution Applied:**
1. Added `loading="lazy"` prop to the `YandexIframe` component call in ContactMap
2. Now matches the lazy loading behavior of YandexReviews (which uses `loading="lazy"`)
3. Map iframe (below the fold) will no longer load until user scrolls near it, improving initial page load performance
4. Verified: format ✓ | lint ✓ | typecheck ✓ | build ✓ (2622 modules, 8.50s total)

**Impact:** Low-Medium — performance improvement for initial page load. ContactMap and YandexReviews now have consistent lazy loading behavior. Saves bandwidth for users who don't scroll to contact section.

---

## R18. `ThemeContext` missing explicit type definition ✅

**Status:** ✅ COMPLETED (2026-03-18)

**File:** `src/contexts/ThemeContext.tsx`

**Solution Applied:**
1. Extracted context value shape into explicit `ThemeContextValue` interface:
   ```ts
   interface ThemeContextValue {
     isDark: boolean;
     toggle: () => void;
   }
   ```
2. Added explicit generic type parameter to `createContext<ThemeContextValue>({...})`
3. Benefits:
   - Type is now explicit and self-documenting for readers
   - Any changes to context shape must update the interface (catches refactoring errors)
   - TypeScript can now provide better error messages if consumers use wrong shape
   - Clearer contract for context consumers (useTheme hook)
4. Verified: format ✓ | lint ✓ | typecheck ✓ | build ✓ (2622 modules, 7.57s total)

**Impact:** Low — type safety improvement, clearer contract for consumers. Prevents silent type inference issues if context shape changes in the future.

---

## Priority Matrix

| ID  | Category           | Impact | Effort | Priority |
|-----|--------------------|--------|--------|----------|
| R1  | DRY / Build utils  | High   | Medium | **P1**   |
| R2  | DRY / CSS pattern  | High   | Small  | **P1**   |
| R3  | Semantic HTML bug  | Medium | Tiny   | **P1**   |
| R6  | DRY / Module graph | Medium | Small  | **P1**   |
| R9  | Dev warnings       | Medium | Small  | **P1**   |
| R4  | DRY / Magic value  | Medium | Tiny   | **P1**   |
| R5  | DRY / Utility      | Medium | Tiny   | **P1**   |
| R7  | DRY / List blocks  | Medium | Small  | **P2**   |
| R8  | DRY / Interpolation| Medium | Small  | **P2**   |
| R16 | DRY / Iframe       | Medium | Small  | **P2**   |
| R13 | Accessibility      | Medium | Small  | **P2**   |
| R10 | React.FC deprec.   | Low-Med| Tiny   | **P2**   |
| R11 | cn() misuse        | Low    | Tiny   | **P2**   |
| R12 | Import extension   | Low    | Tiny   | **P2**   |
| R17 | Perf / lazy load   | Low-Med| Tiny   | **P2**   |
| R14 | White-label        | Low-Med| Small  | **P3**   |
| R15 | Naming clarity     | Low    | Tiny   | **P3**   |
| R18 | Type safety        | Low    | Tiny   | **P3**   |

---

## Positive observations (things NOT to change)

1. **Previous refactoring was thorough** — all 28 items from PDR-009 are resolved.
2. **Component decomposition remains excellent** — no monolithic files found.
3. **Dark mode consistency** is much improved — no `bg-white` violations found.
4. **Data/component separation** is strictly maintained — components import from `@/types/` only.
5. **Error boundaries and global error handler** are well-implemented.
6. **`allPortfolioCases` export** was already added to centralize portfolio data.
7. **`useViewportAnimation` hook** successfully consolidates viewport detection.
8. **Zod validation** is applied consistently in type modules.
9. **`icon-shake` CSS class** IS used (ServiceCard, AdvantageCard) — not dead code.
10. **Social media pulse animations** use hardcoded brand colors (Telegram blue, VK blue) intentionally — these are brand colors, not theme tokens.
