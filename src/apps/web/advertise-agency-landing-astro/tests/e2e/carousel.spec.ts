// Browser contracts for manual carousel controls and reduced motion.
import { expect, test } from './fixtures';

test('manual controls select and announce slides', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-cookie-choice="declined"]').click();

  const carousel = page.locator('#offers-carousel');
  const slides = carousel.locator('.carousel-slide');
  const dots = carousel.locator('.carousel-dot');
  const status = carousel.locator('[role="status"]');

  await expect(slides).toHaveCount(3);
  await expect(carousel.locator('.carousel-controls')).toBeVisible();
  await expect(carousel.locator('.carousel-slide:not([aria-hidden])'))
    .toHaveCount(1);
  await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true');

  await carousel.locator('[data-direction="1"]').focus();
  await page.keyboard.press('Enter');
  await expect(slides.nth(1)).not.toHaveAttribute('aria-hidden', 'true');
  await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
  await expect(status).toContainText('2 из 3');

  await carousel.locator('[data-direction="-1"]').click();
  await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true');
  await expect(status).toContainText('1 из 3');

  await carousel.locator('[data-direction="-1"]').click();
  await expect(dots.nth(2)).toHaveAttribute('aria-current', 'true');
  await expect(status).toContainText('3 из 3');

  await dots.nth(1).click();
  await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
  await expect(status).toContainText('2 из 3');

  await expect(
    carousel.locator('.carousel-dot[aria-current="true"]'),
  ).toHaveCount(1);
  await expect(
    carousel.locator('.carousel-slide[aria-hidden="true"]'),
  ).toHaveCount(2);
  for (const index of [0, 2]) {
    await expect(slides.nth(index)).toHaveJSProperty('inert', true);
  }
});

test('hidden slide links are excluded from keyboard navigation', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('[data-cookie-choice="declined"]').click();

  const carousel = page.locator('#offers-carousel');
  const hiddenLinks = carousel.locator(
    '.carousel-slide[aria-hidden="true"] .carousel-link',
  );

  await expect(hiddenLinks).toHaveCount(2);
  await carousel.locator('[data-direction="-1"]').focus();

  // Tab through every control and the active CTA to test native inert behavior.
  for (let step = 0; step < 5; step += 1) {
    await page.keyboard.press('Tab');
    await expect(
      carousel.locator(
        '.carousel-slide[aria-hidden="true"] .carousel-link:focus',
      ),
    ).toHaveCount(0);
  }
  await expect(
    carousel.locator('.carousel-slide:not([aria-hidden]) .carousel-link'),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(
    carousel.locator(
      '.carousel-slide[aria-hidden="true"] .carousel-link:focus',
    ),
  ).toHaveCount(0);
});

test('reduced motion retains usable manual carousel controls', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('[data-cookie-choice="declined"]').click();

  const carousel = page.locator('#offers-carousel');
  const slides = carousel.locator('.carousel-slide');

  await expect(slides).toHaveCount(3);
  await expect(carousel.locator('.carousel-controls')).toBeVisible();
  await expect(carousel.locator('.carousel-slide:not([aria-hidden])'))
    .toHaveCount(1);
  await carousel.locator('[data-direction="1"]').focus();
  await page.keyboard.press('Enter');
  await expect(carousel.locator('.carousel-dot[aria-current="true"]'))
    .toHaveAttribute('data-index', '1');
});
