// Browser contracts for responsive routes and failed image geometry.
import { expect, test } from './fixtures';

const routes = ['/', '/projects/', '/projects/1/', '/services/neon/'];
const widths = [320, 375, 1440];
const themes = ['light', 'dark'] as const;

for (const route of routes) {
  for (const width of widths) {
    for (const colorScheme of themes) {
      test(`${route} at ${width}px ${colorScheme}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.emulateMedia({
          colorScheme,
          reducedMotion: 'reduce',
        });
        await page.goto(route);

        if (route === '/') {
          const banner = page.locator('#cookie-banner');
          if (await banner.isVisible()) {
            await banner.locator('[data-cookie-choice="declined"]')
              .click();
          }
        }

        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('main h1')).toHaveCount(1);
        await expect.poll(() => page.evaluate(() =>
          document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        )).toBe(true);

        const footer = page.locator('footer');
        await footer.scrollIntoViewIfNeeded();
        await expect(footer).toBeVisible();
      });
    }
  }
}

test('failed service image preserves loaded geometry', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.emulateMedia({
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  await page.route('**/favicon.svg', (route) => route.abort());
  await page.goto('/services/neon/');

  const image = page.locator(
    '.service-reading img[alt]:not([alt=""])',
  ).first();
  await expect(image).toHaveJSProperty('complete', true);
  await expect(image).toHaveJSProperty('naturalWidth', 0);
  const failedBox = await image.boundingBox();
  if (!failedBox) throw new Error('Failed image has no layout box');
  expect(failedBox.width).toBeGreaterThan(0);
  expect(failedBox.height).toBeGreaterThan(0);
  expect(failedBox.x).toBeGreaterThanOrEqual(-1);
  expect(failedBox.x + failedBox.width).toBeLessThanOrEqual(376);

  const cleanPage = await page.context().newPage();
  await cleanPage.setViewportSize({ width: 375, height: 800 });
  await cleanPage.emulateMedia({
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  await cleanPage.goto('/services/neon/');
  const cleanImage = cleanPage.locator(
    '.service-reading img[alt]:not([alt=""])',
  ).first();
  await expect(cleanImage).toHaveJSProperty('complete', true);
  await expect.poll(() => cleanImage.evaluate(
    (element) => (element as HTMLImageElement).naturalWidth,
  )).toBeGreaterThan(0);
  const cleanBox = await cleanImage.boundingBox();
  if (!cleanBox) throw new Error('Loaded image has no layout box');
  expect(cleanBox.width).toBeGreaterThan(0);
  expect(cleanBox.height).toBeGreaterThan(0);
  expect(failedBox.width).toBeCloseTo(cleanBox.width, 0);
  expect(failedBox.height).toBeCloseTo(cleanBox.height, 0);
  await cleanPage.close();
});
