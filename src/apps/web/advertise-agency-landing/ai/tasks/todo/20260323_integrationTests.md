# Plan: Vitest Integration Tests

**Status**: todo
**Date**: 2026-03-23

## Goal

Add integration tests using Vitest + jsdom that verify multi-component behaviour with real
routing wired up via `createMemoryRouter` / `RouterProvider` (React Router v7). These sit
between unit tests (fully mocked children) and Playwright e2e (real browser). They test:

- Routes render the correct page component
- App shell (Header + Footer + Outlet) composes correctly with page content
- Cross-cutting concerns: ThemeContext dark-mode toggle across Header + page
- Error boundary catches and renders fallback
- Navigation links point to correct hrefs
- Cookie consent banner shows / hides correctly via context
- Portfolio filtering and pagination state across the PortfolioCategoryPage
- Hash-anchor navigation helpers resolve correctly

**Not tested here** — leave these to Playwright e2e:
- Actual browser scroll behaviour
- CSS animation/transition timing
- Real `window.matchMedia` / viewport changes

---

## Test infrastructure additions

### `src/test/createRouter.tsx`

A shared helper that creates a `createMemoryRouter` wired to the app's real route tree and
renders it inside `ThemeContext`. Integration tests import this instead of bare `render`.

```ts
import { createMemoryRouter, RouterProvider } from 'react-router';
import { render } from '@testing-library/react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useState } from 'react';
import routes from '@/routes'; // RouteConfig[]

// NOTE: React Router v7 createMemoryRouter accepts RouteObject[], not RouteConfig[].
// We use a lightweight route tree here instead of importing src/routes.ts directly.

export function renderRoute(initialPath: string, options?: { dark?: boolean }) {
  // ...
}
```

Because `src/routes.ts` uses the RR v7 `file:` record format (not importable components
directly), integration tests define a minimal **inline route tree** that mirrors the real
routes but uses real components. Each test imports the page component it needs.

---

## Task IT1: Route rendering — core pages

**File**: `src/test/integration/routes.test.tsx`

Tests that navigating to each route renders the correct page landmark.

| Route | Expected marker |
|---|---|
| `/` | `main#main-content` + `data-testid="hero"` (mocked Hero inside Home) |
| `/portfolio` | portfolio page title visible |
| `/portfolio/branding` | category filter shows "branding" as active |
| `/privacy-policy` | legal page heading for privacy policy |
| `/user-agreement` | legal page heading for user agreement |
| `/consent` | legal page heading for consent |
| `/404` | NotFound `aria-label` containing "Error" |
| `/unknown-path` | catch-all → NotFound renders |

**Approach:**
- Use `createMemoryRouter` with an inline route tree (App shell + all page components imported directly)
- Mock all `@/types/` data modules globally in the test file
- Mock heavyweight section sub-components (Hero, About, Services, …) to avoid jsdom rendering issues
- Assert on structural markers, not text (text is in gitignored JSON)

**Mock scope (shared across IT1–IT4):**
- All `@/types/sections/**` — stub content
- All `@/types/config/**` — stub config (portfolioConfig, categories, etc.)
- `@/types/portfolio/portfolioCases` — 2 fake cases (one per category)
- `@/components/sections/hero` — stub
- `@/components/sections/carousel` — stub
- `@/components/analytics/MetrikaScript` — null
- `window.matchMedia` — standard stub

---

## Task IT2: App shell integration

**File**: `src/test/integration/appShell.test.tsx`

Tests that `App` (the root layout) wires Header, Footer, Outlet, and utility components
correctly when rendered with a real router.

| Test | What to assert |
|---|---|
| Header renders | `<header>` element present |
| Footer renders | `<footer>` element present |
| `main#main-content` renders | Outlet slot exists |
| SkipToContent renders | Link with href `#main-content` |
| ScrollProgress renders | `data-testid="scroll-progress"` or role presentation |
| ErrorBoundary present | No crash on render |
| CookieBanner present | banner element (check consent context default) |

**Approach:**
- Render `App` via `createMemoryRouter` at `/`
- Mock all section components (Header and Footer mocked minimally — just their root element)
- Do NOT mock `ErrorBoundary` or `ScrollProgress` — these are the units under integration

---

## Task IT3: ThemeContext dark-mode integration

**File**: `src/test/integration/darkMode.test.tsx`

Tests that the dark-mode toggle in `DarkModeToggle` propagates `isDark` through
`ThemeContext` and is reflected on the `<html>` element's class.

| Test | What to assert |
|---|---|
| Initial state: light | `document.documentElement` does NOT have class `dark` |
| Toggle → dark | `document.documentElement` has class `dark` after clicking toggle |
| Toggle → light again | class removed after second click |
| `DarkModeToggle` aria-label reflects state | `aria-label` changes (pressed/not pressed) |

**Approach:**
- Render `DarkModeToggle` inside the real `ThemeContext` provider (not mocked)
- Use `useTheme` hook to verify context value propagation
- `ThemeContext` writes to `document.documentElement.classList` — assert on that

---

## Task IT4: Portfolio filtering integration

