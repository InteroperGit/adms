// Exercise native modal containment and touch controls with 1, 2 and 7 images.
async (page) => {
  const origin = 'http://127.0.0.1:54382';
  const check = (value, message) => {
    if (!value) throw new Error(message);
  };
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const records = [];
  for (const [name, count] of [
    ['gallery-one', 1], ['demo-project', 2], ['gallery-many', 7],
  ]) {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${origin}/__article-check/${name}/mdx/`);
    const main = page.locator('[data-gallery-main]');
    await main.hover();
    await main.focus();
    await page.keyboard.press('Enter');
    const dialog = page.locator('dialog[open]');
    await dialog.waitFor();
    check(await page.evaluate(() => document.body.style.overflow === 'hidden'),
      `${name}: scroll not locked`);
    check(await dialog.locator('[data-gallery-next]').isVisible()
      === (count > 1), `${name}: single-image arrows`);
    // Tab traversal includes a browser focus sentinel on wrap, but cannot
    // focus background controls while a native modal is open.
    for (let index = 0; index < count + 6; index++) {
      await page.keyboard.press('Tab');
      check(await page.evaluate(() => document.activeElement === document.body
        || document.querySelector('dialog[open]')
          .contains(document.activeElement)), `${name}: focus escaped`);
    }
    await dialog.locator('[data-gallery-close]').focus();
    if (count > 1) {
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction((total) => document.querySelector(
        '[data-gallery-announcement]',
      ).textContent === `Изображение 2 из ${total}`, count);
      check(await dialog.locator('[data-gallery-announcement]').textContent()
        === `Изображение 2 из ${count}`, `${name}: next failed`);
      await dialog.locator(`[data-gallery-lightbox-thumb="${count - 1}"]`)
        .click();
      check(await dialog.locator('[data-gallery-announcement]').textContent()
        === `Изображение ${count} из ${count}`, `${name}: dots failed`);
      await page.keyboard.press('ArrowLeft');
    }
    await page.keyboard.press('Escape');
    check(await main.evaluate((node) => node === document.activeElement),
      `${name}: focus return failed`);
    check(await page.evaluate(() => document.body.style.overflow !== 'hidden'),
      `${name}: scroll still locked`);
    await main.click();
    // Click a real backdrop point outside the dialog's centered rectangle.
    await page.mouse.click(1, 1);
    await page.waitForFunction(() => !document.querySelector('dialog').open);
    records.push({ name, count, keyboard: true, backdrop: true });
  }
  const touch = await page.context().browser().newContext({
    hasTouch: true, isMobile: true, viewport: { width: 375, height: 812 },
    reducedMotion: 'reduce',
  });
  const tab = await touch.newPage();
  await tab.goto(`${origin}/__article-check/gallery-many/json/`);
  await tab.locator('[data-gallery-main]').tap();
  await tab.locator('[data-gallery-next]').tap();
  await tab.waitForFunction(() => document.querySelector(
    '[data-gallery-announcement]',
  ).textContent === 'Изображение 2 из 7');
  check(await tab.locator('[data-gallery-announcement]').textContent()
    === 'Изображение 2 из 7', 'Touch next failed');
  const motion = await tab.locator('[data-gallery-image]').evaluate((node) =>
    getComputedStyle(node).animationDuration);
  check(motion.split(',').every((value) => parseFloat(value) <= 0.01),
    `Reduced-motion animation: ${motion}`);
  await tab.locator('[data-gallery-close]').tap();
  // Real Chromium page-scale zoom, separate from CSS zoom/reflow.
  const cdp = await touch.newCDPSession(tab);
  await cdp.send('Emulation.setPageScaleFactor', { pageScaleFactor: 2 });
  check(await tab.evaluate(() => visualViewport.scale) === 2,
    '200% zoom did not apply');
  await tab.locator('[data-gallery-main]').tap();
  await tab.locator('dialog[open]').waitFor();
  await tab.screenshot({ path: 'output/playwright/task-082/zoom-modal.png' });
  await tab.keyboard.press('Escape');
  await tab.waitForFunction(() => !document.querySelector('dialog').open);
  await tab.screenshot({ path: 'output/playwright/task-082/touch-zoom.png' });
  await touch.close();
  check(!errors.length, errors.join('; '));
  return { records, touch: true, zoom: 2, reducedMotion: motion, errors };
}
