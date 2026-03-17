# Plan: Components Refactoring — Hero Badge, Dark-Mode Borders

**Status**: ✅ DONE
**Date**: 2026-03-17

## Goal

Three targeted improvements:

1. **Extract Hero inline badge** into the shared `SectionBadge` component (DRY)
2. **Add `dark:border-primary` to "Our Works" button** (Hero) and hero stat icon boxes
3. **Add `dark:border-primary` to "All Projects" button** (Portfolio section)

All changes are purely cosmetic / structural — no data schema changes, no new files (except possibly minor SectionBadge enhancement).

---

## Current State

### Hero badge (inline, duplicated)

`src/components/sections/hero/index.tsx:34-44`:
```tsx
<div
  className={cn(
    'mb-6 inline-flex items-center gap-2 rounded-full border',
    'border-primary/20 bg-primary/5',
    'px-3 py-1 text-xs font-medium text-primary',
    'sm:px-4 sm:py-1.5 sm:text-sm'
  )}
>
  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
  {hero.badge}
</div>
```

This is nearly identical to `SectionBadge` (`light` variant):
```tsx
'border border-primary/20 bg-primary/5 text-primary dark:border-primary/50'
```

Differences:
- Hero has a **dot indicator** (`<span className="h-1.5 w-1.5 rounded-full bg-primary" />`)
- Hero uses responsive sizing (`text-xs` → `sm:text-sm`, smaller padding on mobile)
- `SectionBadge` has no dot indicator and uses fixed `px-4 py-1.5 text-sm`

### Hero "Our Works" button

`src/components/sections/hero/HeroCTA.tsx:30-37`:
```tsx
<Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-muted hover:text-primary">
```

In dark mode the outline button border comes from `border-input` (a neutral/muted color). It's not prominent enough — should have `dark:border-primary` to stand out against the dark background.

### Hero stat icon boxes

`src/components/sections/hero/CountingStat.tsx:33`:
```tsx
<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
```

No border at all. Compare with `SectionIconBox` which has `border border-primary/20 dark:border-primary/50`. The stat icons should have a matching border in dark mode for consistency with the rest of the design system.

### Portfolio "All Projects" button

`src/components/sections/portfolio/index.tsx:75-82`:
```tsx
<Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-muted hover:text-primary">
```

Same issue as the Hero secondary button — `border-input` disappears against dark backgrounds.

---

## Steps

### ✅ Step 1 — Enhance `SectionBadge` to support dot indicator

**File**: `src/components/ui/section/SectionBadge.tsx`
**Status**: DONE — Added `dot?: boolean` prop, renders indicator before label, reverted dark border to `primary/50`

```tsx
interface SectionBadgeProps {
  label: string;
  variant?: 'light' | 'dark';
  dot?: boolean;
  className?: string;
}

export function SectionBadge({ label, variant = 'light', dot = false, className }: SectionBadgeProps) {
  return (
    <div className={cn(
      'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium',
      variant === 'dark'
        ? 'border border-white/10 bg-white/10 text-white/80'
        : 'border border-primary/20 bg-primary/5 text-primary dark:border-primary/50',
      className
    )}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
      {label}
    </div>
  );
}
```

### ✅ Step 2 — Replace Hero inline badge with `SectionBadge`

**File**: `src/components/sections/hero/index.tsx`
**Status**: DONE — Replaced inline badge div with `<SectionBadge>` component (no dot prop), added SectionBadge import, removed unused `cn` import

### ✅ Step 3 — Add `dark:border-primary/50` to Hero "Our Works" button

**File**: `src/components/sections/hero/HeroCTA.tsx`
**Status**: DONE — Added `dark:border-primary/50` to secondary button className for dark mode visibility

### ✅ Step 4 — Add border to Hero stat icon boxes in dark mode

**File**: `src/components/sections/hero/CountingStat.tsx`
**Status**: DONE — Added `border border-transparent bg-primary/10 text-primary dark:border-primary/50` to icon box, plus `animate-cta-pulse-slow` animation when highlighted via `useRandomButtonHighlight`

### ✅ Step 5 — Add `dark:border-primary/50` to Portfolio "All Projects" button

**File**: `src/components/sections/portfolio/index.tsx`
**Status**: DONE — Added `dark:border-primary/50` to CTA button for dark mode consistency

### ✅ Step 6 — Verify

**Status**: DONE
- ✅ Hero badge renders via SectionBadge (no dot)
- ✅ Dark mode borders visible on buttons: `dark:border-primary/50`
- ✅ Hero stat icons have `dark:border-primary/50` + `animate-cta-pulse-slow` animation
- ✅ `pnpm typecheck` passes
- ✅ All sections analyzed: no other sections need `useViewportAnimation` (existing `useFadeIn` pattern sufficient)

---

## Bonus Work (DRY Refactoring)

### ✅ Created `useViewportAnimation` Hook

**File**: `src/hooks/useViewportAnimation.ts`
**Status**: DONE — New shared hook for viewport detection + animation state. Returns `[ref, hasAnimated]` tuple. Respects `prefers-reduced-motion`. Used by HeroStats and Header for consistency.

### ✅ Refactored HeroStats

**File**: `src/components/sections/hero/HeroStats.tsx`
**Status**: DONE — Now uses `useViewportAnimation` + `useRandomButtonHighlight`. Random stat rotation (2-5s animation, 1-4s pause) starts only when scrolled into view.

### ✅ Refactored Header

**File**: `src/components/sections/header/index.tsx`
**Status**: DONE — Replaced manual `useRef` + `useInViewport` with `useViewportAnimation`. Same random highlight rotation pattern as HeroStats for consistency.

### ✅ Added `animate-cta-pulse-slow` Keyframe

**File**: `src/index.css`
**Status**: DONE — New 4s pulse animation (half speed of original 2.5s) for stat icons. Reduces animation frequency while maintaining visual appeal.

---

## Files Affected

| Action | File | Notes |
|--------|------|-------|
| **Modify** | `src/components/ui/section/SectionBadge.tsx` | Added `dot?: boolean` prop, dark mode border `primary/50` |
| **Modify** | `src/components/sections/hero/index.tsx` | Replaced inline badge with `<SectionBadge>`, removed `cn` import |
| **Modify** | `src/components/sections/hero/HeroCTA.tsx` | Added `dark:border-primary/50` to secondary button |
| **Modify** | `src/components/sections/hero/CountingStat.tsx` | Added `dark:border-primary/50` border + `animate-cta-pulse-slow` animation |
| **Modify** | `src/components/sections/portfolio/index.tsx` | Added `dark:border-primary/50` to CTA button |
| **Create** | `src/hooks/useViewportAnimation.ts` | Shared hook for viewport detection + animation state (DRY refactor) |
| **Modify** | `src/components/sections/hero/HeroStats.tsx` | Uses `useViewportAnimation` + `useRandomButtonHighlight` for random rotation |
| **Modify** | `src/components/sections/header/index.tsx` | Uses `useViewportAnimation` + `useRandomButtonHighlight` (consistent pattern) |
| **Modify** | `src/index.css` | Added `@keyframes cta-pulse-slow` (4s animation) + Tailwind animation var |
