// Run with Playwright CLI against the CONTENT_ACCEPTANCE build on port 54382.
// This checks DOM parity, owner gates, article layouts and native fallbacks.
async (page) => {
  const origin = 'http://127.0.0.1:54382';
  const cases = [
    'published-project', 'demo-project', 'unknown-category', 'null-category',
    'mismatched-context', 'published-service', 'demo-service', 'no-owner',
    'minimal', 'block-policy',
  ];
  const records = [];
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  // Remote demo dependencies are controlled; emitted media remains real.
  await page.route('https://**/*', (route) => route.fulfill({
    contentType: route.request().resourceType() === 'image'
      ? 'image/svg+xml' : 'text/css',
    body: route.request().resourceType() === 'image'
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"/>'
      : '',
  }));
  await page.addInitScript(() => {
    localStorage.setItem('cookieConsent', 'accepted');
  });
  const check = (value, message) => {
    if (!value) throw new Error(message);
  };
  for (const name of cases) {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const markup = [];
      for (const format of ['mdx', 'json']) {
        await page.goto(`${origin}/__article-check/${name}/${format}/`);
        const data = await page.evaluate(() => {
          const article = document.querySelector('[data-article-fixture]');
          const copy = article.querySelector('.content-blocks').cloneNode(true);
          // ECharts assigns session-specific instance IDs and canvas nodes.
          // Compare its server contract; interactions are checked separately.
          copy.querySelectorAll('[data-chart]').forEach((chart) => {
            chart.replaceChildren();
            chart.removeAttribute('_echarts_instance_');
            chart.removeAttribute('style');
          });
          return {
            html: copy.outerHTML,
            overflow: document.documentElement.scrollWidth > innerWidth,
            forms: article.querySelectorAll('form[data-led-letters]').length,
            blocks: [...article.querySelectorAll('[data-block-type]')]
              .map((block) => block.dataset.blockType),
            images: [...article.querySelectorAll('img[src]')]
              .map((image) => ({ src: image.src,
                width: Number(image.getAttribute('width')),
                height: Number(image.getAttribute('height')),
                alt: image.alt, decorative: Boolean(image.closest('dialog')),
              })),
            invalidLabels: [...article.querySelectorAll('[aria-labelledby]')]
              .filter((element) => !document.getElementById(
                element.getAttribute('aria-labelledby'),
              )).length,
          };
        });
        check(!data.overflow, `${name}/${format}/${width}: overflow`);
        check(!data.invalidLabels, `${name}: invalid accessible label`);
        check(data.images.every((image) => (image.alt || image.decorative)
          && image.width > 0 && image.height > 0
          && !image.src.includes('/src/assets/')),
        `${name}: invalid image`);
        const published = name.startsWith('published-');
        check(data.forms === Number(published), `${name}: wrong form gate`);
        if (published) {
          const identity = name === 'published-project' ? 'projectId'
            : 'serviceId';
          const expected = identity === 'projectId' ? '501' : 'svetovye-bukvy';
          check(await page.locator(`input[name="${identity}"]`).inputValue()
            === expected, `${name}: wrong form identity`);
          check(await page.locator('input[name="consent"]').count() === 1,
            `${name}: missing consent`);
        } else if (name !== 'minimal') {
          check(await page.locator('.content-blocks a[href="/#order-inquiry"]')
            .count() === 1, `${name}: missing general fallback`);
        }
        if (name === 'minimal') check(data.blocks.length === 1,
          'Minimal article has empty wrappers');
        markup.push(data.html);
      }
      check(markup[0] === markup[1], `${name}/${width}: MDX/JSON DOM differ`);
      records.push({ name, width, parity: true });
    }
  }
  // Native gallery navigation and modal focus return use emitted image URLs.
  await page.goto(`${origin}/__article-check/demo-project/json/`);
  const thumbnail = page.locator('[data-gallery-open="0"]').first();
  const href = await thumbnail.getAttribute('href');
  check(href.startsWith('/_astro/'), 'Gallery native link is not emitted');
  await page.locator('[data-gallery-main]').first().click();
  await page.locator('dialog[open]').waitFor();
  await page.keyboard.press('ArrowRight');
  check(await page.locator('[data-gallery-caption]').textContent()
    === 'Second caption', 'Gallery next image failed');
  await page.keyboard.press('Escape');
  check(await page.locator('dialog[open]').count() === 0,
    'Escape did not close the gallery');
  check(await thumbnail.evaluate((element) =>
    element.closest('[data-gallery]').querySelector('[data-gallery-main]')
      === document.activeElement),
    'Gallery focus did not return');
  // Real pages retain metadata, one column, local media and native actions.
  for (const route of ['/projects/2/', '/services/svetovye-bukvy/']) {
    for (const width of [375, 1440]) {
      for (const theme of ['light', 'dark']) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(`${origin}${route}`);
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value;
        }, theme);
        check(await page.locator('article h1').count() === 1,
          `${route}: primary heading changed`);
        check(await page.locator('meta[name="robots"]').getAttribute('content')
          === 'noindex, follow', `${route}: demo indexing changed`);
        check(await page.evaluate(() =>
          document.documentElement.scrollWidth <= innerWidth),
        `${route}/${width}/${theme}: overflow`);
        await page.screenshot({
          path: `output/playwright/task-082/after-${
            route.includes('projects') ? 'project' : 'service'
          }-${width}-${theme}.png`,
          fullPage: true,
        });
      }
    }
  }
  // Stored catalogue state accepts page two and survives browser navigation.
  const saved = '/projects/page/2/?q=test&category=led-letters#catalog-results';
  await page.goto(origin + saved);
  await page.evaluate(() => sessionStorage.setItem('project-catalog-return',
    '/projects/page/2/?q=test&category=led-letters#catalog-results'));
  await page.goto(`${origin}/projects/2/`);
  const returnLink = page.locator(
    '.project-actions [data-project-catalog-return]',
  );
  check(await returnLink.getAttribute('href')
    === origin + saved,
  'Return link lost page/query state');
  await returnLink.click();
  await page.waitForURL((url) => url.pathname.startsWith('/projects/'));
  await page.waitForFunction(() =>
    document.querySelector('[data-catalog-controls]')?.hidden === false);
  const catalogURL = page.url();
  check(await page.locator('#project-category').inputValue() === 'led-letters',
    'Return lost category filter');
  check(await page.locator('input[name="q"]').inputValue() === 'test',
    'Return lost search query');
  await page.goBack();
  await page.goForward();
  check(page.url() === catalogURL, 'Forward lost catalogue state');
  const browser = page.context().browser();
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const native = await noJS.newPage();
  for (const route of ['/projects/2/', '/services/svetovye-bukvy/',
    '/__article-check/no-owner/mdx/']) {
    await native.goto(origin + route);
    check(await native.locator('.content-blocks a[href="/#order-inquiry"]')
      .count() === 1, `${route}: no-JS inquiry fallback failed`);
  }
  await native.goto(`${origin}/projects/2/`);
  check(await native.locator('.project-actions [data-project-catalog-return]')
    .getAttribute('href') === '/projects/', 'Direct no-JS return failed');
  // Exercise bundled media; external demo availability is not an app contract.
  await native.goto(`${origin}/__article-check/no-owner/mdx/`);
  check(await native.locator('.content-chart__table tbody tr').count() === 1,
    'No-JS chart data missing');
  const resource = await native.locator('[data-gallery-open]').first()
    .getAttribute('href');
  const resourceURL = new URL(resource, origin).href;
  const resourceResponse = await native.request.get(resourceURL);
  check(resourceResponse.status() === 200,
    'No-JS gallery destination missing');
  await noJS.close();
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      get() { throw new Error('Storage unavailable'); },
    });
  });
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(`${origin}/projects/2/`);
  check(await blockedPage.locator(
    '.project-actions [data-project-catalog-return]',
  )
    .getAttribute('href') === '/projects/', 'Blocked-storage return failed');
  await blocked.close();
  check(!errors.length, errors.join('; '));
  return { parity: records, gallery: true, navigation: true, themes: true,
    noJS: true, blockedStorage: true, errors };
}
