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
