# PDR: E2E Mobile — Step 1: Home page (`mobile_home.spec.ts`)

**Date**: 2026-03-23
**Blocked by**: `20260323_e2eMobile_00_setup.md`
**Spec file**: `tests/e2e/mobile_home.spec.ts`
**Test IDs**: E7.1–E7.17 (17 tests × 2 mobile projects = 34 runs)

## Source files to read before implementing

- `src/components/sections/header/index.tsx` — confirms `id="main-nav"` on `<header>`
- `src/components/sections/header/HeaderMobileNav.tsx` — drawer/backdrop class names:
  - Hamburger: `button[aria-expanded]` inside `div.md:hidden`
  - Backdrop: `div.fixed.inset-0.top-16.z-30` (z-30, clickable, `onClick={handleClose}`)
  - Drawer: `div.fixed.inset-x-0.top-16.z-40` (z-40, contains `<Container>` with nav + toggle)
  - DarkModeToggle is inside drawer: `div.flex.items-center.gap-2.pt-3 > DarkModeToggle`
- `src/components/sections/header/HeaderDesktopNav.tsx` — desktop action bar: `div.hidden.items-center.gap-3.md:flex`
- `src/components/ui/ScrollProgress.tsx` — `[role="progressbar"][aria-label="Page scroll progress"]`
- `src/components/sections/carousel/index.tsx` — `[role="region"][aria-roledescription="carousel"]`; swipe uses `onTouchStart/onTouchEnd` via `useSwipe`
- `src/hooks/useSwipe.ts` — read to confirm minimum swipe distance threshold before writing gesture test
- `src/components/sections/hero/index.tsx` — confirm section `id` and stats container selector
- `src/components/sections/services/index.tsx` — confirm section `id` (expected `#services`)
- `src/components/sections/advantages/index.tsx` — confirm section `id` (expected `#advantages`)
- `src/components/sections/call-to-action/index.tsx` — confirm section `id` and CTA button selector
- `src/components/sections/contact/index.tsx` — confirm `id`, form field names, submit button

## Tests to implement

| ID | Name | How to test |
|----|------|-------------|
| E7.1 | Hero `h1` visible on mobile | `page.goto('/')` → `h1` inside hero section visible |
| E7.2 | Desktop action bar hidden on mobile | `div.hidden.items-center.md\\:flex` (social + dark toggle) not visible |
| E7.3 | Hamburger button visible on mobile | `button[aria-expanded]` is visible |
| E7.4 | Drawer opens and shows nav links | click hamburger → `aria-expanded="true"` + drawer nav `a` links, count ≥ 3 |
| E7.5 | Drawer closes on backdrop click | open drawer → click `div[class*="z-30"]` backdrop → `aria-expanded="false"` |
| E7.6 | Drawer closes when a nav link is tapped | open drawer → click first nav `a` in drawer → `aria-expanded="false"` after 300ms |
| E7.7 | DarkModeToggle in drawer toggles `.dark` on `<html>` | open drawer → click toggle → `html.dark` present; click again → `.dark` removed |
| E7.8 | Hero stats visible on mobile | ≥ 3 stat elements inside hero visible (`HeroStats` renders animated counters) |
| E7.9 | Carousel renders on mobile | `[aria-roledescription="carousel"]` is visible |
| E7.10 | Carousel swipe advances slide | simulate left swipe via pointer drag on carousel → active dot `aria-current="true"` index changes |
| E7.11 | Services section has ≥ 1 card | `#services article` or service card element count ≥ 1 and visible |
| E7.12 | Advantages section has ≥ 1 card | `#advantages` section ≥ 1 card element visible |
| E7.13 | CTA section primary button tappable | CTA section primary `<a>` or `<button>` visible and within viewport bounds |
| E7.14 | Contact form fields and submit visible | `#contact` section → name/contact/message inputs + submit button all visible |
| E7.15 | Contact form blur validation shows error | type then clear name input → blur → error message element visible |
| E7.16 | Footer has ≥ 3 links | `footer a` count ≥ 3 and first link visible |
| E7.17 | Scroll progress bar shows after scrolling | scroll 300px down → `[role="progressbar"][aria-label="Page scroll progress"]` has `aria-valuenow` > 0 |

## Carousel swipe (E7.10) implementation notes

Use Playwright's `page.mouse` drag (pointer events) rather than `page.touchscreen`
since jsdom limitations don't apply in real browsers. Example:

```ts
const carousel = page.locator('[aria-roledescription="carousel"]');
const box = await carousel.boundingBox();
const startX = box!.x + box!.width * 0.7;
const endX   = box!.x + box!.width * 0.2;
const midY   = box!.y + box!.height / 2;

await page.mouse.move(startX, midY);
await page.mouse.down();
await page.mouse.move(endX, midY, { steps: 10 });
await page.mouse.up();
```

Confirm the min swipe distance from `src/hooks/useSwipe.ts` and ensure the drag
distance exceeds it. After swipe, wait for the active dot (`button[aria-pressed="true"]`
or first dot with distinct class) to change index.

## File skeleton

```ts
import { test, expect } from '@playwright/test';

test.describe('mobile: Home page (E7)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('E7.1 ...', async ({ page }) => { ... });
  // ...
});
```

## Validation

```bash
pnpm format && pnpm lint && pnpm typecheck
pnpm exec playwright test mobile_home.spec.ts --project="Mobile Chrome"
pnpm exec playwright test mobile_home.spec.ts --project="Mobile Safari"
```

## Acceptance criteria

- [ ] `tests/e2e/mobile_home.spec.ts` exists with E7.1–E7.17 (17 tests)
- [ ] All 17 tests pass on `Mobile Chrome` and `Mobile Safari` (34 runs)
- [ ] `pnpm format && pnpm lint && pnpm typecheck` pass
