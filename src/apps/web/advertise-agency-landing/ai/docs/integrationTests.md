# Integration Tests (Playwright)

## Why Playwright

The site is fully static SSG output (`build/client/`). Integration tests verify the built site in a real browser — routing, navigation, dark mode persistence, form interactions, and page rendering that jsdom cannot simulate.

Vitest Browser Mode was considered but requires a component-level harness rather than page-level navigation, making it unsuitable for SSG route coverage.

## Browsers

Tests run against Chrome, Firefox, Edge, and Safari (WebKit) in parallel.

## How to Run

**Always build first** — tests run against `pnpm preview` which serves `build/client/`.

```bash
# Full run (build + all browsers)
pnpm build
pnpm test:e2e

# Interactive UI mode
pnpm test:e2e:ui

# Single spec
pnpm test:e2e --grep "home page"

# Single browser
pnpm test:e2e --project=Chrome
```

## Test File Location

```
tests/
  integration/
    smoke.spec.ts
    home.spec.ts
    navigation.spec.ts
    darkMode.spec.ts
    portfolio.spec.ts
    contactForm.spec.ts
    orderPage.spec.ts
    errorAndLegal.spec.ts
```

Naming convention: `<feature>.spec.ts`

## What NOT to Test Here

These belong in unit tests (`src/**/*.test.{ts,tsx}` via Vitest):

- Internal component state or props
- Individual React hook behaviour
- CSS class presence
- Recharts rendering internals

Integration tests cover only **user-visible, cross-component flows** that require a real browser.

## Playwright Config

`playwright.config.ts` at project root. Key settings:

- `testDir`: `./tests/integration`
- `baseURL`: `http://localhost:4173`
- `webServer`: auto-starts `pnpm preview` before running
- `fullyParallel`: `true` — specs run in parallel across workers
- `trace`: `on-first-retry` — traces saved for failed tests

## CI

Set `CI=1` to activate:
- `retries: 2` (flaky test tolerance)
- `workers: 1` (serial execution, avoids resource contention)
- `forbidOnly: true` (fails if `test.only` left in code)

```bash
CI=1 pnpm build && CI=1 pnpm test:e2e
```

## Artifacts

- `playwright-report/` — HTML report (gitignored)
- `test-results/` — traces and screenshots (gitignored)

---

# Vitest Integration Tests

## What They Are

Vitest integration tests live in `src/test/integration/` and run in jsdom. They sit between unit tests (single component, fully mocked children) and Playwright e2e (real browser, built output). They verify **multi-component behaviour** wired through React Router and context providers.

## When to Write One

| Signal | Write a… |
|---|---|
| Testing one component in isolation with mocked children | **Unit test** (`src/**/*.test.tsx`) |
| Verifying that two or more real components compose correctly | **Vitest integration test** |
| Verifying a user flow that requires CSS, scroll, or real navigation | **Playwright e2e** |
| Verifying a link's `href` value is correct | **Vitest integration test** |
| Verifying dark mode class toggled on `<html>` | **Vitest integration test** |
| Verifying a filtering/pagination state machine | **Vitest integration test** |
| Verifying visual animation or layout | **Playwright e2e** |

**Not tested here** — leave to Playwright:
- Real browser scroll behaviour
- CSS animation/transition timing
- `window.matchMedia` / viewport dimension changes
- Actual navigation via `<Link>` clicks (AbortSignal/undici mismatch in jsdom — see below)

## Test File Location

```
src/test/integration/
  routes.test.tsx          # IT1 — all routes render the correct page (11 tests)
  appShell.test.tsx        # IT2 — Header + Footer + Outlet + utilities (7 tests)
  darkMode.test.tsx        # IT3 — ThemeContext → DarkModeToggle → html.dark (4 tests)
  portfolioFilter.test.tsx # IT4 — category filter + pagination state (6 tests)
  errorBoundary.test.tsx   # IT5 — ErrorBoundary catch + reset (4 tests)
  navLinks.test.tsx        # IT6 — Header/Footer link hrefs vs real data (9 tests)
```

## How to Run

```bash
# All integration tests (covered by the default include glob)
pnpm test src/test/integration

# Single spec
pnpm test src/test/integration/navLinks

# All tests (integration specs included automatically)
pnpm test
```

Integration specs are picked up by `include: ['src/**/*.test.{ts,tsx}']` in `vitest.config.ts` — no extra config needed.

## Router Patterns

Integration tests **do not** use `src/routes.ts` (which uses the RR v7 `file:` record format). Instead each test builds a minimal inline route tree with real imported components.

