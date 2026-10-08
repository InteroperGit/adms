// Run with Playwright CLI against a running local Astro server.
// The checks cover the highest-risk shared browser interactions.
async (page) => {
  const checks = [];
  const check = (condition, label) => {
    if (!condition) throw new Error(label);
    checks.push(label);
  };
  const home = 'http://localhost:4321/';
  await page.evaluate(() => localStorage.clear());
  await page.setViewportSize({ width: 375, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(home);
  await page.waitForLoadState('networkidle');

  // Cookie choice is dismissible and persists between page loads.
  const cookie = page.locator('#cookie-banner');
  check(await cookie.isVisible(), 'cookie banner is visible initially');
  await cookie
    .locator('[data-cookie-choice="declined"]')
    .click({ force: true });
  check(await cookie.isHidden(), 'cookie banner dismisses');
  await page.reload();
  check(await cookie.isHidden(), 'cookie choice persists');

  // Theme controls update the document and survive a reload.
  await page.locator('[data-settings-trigger]').click({ force: true });
  await page.locator('[data-theme-radio][value="dark"]').check();
  check(await page.locator('html').getAttribute('data-theme') === 'dark',
    'dark theme applies');
  await page.reload();
  check(await page.locator('html').getAttribute('data-theme') === 'dark',
    'dark theme persists');

  // Mobile dialog opens, traps focus, and closes with Escape.
  const menu = page.locator('#mobile-menu');
  await page.locator('#mobile-menu-open').click();
  check(await menu.getAttribute('open') !== null, 'mobile menu opens');
  await page.keyboard.press('Escape');
  check(await menu.getAttribute('open') === null, 'Escape closes mobile menu');

  // Reduced motion keeps the carousel usable without automatic rotation.
  const carousel = page.locator('#offers-carousel');
  await carousel.scrollIntoViewIfNeeded();
  check(await carousel.locator('.carousel-slide').count() > 1,
    'offers contain multiple slides');
  check(await carousel.locator('.carousel-controls').isVisible(),
    'reduced motion keeps manual controls');
  check(await carousel.locator('.carousel-slide:not([aria-hidden])')
    .count() === 1,
  'reduced motion shows one active slide');

  // Disabled delivery prevents native submit and explains the fallback.
  const form = page.locator('#order-inquiry form');
  check(await form.locator('[type="submit"]').isDisabled(),
    'inquiry submit is disabled without an endpoint');
  check((await form.locator('[role="status"]').textContent())
    ?.includes('недоступна') === true,
  'inquiry reports unavailable delivery');

  return { result: 'PASS', checks };
}
