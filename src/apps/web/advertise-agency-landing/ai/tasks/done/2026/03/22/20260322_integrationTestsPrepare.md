# Plan: Integration Tests — Infrastructure Setup

**Status**: ✅ done
**Date**: 2026-03-22

## Goal

Bootstrap a `tests/integration/` directory with Playwright for end-to-end integration
testing of the static SSG output. The unit test suite (`src/**/*.test.{ts,tsx}` via
Vitest + jsdom) covers isolated components and utilities; integration tests verify the
fully-built site in a real browser: routing, navigation, dark mode, form interactions,
animations, and portfolio page rendering.

---

## Scope

This PDR covers **infrastructure only** — no test cases yet:

1. Install Playwright as a dev dependency
2. Create `playwright.config.ts` at the project root
3. Create `tests/integration/` directory with a smoke-test placeholder
4. Add `test:e2e` and `test:e2e:ui` scripts to `package.json`
5. Update `vitest.config.ts` `include` exclusion to avoid picking up Playwright tests
6. Update `.gitignore` for Playwright artifacts (`test-results/`, `playwright-report/`)
7. Document the setup in `ai/docs/integrationTests.md`

No Playwright tests are written in this PDR — that is deferred to the next PDR.

---

## Decisions

### Runner: Playwright

- SSG output is fully static HTML — Playwright tests against `pnpm preview` (or a
  local static file server) rather than a live API.
- Playwright is the standard for React Router v7 + Vite apps in 2025–2026.
- Vitest Browser Mode is an alternative but requires component-level harness rather
  than page-level navigation — not ideal for SSG route coverage.

### Test target: preview server

```
baseURL: http://localhost:4173
```

Tests should start `pnpm preview` before running, or rely on `webServer` config in
`playwright.config.ts` so Playwright spins it up automatically.

### Directory layout

```
tests/
  integration/
    smoke.spec.ts          # placeholder — verifies home page loads
playwright.config.ts
```

Unit tests remain under `src/**/*.test.{ts,tsx}` — no overlap.

---

## Task I1: Install Playwright

**Command:**
```bash
pnpm add -D @playwright/test
pnpm exec playwright install --with-deps chromium firefox webkit
```

Installs Chromium (Chrome/Edge), Firefox, and WebKit (Safari).

**Validation:** `pnpm exec playwright --version` prints version.

---

## Task I2: `playwright.config.ts`

Create at project root. Key settings:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/integration',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'Chrome',   use: { ...devices['Desktop Chrome'] } },
    { name: 'Firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'Edge',     use: { ...devices['Desktop Edge'] } },
    { name: 'Safari',   use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

**Note:** `pnpm preview` serves `build/client/`. Tests will fail with a clear message
if the site has not been built first — that is intentional.

---

## Task I3: Smoke test placeholder

`tests/integration/smoke.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);
});
```

This is the minimal test that confirms the infrastructure works end-to-end.

---

## Task I4: `package.json` scripts

Add to the `scripts` section:

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

---

## Task I5: `vitest.config.ts` exclusion

The current `include` is `['src/**/*.test.{ts,tsx}']` — Playwright specs in `tests/`
are already excluded by path. No change needed. Add a comment confirming this.

Actually: verify the `exclude` in coverage config also skips `tests/` to avoid false
coverage from Playwright specs that import helpers.

Add to `coverage.exclude`:
```ts
'tests/**',
```

---

## Task I6: `.gitignore` additions

Add:
```
# Playwright
test-results/
playwright-report/
```

---

## Task I7: `ai/docs/integrationTests.md`

Create documentation covering:

- Why Playwright (not Vitest browser mode)
- How to run: `pnpm build && pnpm test:e2e`
- How to run with UI: `pnpm test:e2e:ui`
- Test file location: `tests/integration/`
- Naming convention: `<feature>.spec.ts`
- What NOT to test (unit-level concerns — those belong in `src/`)
- How to run a single spec: `pnpm test:e2e --grep "home page"`
- CI note: set `CI=1` env var so retries and serial mode activate

---

## Execution Order

I1 → I2 → I3 → I4 → I5 → I6 → I7

All steps are sequential (each builds on the previous).

---

## Validation (final)

After all steps:

```bash
pnpm build
pnpm test:e2e
pnpm format && pnpm lint && pnpm typecheck
```

Expected: smoke test passes, no lint/type errors introduced.
