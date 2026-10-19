// Browser contracts for manual carousel controls and reduced motion.
import { expect, test } from './fixtures';

test('reduced motion retains usable manual carousel controls', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('[data-cookie-choice="declined"]').click();
  const carousel = page.locator('#offers-carousel');
  await expect(carousel.locator('.carousel-slide')).toHaveCount(3);
  await expect(carousel.locator('.carousel-controls')).toBeVisible();
  await expect(
    carousel.locator('.carousel-slide:not([aria-hidden])'),
  ).toHaveCount(1);
  const active = carousel.locator('.carousel-slide:not([aria-hidden])');
  const before = await active.textContent();
  await carousel.hover();
  await carousel.locator('[data-direction="1"]').click();
  await expect(active).not.toHaveText(before ?? '');
});
