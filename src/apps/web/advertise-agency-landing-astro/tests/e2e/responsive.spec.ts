// Browser contracts for responsive service rendering and failed media.
import { expect, test } from './fixtures';

test('responsive service route retains landmark and media geometry', async ({
  page,
}) => {
  await page.route('**/favicon.svg', (route) => route.abort());
  await page.goto('/services/neon/');
  await expect(page.locator('main')).toBeVisible();
  await page.setViewportSize({ width: 375, height: 800 });
  await expect(page.locator('.service-heading h1')).toBeVisible();
  const image = page.locator('main img[alt]:not([alt=""])').first();
  await expect(image).toHaveAttribute('alt', /.+/);
  await expect(image).toHaveAttribute('width', /\d+/);
  await expect(image).toHaveAttribute('height', /\d+/);
});
