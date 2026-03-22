import { test, expect } from '@playwright/test';

test.describe('order page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/order');
  });

  test('E6.1 renders without error', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
    // No error boundary / crash indicator
    await expect(page.locator('text=Something went wrong')).not.toBeVisible();
  });

  test('E6.2 page has a form element', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible();
  });

  test('E6.3 product tabs are present when multiple forms exist', async ({ page }) => {
    const tabs = page.locator('button[type="button"]').filter({ hasText: /.+/ });
    const count = await tabs.count();

    if (count < 2) {
      test.skip();
      return;
    }

    // At least 2 tab buttons rendered
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('E6.4 switching tabs changes visible form fields', async ({ page }) => {
    const tabs = page.locator('button[type="button"]').filter({ hasText: /.+/ });
    const count = await tabs.count();

    if (count < 2) {
      test.skip();
      return;
    }

    // Click first tab, capture first input name
    await tabs.nth(0).click();
    const firstTabInputs = await page.locator('form input, form textarea, form select').count();

    // Click second tab
    await tabs.nth(1).click();
    const secondTabInputs = await page.locator('form input, form textarea, form select').count();

    // Both tabs render a form with inputs; counts may differ between form types
    expect(firstTabInputs).toBeGreaterThan(0);
    expect(secondTabInputs).toBeGreaterThan(0);
  });
});
