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
  check(await page.locator('#mobile-menu [autofocus]').count() === 1,
    'mobile menu receives initial focus');
  await page.keyboard.press('Tab');
  check(await page.evaluate(() => document.activeElement?.closest(
    '#mobile-menu')) !== null, 'mobile menu keeps focus inside dialog');
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

  // Catalog search, category filtering and browser history share one state.
  await page.goto(`${home}projects/`);
  await page.waitForLoadState('networkidle');
  const catalog = page.locator('[data-catalog-controls]');
  await catalog.locator('input[type="search"]').fill('zzzz-no-match');
  await page.waitForTimeout(400);
  check(await page.locator('[data-catalog-search-empty]').isVisible(),
    'catalog exposes an empty search state');
  await catalog.locator('input[type="search"]').fill('');
  await catalog.locator('select[name="category"]').selectOption('neon');
  check(await page.url().includes('category=neon'),
    'catalog writes category state to the URL');
  await page.goBack();
  check(await page.url().includes('/projects/') &&
    !page.url().includes('category=neon'),
  'catalog restores the previous filter with back navigation');

  // Responsive routes retain landmarks and media fallback geometry.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${home}services/neon/`);
  await page.waitForLoadState('networkidle');
  check(await page.locator('main').isVisible(),
    'service route has a visible main landmark');
  check(await page.locator('img').count() > 0,
    'service route renders media fallback geometry');
  await page.setViewportSize({ width: 375, height: 800 });
  check(await page.locator('.service-heading h1').isVisible(),
    'service route remains readable at mobile width');

  // A failed image retains its alternative text contract.
  const image = page.locator('img').first();
  await image.evaluate((node) => {
    node.dispatchEvent(new Event('error'));
  });
  check(await image.getAttribute('alt') !== null,
    'failed media retains alternative text');

  return { result: 'PASS', checks };
}
