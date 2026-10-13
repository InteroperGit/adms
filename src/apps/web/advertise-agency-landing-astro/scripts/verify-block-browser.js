// Run with Playwright CLI --filename against the isolated task-081 build.
async (page) => {
  const origin = 'http://127.0.0.1:4322';
  const check = (value, message) => {
    if (!value) throw new Error(message);
  };
  const errors = [];
  const requests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('request', (request) => requests.push(request.url()));
  // External demo availability is checked separately from application errors.
  // Deterministically block third-party CSS/media; bundled media stays real.
  await page.route('https://**/*', (route) => {
    if (route.request().resourceType() === 'image') {
      return route.fulfill({ contentType: 'image/svg+xml', body:
        '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"/>' });
    }
    return route.fulfill({ contentType: 'text/css', body: '' });
  });
  await page.addInitScript(() => {
    localStorage.setItem('cookieConsent', 'accepted');
    window.__articleCLS = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__articleCLS += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  const records = [];
  for (const route of ['/projects/2/', '/services/svetovye-bukvy/',
    '/__article-check/minimal/json/']) {
    requests.length = 0;
    await page.goto(origin + route);
    await page.evaluate(() => new Promise((done) =>
      requestAnimationFrame(() => requestAnimationFrame(done))));
    check(!requests.some((url) => url.includes('chart-runtime')),
      `${route}: ECharts loaded without chart`);
    records.push({ route, echartsRequests: 0 });
  }
  for (const name of ['published-project', 'published-service', 'demo-project',
    'demo-service', 'block-policy', 'minimal']) {
    for (const width of [375, 1366]) {
      await page.setViewportSize({ width, height: 768 });
      const markup = [];
      for (const format of ['mdx', 'json']) {
        await page.goto(`${origin}/__article-check/${name}/${format}/`);
        const info = await page.evaluate(() => {
          const article = document.querySelector('article');
          const blocks = [...article.querySelectorAll('[data-block-type]')];
          const eager = article.querySelectorAll('img[loading="eager"]');
          return {
            lang: document.documentElement.lang,
            overflow: document.documentElement.scrollWidth > innerWidth,
            types: [...new Set(blocks.map((node) => node.dataset.blockType))],
            eager: eager.length,
            copy: article.textContent,
            images: [...article.querySelectorAll('img')].map((image) => ({
              alt: image.alt, width: image.getAttribute('width'),
              height: image.getAttribute('height'),
            })),
            robots: document.querySelector('meta[name="robots"]')?.content,
            canonical: document.querySelector('link[rel="canonical"]')?.href,
          };
        });
        check(info.lang === 'ru' && !info.overflow, `${name}: layout/lang`);
        check(info.eager === Number(name !== 'minimal'),
          `${name}: expected one eager lead image`);
        check(info.canonical.startsWith('https://task-081.invalid/'),
          `${name}: canonical fixture origin`);
        const published = name.startsWith('published-');
        check(published ? !info.robots : info.robots === 'noindex, follow',
          `${name}: robots publication gate`);
        if (name !== 'minimal') {
          check(info.types.length === 10, `${name}: missing block type`);
          check(await page.locator('.content-footnote a[href="#intro"]')
            .count() === 1, `${name}: footnote link`);
          check(await page.locator('.content-chart__table caption')
            .textContent()
            === 'Данные графика', `${name}: chart caption language`);
          check(await page.locator('.content-chart__table th').first()
            .textContent() === 'Показатель', `${name}: chart heading language`);
          check(await page.locator('[data-gallery-dialog]').getAttribute(
            'aria-label') === 'Галерея изображений', `${name}: gallery name`);
          check(await page.locator('form[data-led-letters]').count()
            === Number(published), `${name}: form owner gate`);
        }
        if (name === 'block-policy') {
          check(!info.copy.includes('DRAFT_BLOCK_MUST_NOT_RENDER'),
            'Draft copy leaked');
          check(!info.images.some((image) =>
            image.alt === 'DRAFT_IMAGE_MUST_NOT_RENDER'), 'Draft image leaked');
          check(await page.locator('.block-demo-notice').count() === 1,
            'Demo disclosure absent');
        }
        records.push({ name, format, width, passed: true });
        const rendered = await page.locator('.content-blocks')
          .evaluate((element) => {
            const copy = element.cloneNode(true);
            copy.querySelectorAll('[data-chart]').forEach((chart) => {
              chart.replaceChildren();
              chart.removeAttribute('_echarts_instance_');
              chart.removeAttribute('style');
            });
            return copy.outerHTML;
          });
        markup.push(rendered);
      }
      check(markup[0] === markup[1], `${name}/${width}: MDX/JSON DOM parity`);
    }
  }
  await page.goto(`${origin}/__article-check/demo-project/json/`);
  await page.locator('[data-chart]').scrollIntoViewIfNeeded();
  await page.locator('[data-chart] canvas').waitFor();
  // Back/Forward cache must not dispose a canvas on its persisted pagehide.
  await page.evaluate(() => window.dispatchEvent(
    new PageTransitionEvent('pagehide', { persisted: true }),
  ));
  check(await page.locator('[data-chart] canvas').count() > 0,
    'Persisted pagehide disposed chart canvas');
  check(requests.some((url) => url.includes('chart-runtime')),
    'Visible chart never loaded ECharts');
  const main = page.locator('[data-gallery-main]').first();
  await main.click();
  await page.locator('dialog[open]').waitFor();
  await page.keyboard.press('ArrowRight');
  check(await page.locator('[data-gallery-announcement]').textContent()
    === 'Изображение 2 из 2', 'Gallery announcement language/state');
  await page.keyboard.press('Escape');
  check(await main.evaluate((element) => element === document.activeElement),
    'Gallery focus return failed');
  await page.screenshot({ path: 'output/playwright/task-081/blocks.png',
    fullPage: true });
  await page.goto(`${origin}/projects/2/`);
  const geometry = await page.locator('.image-gallery-block').first()
    .evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const parent = element.parentElement.getBoundingClientRect();
      return { fraction: rect.width / parent.width,
        centerOffset: rect.left + rect.width / 2
          - parent.left - parent.width / 2 };
    });
  check(Math.abs(geometry.fraction - 0.75) < 0.001
    && Math.abs(geometry.centerOffset) < 1, 'Gallery width/centering changed');
  const cls = await page.evaluate(() => window.__articleCLS);
  check(cls < 0.1, `Article CLS ${cls} exceeds threshold`);
  check(errors.length === 0, `Browser errors: ${errors.join('; ')}`);
  const noJS = await page.context().browser().newContext({
    javaScriptEnabled: false,
  });
  const native = await noJS.newPage();
  await native.goto(`${origin}/__article-check/demo-project/json/`);
  check(await native.locator('.content-chart__table tbody tr').count() > 0,
    'No-JS chart fallback missing');
  const media = await native.locator('[data-gallery-main]')
    .getAttribute('href');
  check((await native.request.get(origin + media)).ok(),
    'No-JS native gallery resource broken');
  await noJS.close();
  return { records, chartLazy: true, gallery: geometry, cls,
    noJS: true, pageErrors: errors };
}
