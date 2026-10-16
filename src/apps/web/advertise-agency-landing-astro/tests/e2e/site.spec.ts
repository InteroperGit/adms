// Browser contracts use actual built components and intercepted delivery.
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  // A test cannot accidentally contact a remote image, map or backend.
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    return url.hostname === '127.0.0.1' ? route.continue() : route.abort();
  });
});

test('cookie and theme persist; mobile menu contains keyboard focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const cookie = page.locator('#cookie-banner');
  await expect(cookie).toBeVisible();
  await cookie.locator('[data-cookie-choice="declined"]').click();
  await expect(cookie).toBeHidden();
  await page.reload();
  await expect(cookie).toBeHidden();
  await page.locator('[data-settings-trigger]').click();
  await page.locator('[data-theme-radio][value="dark"]').check();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#mobile-menu-open').click();
  const menu = page.locator('#mobile-menu');
  await expect(menu).toBeVisible();
  await expect(menu.locator('[autofocus]')).toBeFocused();
  const controls = menu.locator('a, button');
  await controls.last().focus();
  await page.keyboard.press('Tab');
  await expect
    .poll(() =>
      page.evaluate(() =>
        Boolean(document.activeElement?.closest('#mobile-menu')),
      ),
    )
    .toBe(true);
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(page.locator('#mobile-menu-open')).toBeFocused();
});

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

test('catalog search, filter, pagination and history share URL state', async ({
  page,
}) => {
  await page.goto('/projects/');
  const controls = page.locator('[data-catalog-controls]');
  const search = controls.locator('input[type="search"]');
  await search.fill('zzzz-no-match');
  await expect(page.locator('[data-catalog-search-empty]')).toBeVisible();
  await search.fill('');
  await controls.locator('select[name="category"]').selectOption('sample');
  await expect(page).toHaveURL(/category=sample/);
  await page.goBack();
  await expect(page).not.toHaveURL(/category=sample/);
  await page.goForward();
  await expect(page).toHaveURL(/category=sample/);
  await page.goto('/projects/page/2/');
  await expect(
    page.locator('[data-project-card]:visible [data-project-link]').first(),
  ).toHaveAttribute('href', '/projects/2/');
});

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

test(
  'responsive service route retains la' + 'ndmark and failed media geometry',
  async ({ page }) => {
    await page.route('**/favicon.svg', (route) => route.abort());
    await page.goto('/services/neon/');
    await expect(page.locator('main')).toBeVisible();
    await page.setViewportSize({ width: 375, height: 800 });
    await expect(page.locator('.service-heading h1')).toBeVisible();
    const image = page.locator('main img[alt]:not([alt=""])').first();
    await expect(image).toHaveAttribute('alt', /.+/);
    await expect(image).toHaveAttribute('width', /\d+/);
    await expect(image).toHaveAttribute('height', /\d+/);
  },
);

test(
  'no JavaScript retains navigation an' + 'd protects inquiry submission',
  async ({ browser, baseURL }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
    });
    const page = await context.newPage();
    try {
      await page.goto(`${baseURL}/projects/`);
      await page.locator('[data-project-link]').first().click();
      await expect(page).toHaveURL(/\/projects\/1\//);
      await expect(page.locator('main')).toBeVisible();
      await page.goto(`${baseURL}/`);
      await expect(
        page.locator('#order-inquiry [type="submit"]'),
      ).toBeDisabled();
      await expect(page.locator('#order-inquiry noscript')).toBeVisible();
    } finally {
      await context.close();
    }
  },
);

test(
  'inquiry rejects errors, preserves r' + 'etry ID and resets after receipt',
  async ({ page }) => {
    const requests: Record<string, string>[] = [];
    let accepted = false;
    await page.route('**/__fixture/inquiry', async (route) => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({
        status: accepted ? 200 : 503,
        json: accepted
          ? { accepted: true, receiptId: 'fixture-receipt' }
          : { accepted: false },
      });
    });
    await page.goto('/');
    const form = page.locator('#order-inquiry form');
    await form.locator('[name="name"]').fill('Synthetic visitor');
    await form.locator('[name="email"]').fill('visitor@example.test');
    await form.locator('[name="message"]').fill('Synthetic inquiry');
    await form.locator('[name="consent"]').check();
    const submit = form.locator('[type="submit"]');
    await submit.click();
    await expect(form.locator('[role="status"]')).toHaveText('TEST_FAILURE');
    await expect(form.locator('[name="name"]')).toHaveValue(
      'Synthetic visitor',
    );
    accepted = true;
    await submit.click();
    await expect(form.locator('[role="status"]')).toHaveText('TEST_SUCCESS');
    await expect(form.locator('[name="name"]')).toHaveValue('');
    expect(requests).toHaveLength(2);
    expect(requests[0].requestId).toBe(requests[1].requestId);
  },
);

test('unavailable delivery stays disabled and explains fallback', async ({
  page,
}) => {
  // Set the fixture branch before the actual page module initializes.
  await page.route('**/', async (route) => {
    const response = await route.fetch();
    const html = (await response.text()).replace(
      'data-enabled="true"',
      'data-enabled="false"',
    );
    await route.fulfill({ response, body: html });
  });
  await page.goto('/');
  const form = page.locator('#order-inquiry form');
  await expect(form.locator('[type="submit"]')).toBeDisabled();
  await form.evaluate((node) => (node as HTMLFormElement).requestSubmit());
  await expect(form.locator('[role="status"]')).toHaveText('TEST_UNAVAILABLE');
});
