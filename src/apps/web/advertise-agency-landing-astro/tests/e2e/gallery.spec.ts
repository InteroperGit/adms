// Browser contracts for the project gallery dialog and focus return.
import { expect, test } from './fixtures';

test('gallery navigation wraps and returns focus to the main image', async ({
  page,
}) => {
  await page.goto('/projects/1/');
  const gallery = page.locator('[data-gallery]');
  const dialog = gallery.locator('[data-gallery-dialog]');
  const image = gallery.locator('[data-gallery-image]');

  await gallery.locator('[data-gallery-main]').click();
  await expect(dialog).toBeVisible();
  await gallery.locator('[data-gallery-next]').click();
  await expect(image).toHaveAttribute('alt', 'Two');
  await gallery.locator('[data-gallery-previous]').click();
  await expect(image).toHaveAttribute('alt', 'One');
  await gallery.locator('[data-gallery-previous]').click();
  await expect(image).toHaveAttribute('alt', 'Two');
  await expect(dialog.locator('[data-gallery-lightbox-thumb="1"]'))
    .toHaveAttribute('aria-current', 'true');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(gallery.locator('[data-gallery-main]')).toBeFocused();
});

test('second external thumbnail opens and restores its focus', async ({
  page,
}) => {
  await page.goto('/projects/1/');
  const gallery = page.locator('[data-gallery]');
  const thumbnail = gallery.locator('[data-gallery-open="1"]');
  const dialog = gallery.locator('[data-gallery-dialog]');

  await thumbnail.click();
  await expect(dialog).toBeVisible();
  await expect(gallery.locator('[data-gallery-image]'))
    .toHaveAttribute('alt', 'Two');
  await dialog.locator('[data-gallery-close]').click();
  await expect(dialog).toBeHidden();
  await expect(thumbnail).toBeFocused();
});

test('gallery keyboard controls keep focus inside the native dialog', async ({
  page,
}) => {
  await page.goto('/projects/1/');
  const gallery = page.locator('[data-gallery]');
  const dialog = gallery.locator('[data-gallery-dialog]');
  const image = gallery.locator('[data-gallery-image]');
  const lightboxThumbs = dialog.locator('[data-gallery-lightbox-thumb]');

  await gallery.locator('[data-gallery-main]').click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(image).toHaveAttribute('alt', 'Two');
  await page.keyboard.press('ArrowLeft');
  await expect(image).toHaveAttribute('alt', 'One');
  await lightboxThumbs.nth(1).click();
  await expect(lightboxThumbs.nth(1)).toHaveAttribute(
    'aria-current',
    'true',
  );
  await expect(lightboxThumbs.nth(0)).not.toHaveAttribute(
    'aria-current',
    'true',
  );

  await dialog.locator('[data-gallery-close]').focus();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.locator('[data-gallery-lightbox-thumb="1"]'))
    .toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.locator('[data-gallery-close]')).toBeFocused();
});

for (const scenario of [
  { name: 'desktop', viewport: { width: 1280, height: 800 } },
  { name: 'mobile reduced motion', viewport: { width: 375, height: 800 } },
]) {
  test(`gallery main path works at ${scenario.name}`, async ({ page }) => {
    await page.setViewportSize(scenario.viewport);
    if (scenario.name === 'mobile reduced motion') {
      await page.emulateMedia({ reducedMotion: 'reduce' });
    }
    await page.goto('/projects/1/');
    const gallery = page.locator('[data-gallery]');
    const dialog = gallery.locator('[data-gallery-dialog]');

    await gallery.locator('[data-gallery-main]').click();
    await expect(dialog).toBeVisible();
    await gallery.locator('[data-gallery-next]').click();
    await expect(gallery.locator('[data-gallery-image]'))
      .toHaveAttribute('alt', 'Two');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(gallery.locator('[data-gallery-main]')).toBeFocused();
  });
}
