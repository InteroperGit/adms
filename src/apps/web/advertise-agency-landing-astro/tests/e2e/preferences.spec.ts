// Browser contracts for cookie consent and theme persistence.
import { expect, test } from './fixtures';

test('accepted cookie consent persists across reload and navigation', async ({
  page,
}) => {
  await page.goto('/');
  const banner = page.locator('#cookie-banner');
  await expect(banner).toBeVisible();
  await banner.locator('[data-cookie-choice="accepted"]').click();
  await expect(banner).toBeHidden();
  await expect(
    page.evaluate(() => localStorage.getItem('cookieConsent')),
  ).resolves.toBe('accepted');
  await page.reload();
  await expect(banner).toBeHidden();
  await page.goto('/projects/');
  await expect(page.locator('#cookie-banner')).toBeHidden();
});

test('declined cookie consent persists across reload and navigation', async ({
  page,
}) => {
  await page.goto('/');
  const banner = page.locator('#cookie-banner');
  await expect(banner).toBeVisible();
  await banner.locator('[data-cookie-choice="declined"]').click();
  await expect(banner).toBeHidden();
  await expect(
    page.evaluate(() => localStorage.getItem('cookieConsent')),
  ).resolves.toBe('declined');
  await page.reload();
  await expect(banner).toBeHidden();
  await page.goto('/projects/');
  await expect(page.locator('#cookie-banner')).toBeHidden();
});

test('cookie banner and theme work when storage is blocked', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const blocked = () => {
      throw new DOMException('Storage is unavailable', 'SecurityError');
    };
    Storage.prototype.getItem = blocked;
    Storage.prototype.setItem = blocked;
  });
  await page.goto('/');
  const banner = page.locator('#cookie-banner');
  await expect(banner).toBeVisible();
  await banner.locator('[data-cookie-choice="declined"]').click();
  await expect(banner).toBeHidden();
  await page.locator('[data-settings-trigger]').click();
  await page.locator('[data-theme-radio][value="dark"]').check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('explicit light and dark choices persist after reload', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('[data-cookie-choice="declined"]').click();
  await page.locator('[data-settings-trigger]').click();
  await page.locator('[data-theme-radio][value="light"]').check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.locator('[data-settings-trigger]').click();
  await page.locator('[data-theme-radio][value="dark"]').check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('system theme follows media changes until an explicit choice', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await page.locator('[data-cookie-choice="declined"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-settings-trigger]').click();
  await page.locator('[data-theme-radio][value="light"]').check();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('theme choice synchronizes across two pages in one context', async ({
  page,
  context,
}) => {
  const secondPage = await context.newPage();
  await page.goto('/');
  await secondPage.goto('/');
  await page.locator('[data-cookie-choice="declined"]').click();
  await secondPage.locator('[data-cookie-choice="declined"]').click();
  await page.locator('[data-settings-trigger]').click();
  await page.locator('[data-theme-radio][value="dark"]').check();
  await expect(secondPage.locator('html')).toHaveAttribute(
    'data-theme',
    'dark',
  );
  await secondPage.close();
});
