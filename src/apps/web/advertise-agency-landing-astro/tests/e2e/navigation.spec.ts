// Browser contracts for mobile navigation and keyboard focus.
import { expect, test } from './fixtures';

test('mobile menu traps focus and returns it after Escape', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  await page.locator('[data-cookie-choice="declined"]').click();
  await page.locator('#mobile-menu-open').click();
  const menu = page.locator('#mobile-menu');
  const controls = menu.locator('a, button');
  await expect(menu).toBeVisible();
  await expect(menu.locator('[autofocus]')).toBeFocused();
  await controls.last().focus();
  await page.keyboard.press('Tab');
  await expect(controls.first()).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(controls.last()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(page.locator('#mobile-menu-open')).toBeFocused();
});

test('mobile menu close button and desktop resize close the dialog', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  await page.locator('[data-cookie-choice="declined"]').click();
  const opener = page.locator('#mobile-menu-open');
  const menu = page.locator('#mobile-menu');
  await opener.click();
  await menu.locator('[data-menu-close]').click();
  await expect(menu).toBeHidden();
  await opener.click();
  await expect(menu).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(menu).toBeHidden();
  await page.setViewportSize({ width: 375, height: 800 });
  await expect(opener).toBeVisible();
  await opener.click();
  await expect(menu).toBeVisible();
});

test('same-page menu hash links close and focus their sections', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  await page.locator('[data-cookie-choice="declined"]').click();
  await page.locator('#mobile-menu-open').click();
  await page.locator('#mobile-menu a[href="/#contacts"]').click();
  await expect(page).toHaveURL(/\/#contacts$/);
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await expect(page.locator('#contacts')).toBeFocused();
});

test('menu links navigate from a secondary page to home sections', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/projects/');
  await page.locator('[data-cookie-choice="declined"]').click();
  await page.locator('#mobile-menu-open').click();
  await page.locator('#mobile-menu a[href="/#order-inquiry"]').click();
  await expect(page).toHaveURL(/\/#order-inquiry$/);
  await expect(page.locator('#order-inquiry')).toBeVisible();
});

test('mobile menu preserves phone and messenger links', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  await page.locator('[data-cookie-choice="declined"]').click();
  await page.locator('#mobile-menu-open').click();
  const menu = page.locator('#mobile-menu');
  await expect(menu.locator('a[href^="tel:"]')).toHaveCount(1);
  await expect(menu.locator('a[href="https://max.ru/"]')).toHaveCount(1);
  await expect(menu.locator('a[href="/projects/"]')).toHaveCount(1);
  await expect(menu.locator('a[href="/#order-inquiry"]')).toHaveCount(1);
  await expect(menu.locator('a[href="/#contacts"]')).toHaveCount(1);
});