### Full routing — `createMemoryRouter` + `RouterProvider`

Use when the component under test calls `useParams`, `useSearchParams`, or `useLocation`.

```tsx
import { createMemoryRouter, RouterProvider } from 'react-router';
import { render } from '@testing-library/react';

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      { path: '/portfolio', element: <PortfolioCategoryPage /> },
      { path: '/portfolio/:categorySlug', element: <PortfolioCategoryPage /> },
    ],
    { initialEntries: [path] }   // parses query strings too: '/portfolio?page=2'
  );
  return render(<RouterProvider router={router} />);
}
```

### Simple context — `MemoryRouter`

Use when the component only needs a Router context (e.g. renders `<Link>`) but doesn't read route params.

```tsx
import { MemoryRouter } from 'react-router';

function withRouter(ui: React.ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}
```

### No router

Use for pure component trees with no `react-router` dependency (e.g. `ErrorBoundary`, `DarkModeToggle` + `ThemeContext`).

### Navigating via Link clicks — avoid in jsdom

React Router v7 uses fetch-based routing (`createClientSideRequest`) which fails in jsdom due to an `AbortSignal` mismatch between Node's built-in and `undici`. **Do not click `<Link>` elements to navigate.** Instead, render the component at the target path directly:

```tsx
// ✗ Don't do this — AbortSignal mismatch crashes the test
fireEvent.click(screen.getByRole('link', { name: 'Брендинг' }));

// ✓ Do this instead
renderAt('/portfolio/branding');
```

## Data-Dependent Tests — Skip Guard Pattern

Some tests use real gitignored JSON data. Add a skip guard so they fail gracefully in CI where the data files are absent:

```tsx
import { existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = process.cwd(); // Vitest runs from project root
const dataExists = [
  'data/content/sections/header/header.json',
  'data/content/sections/footer/footer.json',
].every((p) => existsSync(resolve(ROOT, p)));

// Fallback mock — lets the @/types/ module load even when the file is absent.
// When the file exists, importOriginal() returns the real JSON unchanged.
vi.mock('@data/sections/header/header.json', async (importOriginal) => {
  try {
    return await importOriginal();
  } catch {
    return { default: { lang: 'ru', logo: { href: '/', src: '' }, nav: [], navCta: '', openMenuLabel: '', closeMenuLabel: '' } };
  }
});

// Skip the whole describe block when data is missing
describe.skipIf(!dataExists)('Navigation links correctness', () => {
  // tests using real headerContent, footerContent, etc.
});
```

Key points:
- `vi.mock('@data/...')` — mock the raw JSON alias, **not** the `@/types/` TypeScript wrapper
- `importOriginal()` passes through the real file when it exists; the catch returns a valid stub
- `describe.skipIf(!dataExists)` skips tests; the stub keeps the module loadable so Vitest doesn't error the file

## Mock Scope Conventions

### What to mock

| Target | Reason |
|---|---|
| `@/types/sections/**`, `@/types/config/**` | Gitignored JSON — tests must not depend on real file content |
| `@/types/portfolio/portfolioCases` | Gitignored; use fake cases with known slugs/categories |
| `@/components/sections/hero`, `@/components/sections/carousel` | Heavy — many deps, not under test |
| `@/components/analytics/MetrikaScript` | Side-effect; irrelevant to component behaviour |
| `@/components/ui/Logo`, `@/components/ui/SocialLinks` | Image loading / social URLs irrelevant to link tests |
| `window.matchMedia` | jsdom lacks this; required by `useViewportAnimation` and pill-position hooks |
| `localStorage` (via `vi.stubGlobal`) | jsdom's `useSyncExternalStore` needs a fully functional store |

### What NOT to mock

The component (or composition of components) under integration test should be real:

- `ErrorBoundary`, `ScrollProgress`, `CookieBanner` — tested in IT2
- `PortfolioGrid`, `CategoryNav`, `AnimatedPillTabs`, `Pagination` — tested in IT4
- `ThemeContext` + `DarkModeToggle` — tested in IT3
- `HeaderNav`, `FooterNav`, `FooterServices`, `FooterBottom` — tested in IT6
- `@/libs/utils`, `@/libs/resolveColor`, etc. — utility functions, never mock

### Unit test helper (`src/test/utils.tsx`)

The existing `customRender` from `src/test/utils.tsx` wraps in `MemoryRouter` + `ThemeContext` and is used by **unit** tests. Integration tests build their own router trees inline and generally do not use this helper — it doesn't support `createMemoryRouter` + `RouterProvider` with custom route trees.
