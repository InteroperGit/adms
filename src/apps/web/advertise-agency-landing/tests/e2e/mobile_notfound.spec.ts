import { test, expect } from '@playwright/test';

test.describe('Mobile NotFound Page', () => {
  test('E11.1 /404 renders h1 with aria-label="Error …"', async ({ page }) => {
    await page.goto('/404', { waitUntil: 'domcontentloaded' });
    const h1 = page.locator('h1').filter({ hasText: '404' });
    await expect(h1).toBeVisible();
  });

  test('E11.2 No horizontal overflow from giant heading', async ({ page }) => {
    await page.goto('/404', { waitUntil: 'domcontentloaded' });
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasOverflow).toBe(false);
  });

  test('E11.3 Error title h2 visible on mobile', async ({ page }) => {
    await page.goto('/404', { waitUntil: 'domcontentloaded' });
    const h2 = page.locator('h2').first();
    await expect(h2).toBeVisible();
  });

  test('E11.4 Error description p visible', async ({ page }) => {
    await page.goto('/404', { waitUntil: 'domcontentloaded' });
    const p = page.locator('p').nth(1);
    await expect(p).toBeVisible();
  });

  test('E11.5 Back link visible and tappable', async ({ page }) => {
    await page.goto('/404', { waitUntil: 'domcontentloaded' });
    const backLink = page.locator('a').filter({ hasText: /На главную/ }).first();
    await expect(backLink).toBeVisible();
    await expect(backLink).toBeInViewport();
  });
});
