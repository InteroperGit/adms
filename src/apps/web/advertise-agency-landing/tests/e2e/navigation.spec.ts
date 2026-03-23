import { test, expect } from '@playwright/test';

test.describe('navigation', () => {
  test('E2.1 header is present on the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header#main-nav')).toBeVisible();
  });

  test('E2.2 portfolio page link navigates to /portfolio', async ({ page }) => {
    await page.goto('/');
    // The Portfolio section renders a "view all" link to /portfolio.
    // Prefer that over the hash-only header nav link.
    const portfolioPageLink = page.locator('a[href="/portfolio"]').first();
    await expect(portfolioPageLink).toBeAttached();
    await portfolioPageLink.click();
    await expect(page).toHaveURL(/\/portfolio/);
  });

  test('E2.4 logo click returns to / from another route', async ({ page }) => {
    await page.goto('/portfolio');
    const logo = page.locator('header#main-nav a[href="/"]').first();
    await logo.click();
    await expect(page).toHaveURL(/^http:\/\/[^/]+\/$/);
  });

  // E2.5–E2.6: inline viewport guard (run on all 4 desktop browsers).
  // Full mobile device profile coverage for these scenarios → mobile_home.spec.ts (E7).
  test('E2.5 mobile: hamburger menu opens on narrow viewport', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const hamburger = page.locator('button[aria-expanded]');
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
  });

  test('E2.6 mobile: nav links visible after menu opens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const hamburger = page.locator('button[aria-expanded]');
    await hamburger.click();
    // Mobile drawer is the fixed div with z-40 (the menu, not the backdrop z-30)
    // Distinguish it from the backdrop by targeting the one containing a <nav>
    const mobileNavLinks = page.locator(
      'div[class*="fixed"][class*="z-40"] nav a'
    );
    await expect(mobileNavLinks.first()).toBeVisible();
    const count = await mobileNavLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('E2.7 skip-to-content link is in DOM and focused on first Tab', async ({
    page,
    browserName,
  }) => {
    await page.goto('/');

    // The link must exist in the DOM
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();

    // Safari does not focus anchor elements on Tab by default (OS setting).
    // Verify focus behaviour only on Chromium-based browsers and Firefox.
    if (browserName === 'webkit') {
      test.skip();
      return;
    }

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(
      () => document.activeElement?.getAttribute('href')
    );
    expect(focused).toBe('#main-content');
  });
});
