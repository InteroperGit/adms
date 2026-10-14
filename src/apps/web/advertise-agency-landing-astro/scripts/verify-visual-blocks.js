// Playwright CLI run-code file; see docs/site/content-block-visual-matrix.md.
async (page) => {
  const origin = 'http://127.0.0.1:54382';
  const output = 'output/playwright/vcb-02';
  const records = [];
  const errors = [];
  // Fixed site navigation must not obscure the isolated article capture.
  const capture = { style: 'header { visibility: hidden !important; }',
    animations: 'disabled' };
  const check = (value, message) => {
    if (!value) throw new Error(message);
  };
  page.on('pageerror', (error) => errors.push(error.message));
  // Isolate block evidence from unrelated remote header/footer assets.
  await page.route('https://**/*', (route) => route.fulfill({ body: '' }));
  await page.addInitScript(() => {
    localStorage.setItem('cookieConsent', 'accepted');
  });
  for (const width of [320, 768, 1440]) {
    for (const theme of ['light', 'dark']) {
      for (const variant of ['long', 'optional', 'form', 'demo']) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(`${origin}/__visual-check/${variant}/`);
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value;
        }, theme);
        const article = page.locator('[data-visual-fixture]');
        check(await article.locator('[data-block-type]').count() === 10,
          `${variant}: missing block types`);
        check(await article.locator('[data-block-type]').evaluateAll((nodes) =>
          new Set(nodes.map((node) => node.dataset.blockType)).size) === 10,
        `${variant}: duplicate block type`);
        check(await article.locator('form').count()
          === Number(variant === 'form'), `${variant}: wrong form gate`);
        check(await page.evaluate(() =>
          document.documentElement.scrollWidth <= innerWidth),
        `${variant}/${width}/${theme}: document overflow`);
        // Scroll lazy media into view before capturing representative output.
        for (const image of await article.locator('img').all()) {
          if (await image.isVisible()) {
            await image.scrollIntoViewIfNeeded();
            await image.evaluate((node) => node.decode());
          }
        }
        const id = `${variant}-${width}-${theme}`;
        await article.screenshot({ ...capture, path: `${output}/${id}.png` });
        records.push({ id, blocks: 10, overflow: false });
      }
      // Text-only enlargement keeps the viewport unchanged.
      await page.goto(`${origin}/__visual-check/long/`);
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
        document.documentElement.style.fontSize = '200%';
      }, theme);
      check(await page.evaluate(() =>
        document.documentElement.scrollWidth <= innerWidth),
      `200%/${width}/${theme}: document overflow`);
      await page.locator('[data-visual-fixture]').screenshot({
        ...capture,
        path: `${output}/text-200-${width}-${theme}.png`,
      });
      records.push({ id: `text-200-${width}-${theme}`, overflow: false });
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${origin}/__visual-check/long/`);
  check(await page.evaluate(() =>
    matchMedia('(prefers-reduced-motion: reduce)').matches),
  'Reduced motion preference not applied');
  // Reach the gallery with actual Tab navigation, then test modal return.
  const main = page.locator('[data-gallery-main]');
  await page.evaluate(() => document.activeElement?.blur());
  let reached = false;
  for (let index = 0; index < 100; index++) {
    await page.keyboard.press('Tab');
    reached = await main.evaluate((node) => node === document.activeElement);
    if (reached) break;
  }
  check(reached, 'Gallery cannot be reached by Tab');
  const focus = await main.evaluate((node) => {
    const style = getComputedStyle(node);
    return { outline: style.outlineStyle, shadow: style.boxShadow };
  });
  check(focus.outline !== 'none' || focus.shadow !== 'none',
    'Gallery keyboard focus has no visible indicator');
  await page.keyboard.press('Enter');
  await page.locator('dialog[open]').waitFor();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Escape');
  check(await main.evaluate((node) => node === document.activeElement),
    'Gallery did not restore keyboard focus');
  await page.locator('[data-visual-fixture]').screenshot({
    ...capture,
    path: `${output}/reduced-motion-keyboard.png`,
  });
  // Native fallback uses fresh contexts; no scripts or stored theme can run.
  for (const width of [320, 768, 1440]) {
    for (const theme of ['light', 'dark']) {
      const context = await page.context().browser().newContext({
        javaScriptEnabled: false, colorScheme: theme,
        viewport: { width, height: 1000 },
      });
      const native = await context.newPage();
      await native.route('https://**/*', (route) =>
        route.fulfill({ body: '' }));
      await native.goto(`${origin}/__visual-check/optional/`);
      check(await native.locator('.content-chart__bar-row').count() === 3,
        'No-JS chart data missing');
      check(await native.evaluate(() =>
        document.documentElement.scrollWidth <= innerWidth),
      `No-JS/${width}/${theme}: document overflow`);
      const href = await native.locator('[data-gallery-main]')
        .getAttribute('href');
      check((await native.request.get(origin + href)).ok(),
        'No-JS full image is unavailable');
      check(await native.locator('a[href="/#order-inquiry"]').count() > 0,
        'No-JS inquiry fallback missing');
      await native.locator('[data-visual-fixture]').screenshot({
        ...capture,
        path: `${output}/no-js-${width}-${theme}.png`,
      });
      records.push({ id: `no-js-${width}-${theme}`, fallback: true });
      await context.close();
    }
  }
  check(errors.length === 0, `Browser errors: ${errors.join(', ')}`);
  return { records, keyboard: true, reducedMotion: true, errors };
}
