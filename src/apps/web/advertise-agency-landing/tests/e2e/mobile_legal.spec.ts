import { test, expect } from '@playwright/test';

const legalRoutes = [
  { id: 'E10.1', route: '/privacy-policy', title: 'Privacy Policy' },
  { id: 'E10.3', route: '/user-agreement', title: 'User Agreement' },
  { id: 'E10.5', route: '/consent', title: 'Consent' },
];

test.describe('Mobile Legal Pages', () => {
  for (const { id, route } of legalRoutes) {
    test(`${id} ${route} renders h1 on mobile`, async ({ page }) => {
      await page.goto(route);
      const h1 = page.locator('main h1');
      await expect(h1).toBeVisible();
    });

    const overflowId = id === 'E10.1' ? 'E10.2' : id === 'E10.3' ? 'E10.4' : 'E10.6';
    test(`${overflowId} ${route} has no horizontal overflow`, async ({ page }) => {
      await page.goto(route);
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(overflow).toBe(false);
    });

    test(`E10.7 ${route} has site header with home link`, async ({ page }) => {
      await page.goto(route);
      const header = page.locator('header#main-nav');
      await expect(header).toBeVisible();
      const homeLink = header.locator('a[href="/"]');
      await expect(homeLink).toBeVisible();
    });

    test(`E10.8 ${route} version footer text visible`, async ({ page }) => {
      await page.goto(route);
      const footer = page.locator('main p').last();
      await expect(footer).toBeVisible();
      await expect(footer).toContainText('Версия');
    });

    test(`E10.9 ${route} text is readable (not truncated)`, async ({ page }) => {
      await page.goto(route);
      const isReadable = await page.evaluate(() => {
        const h1 = document.querySelector('main h1');
        const main = document.querySelector('main');
        if (!h1 || !main) {
          return false;
        }
        return h1.scrollWidth <= main.clientWidth;
      });
      expect(isReadable).toBe(true);
    });
  }
});
