// Browser contracts for the project gallery dialog and focus return.
import { expect, test } from './fixtures';

test('gallery opens, advances and returns keyboard focus', async ({ page }) => {
  await page.goto('/projects/1/');
  const gallery = page.locator('[data-gallery]');
  await gallery.locator('[data-gallery-main]').click();
  const dialog = gallery.locator('[data-gallery-dialog]');
  await expect(dialog).toBeVisible();
  await gallery.locator('[data-gallery-next]').click();
  await expect(gallery.locator('[data-gallery-image]')).toHaveAttribute(
    'alt',
    'Two',
  );
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(gallery.locator('[data-gallery-main]')).toBeFocused();
});
