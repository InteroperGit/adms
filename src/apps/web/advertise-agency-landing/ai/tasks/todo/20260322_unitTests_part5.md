# Plan: Unit Tests — Part 5: Hooks, Error Components & Contact Sub-components

**Status**: in-progress (T27 ✅)
**Date**: 2026-03-22
**Series**: 5 of N (continuation of parts 1–4)

## Goal

Add tests for the remaining hooks without coverage, the error boundary family, and small contact sub-components that were missed in part 3. Also fix the single failing test in `useRandomButtonHighlight`.

---

## Task T27: Fix failing test — `useRandomButtonHighlight` ✅

**Model**: Claude Haiku 4.5
**File**: `src/hooks/useRandomButtonHighlight.test.ts`

**Problem:** The "cycles back to null after the hold period" test advances 5001ms past the hold timer but this also fires the subsequent pause timeout (1–4s), which kicks off another `cycle()` call that sets `activeIndex` to a new number — so the assertion `toBeNull()` fails.

**Fix:** Use `vi.advanceTimersByTime(5000)` to land exactly at the hold boundary, then immediately check for null before the pause timer elapses. Or spy on `Math.random` to pin hold duration to a known value (e.g. 2000ms) and advance exactly that far.

**Recommended fix:** Mock `Math.random` with `vi.spyOn(Math, 'random').mockReturnValue(0)` in `beforeEach` so:
- `rand(2000, 5000)` → 2000 (hold)
- `rand(1000, 4000)` → 1000 (pause)

Then: advance 1ms (initial) → not null; advance 2000ms → null; advance 999ms → still null; advance 1ms → not null again.

**Tests to fix/add:**
- `cycles back to null after the hold period` — fix timer arithmetic
- `cycles to a new index after null (pause expires)` — optional new test verifying cycle restarts

**Validation:** `pnpm test src/hooks/useRandomButtonHighlight`

---

## Task T28: Untested hooks ✅

**Model**: Claude Haiku 4.5

### `src/hooks/useAnimatedPillPosition.ts` (66 lines)

- `returns { left: 0, width: 0 } when no buttons are present`
- `returns correct position when active button is found via data-value`
- `updates position when activeValue changes`
- `calls ResizeObserver and disconnects on unmount`

### `src/hooks/useScrollReset.ts` (19 lines)

- `scrolls to top when location changes`
- `does not throw when window.scrollTo is absent`

### `src/hooks/useStaggeredReveal.ts` (80 lines)

- `returns false for all items initially`
- `marks items visible in sequence as IntersectionObserver fires`
- `respects prefers-reduced-motion (all visible immediately)`

### `src/hooks/useViewportAnimation.ts` (54 lines)

- `returns false initially`
- `returns true when element enters viewport`
- `disconnects observer on unmount`

**Mock notes:**
- Mock `IntersectionObserver` for `useStaggeredReveal` and `useViewportAnimation`
- Mock `window.matchMedia` for `useStaggeredReveal` (prefers-reduced-motion)
- Mock `ResizeObserver` for `useAnimatedPillPosition`

**Validation:** `pnpm test src/hooks/useAnimatedPillPosition src/hooks/useScrollReset src/hooks/useStaggeredReveal src/hooks/useViewportAnimation`

---

## Task T29: Error component family — `src/components/error/` ✅

**Model**: Claude Haiku 4.5

| Test file | Component | Lines | Tests |
|-----------|-----------|-------|-------|
| `ErrorBoundary.test.tsx` | `ErrorBoundary` | 221 | catches errors and renders fallback; calls `onError` callback; renders children when no error; resets on `resetKeys` change |
| `ErrorFallback.test.tsx` | `ErrorFallback` | 78 | renders error message; renders reset button; calls `resetErrorBoundary` on click |
| `DevErrorFallback.test.tsx` | `DevErrorFallback` | 102 | renders error stack in dev mode; renders component stack; has copy button |
| `SilentErrorFallback.test.tsx` | `SilentErrorFallback` | 20 | renders nothing (returns null) |
| `BlockErrorFallback.test.tsx` | `BlockErrorFallback` | 35 | renders inline error message; does not throw |

**Mock notes:**
- Suppress `console.error` in `ErrorBoundary` tests (React prints error details)
- Pass `error` and `resetErrorBoundary` as props to fallback components

**Validation:** `pnpm test src/components/error src/components/blocks/BlockErrorFallback`

---

## Task T30: Contact sub-components — `src/components/sections/contact/` ✅

**Model**: Claude Haiku 4.5

| Test file | Component | Lines | Tests |
|-----------|-----------|-------|-------|
| `ContactFormInput.test.tsx` | `ContactFormInput` | 42 | renders input with label; shows error message; applies error styling; calls onChange |
| `ContactFormTextarea.test.tsx` | `ContactFormTextarea` | 44 | renders textarea with label; shows error message; applies error styling; calls onChange |
| `ContactItem.test.tsx` | `ContactItem` | 43 | renders icon; renders label and value; renders link when href provided; renders plain text when no href |

**Validation:** `pnpm test src/components/sections/contact/ContactFormInput src/components/sections/contact/ContactFormTextarea src/components/sections/contact/ContactItem`

---

## Task T31: Misc section sub-components

**Model**: Claude Haiku 4.5

| Test file | Component | Lines | Tests |
|-----------|-----------|-------|-------|
| `FooterSection.test.tsx` | `FooterSection` | 33 | renders section title; renders children |
| `TestimonialsEmpty.test.tsx` | `TestimonialsEmpty` | 33 | renders empty state message; renders icon |
| `YandexReviews.test.tsx` | `YandexReviews` | 31 | renders WidgetIframe with correct src |

**Validation:** `pnpm test src/components/sections/footer/FooterSection src/components/sections/testimonials`

---

## Summary

| Task | Scope | Est. tests |
|------|-------|------------|
| T27 | Fix `useRandomButtonHighlight` (1 failing test) | 1 fix + 1 optional |
| T28 | 4 hooks | ~15 |
| T29 | 5 error components | ~16 |
| T30 | 3 contact sub-components | ~12 |
| T31 | 3 misc sub-components | ~9 |
| **Total** | | **~53 tests** |

## Execution Order

Tasks T27 → T28 → T29 → T30 → T31 (all independent; fix failing test first).

## Validation (each task)

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm test <path>
```

Final after all tasks:

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm build
```
