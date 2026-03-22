import { test, expect } from '@playwright/test';

test.describe('dark mode', () => {
  test.beforeEach(async ({ page }) => {
    // Start with a clean localStorage so system preference doesn't interfere.
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('theme-mode'));
    // Reload so the app initialises without any stored preference.
    await page.reload();
  });

  test('E3.1 page loads without .dark class on <html> by default', async ({
    page,
  }) => {
    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDark).toBe(false);
  });

  test('E3.2 clicking the dark mode toggle adds .dark to <html>', async ({
    page,
  }) => {
    // The toggle aria-label is "Тёмный режим" when currently in light mode.
    const toggle = page.getByRole('button', { name: 'Тёмный режим' });
    await expect(toggle).toBeVisible();
    await toggle.click();

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDark).toBe(true);
  });

  test('E3.3 after toggle, reloading the page keeps .dark (localStorage persistence)', async ({
    page,
  }) => {
    const toggle = page.getByRole('button', { name: 'Тёмный режим' });
    await toggle.click();

    // Confirm .dark was applied before reloading.
    await expect(
      page.locator('html.dark')
    ).toBeAttached();

    await page.reload();

    const isDarkAfterReload = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDarkAfterReload).toBe(true);
  });

  test('E3.4 clicking toggle again removes .dark', async ({ page }) => {
    // Enable dark mode first.
    const toDarkToggle = page.getByRole('button', { name: 'Тёмный режим' });
    await toDarkToggle.click();

    // Now in dark mode — the aria-label switches to "Светлый режим".
    const toLightToggle = page.getByRole('button', { name: 'Светлый режим' });
    await expect(toLightToggle).toBeVisible();
    await toLightToggle.click();

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    );
    expect(isDark).toBe(false);
  });
});