**File**: `src/test/integration/portfolioFilter.test.tsx`

Tests that selecting a category filter on `PortfolioCategoryPage` correctly filters the
displayed portfolio cards.

| Test | What to assert |
|---|---|
| All projects shown by default | both fake case cards visible |
| Click "branding" filter | only branding case card visible |
| Click "web" filter | only web case card visible |
| Click "all" filter | both cards visible again |
| Pagination: perPage clamps | when perPage=1, only 1 card shown |
| Pagination next | clicking Next shows next item |

**Approach:**
- Render `PortfolioCategoryPage` inside `createMemoryRouter` at `/portfolio`
- Mock `@/types/portfolio/portfolioCases` with 3 fake cases (2 branding, 1 web)
- Mock `@/types/config/categories` with `[{slug:'branding',...}, {slug:'web',...}]`
- Mock `portfolioConfig.perPage = 2` to keep pagination manageable
- Do NOT mock `PortfolioGrid`, `CategoryNav`, `PortfolioFilter`, `Pagination` — these are what we're testing
- Mock `PortfolioCard` to avoid image loading issues: `<div data-testid="portfolio-card" data-slug={slug} />`

---

## Task IT5: Error boundary integration

**File**: `src/test/integration/errorBoundary.test.tsx`

Tests that when a child component throws, the `ErrorBoundary` renders a fallback rather
than crashing the whole tree.

| Test | What to assert |
|---|---|
| Normal render: no error | children visible |
| Child throws: fallback shown | `data-testid="error-fallback"` present, children not present |
| Error logged | `console.error` called (spy) |
| Reset (if implemented) | clicking reset re-renders children |

**Approach:**
- Create a `ThrowingComponent` that throws on first render but not after reset
- Render `<ErrorBoundary><ThrowingComponent /></ErrorBoundary>` directly (no router needed)
- `console.error` spy with `vi.spyOn(console, 'error').mockImplementation(() => {})` to silence jsdom output

---

## Task IT6: Navigation links correctness

**File**: `src/test/integration/navLinks.test.tsx`

Tests that navigation links in `Header` and `Footer` point to correct hrefs. These are
derived from `headerContent.nav` and `footerContent` data — worth testing with the real
data modules wired in (not mocked) to catch schema regressions.

| Test | What to assert |
|---|---|
| Header nav links present | each `NavLink.href` has a matching `<a>` element |
| Footer nav links present | same for footer nav |
| Footer service links | hrefs match config |
| Legal page links in footer | `/privacy-policy`, `/user-agreement`, `/consent` present |

**Approach:**
- Render `Header` + `Footer` in `MemoryRouter` with real data (no `@/types/` mocks for this test)
- This requires gitignored data files to exist at test time — add a `vi.importActual` fallback
  or mark these tests with `.skipIf(!dataExists)` guard using `fs.existsSync` in a `beforeAll`

**Note:** If data files are missing in CI, these tests skip gracefully; they are most
valuable locally where data files exist.

---

## Task IT7: Vitest config — integration include

Update `vitest.config.ts` to include `src/test/integration/**` in the `include` glob so
these tests run with `pnpm test`:

```ts
include: ['src/**/*.test.{ts,tsx}', 'src/test/integration/**/*.test.{ts,tsx}'],
```

Actually: `src/test/integration/` is already inside `src/`, so `src/**/*.test.{ts,tsx}`
covers it. Verify this — no config change may be needed.

Also add `src/test/integration/**` to `coverage.exclude` if the helper files (non-test)
are picked up.

---

## Task IT8: `ai/docs/integrationTests.md` — update

Append a **"Vitest integration tests"** section to the existing `ai/docs/integrationTests.md`
(which currently covers Playwright only):

- When to write a Vitest integration test vs a unit test vs a Playwright e2e test
- How to run: `pnpm test src/test/integration`
- Helper: `src/test/createRouter.tsx` usage
- Data-dependent tests: skip guard pattern
- Mock scope conventions (what to mock, what NOT to mock)

---

## Summary

| Task | File | Tests |
|------|------|-------|
| IT1 | `src/test/integration/routes.test.tsx` | ~10 |
| IT2 | `src/test/integration/appShell.test.tsx` | ~7 |
| IT3 | `src/test/integration/darkMode.test.tsx` | ~4 |
| IT4 | `src/test/integration/portfolioFilter.test.tsx` | ~6 |
| IT5 | `src/test/integration/errorBoundary.test.tsx` | ~4 |
| IT6 | `src/test/integration/navLinks.test.tsx` | ~5 |
| IT7 | `vitest.config.ts` | config tweak |
| IT8 | `ai/docs/integrationTests.md` | docs |
| **Total** | | **~36 tests** |

## Execution Order

IT7 (config check) → IT1 → IT2 → IT3 → IT4 → IT5 → IT6 → IT8

IT1 establishes the shared mock patterns that IT2–IT6 reuse.

## Validation (each task)

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm test src/test/integration
```

Final after all tasks:

```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm build
```

---

## Done

<!-- mark tasks here as they complete -->
