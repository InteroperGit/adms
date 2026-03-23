# PDR: E2E Mobile — Step 0: Playwright config setup

**Date**: 2026-03-23
**Blocks**: all other `e2eMobile_*` tasks — implement this first.

## Goal

Add `Mobile Chrome` and `Mobile Safari` Playwright device projects to
`playwright.config.ts`, scoped so they only run mobile spec files
(`mobile_*.spec.ts`) and desktop projects skip them.

## Changes

### 1. `playwright.config.ts`

Add two mobile device projects and restrict which specs each project type runs:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
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
    // Desktop — skip mobile-only specs
    { name: 'Chrome',  use: { ...devices['Desktop Chrome'] },  testIgnore: ['**/mobile_*.spec.ts'] },
    { name: 'Firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: ['**/mobile_*.spec.ts'] },
    { name: 'Edge',    use: { ...devices['Desktop Edge'] },    testIgnore: ['**/mobile_*.spec.ts'] },
    { name: 'Safari',  use: { ...devices['Desktop Safari'] },  testIgnore: ['**/mobile_*.spec.ts'] },
    // Mobile — only run mobile-prefixed specs
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] },   testMatch: ['**/mobile_*.spec.ts'] },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] }, testMatch: ['**/mobile_*.spec.ts'] },
  ],
  webServer: {
    command: 'pnpm preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

### 2. `tests/e2e/navigation.spec.ts`

Add a comment above E2.5 to cross-reference the dedicated mobile specs:

```ts
// E2.5–E2.6: inline viewport guard (run on all 4 desktop browsers).
// Full mobile device profile coverage for these scenarios → mobile_home.spec.ts (E7).
test('E2.5 mobile: hamburger menu opens on narrow viewport', ...
```

## Validation

```bash
pnpm format && pnpm lint && pnpm typecheck
# Smoke-run config change (no mobile specs yet — should show 0 tests for mobile projects):
pnpm exec playwright test --list --project="Mobile Chrome"
```

## Acceptance criteria

- [ ] `playwright.config.ts` lists 6 projects
- [ ] Desktop projects have `testIgnore: ['**/mobile_*.spec.ts']`
- [ ] Mobile projects have `testMatch: ['**/mobile_*.spec.ts']`
- [ ] `pnpm format && pnpm lint && pnpm typecheck` pass
