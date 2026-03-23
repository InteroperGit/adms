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
