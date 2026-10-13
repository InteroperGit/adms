// Verify ordered semantics, slow real media, native states and chart hover.
async (page) => {
  const origin = 'http://127.0.0.1:54382';
  const check = (value, message) => {
    if (!value) throw new Error(message);
  };
  const errors = [];
  const missing = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.url().startsWith(origin) && response.status() >= 400) {
      missing.push(response.url());
    }
  });
  const expected = ['paragraph', 'ordered-list', 'unordered-list', 'table',
    'chart', 'image', 'image-gallery', 'order-form', 'quote', 'footnote'];
  const records = [];
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${origin}/__article-check/demo-project/json/`);
    const data = await page.locator('article').evaluate((article) => {
      const blocks = [...article.querySelectorAll('[data-block-type]')];
      return {
        types: blocks.map((node) => node.dataset.blockType),
        positions: blocks.map((node) => node.getBoundingClientRect().top),
        headings: [...article.querySelectorAll('h1,h2,h3,h4')]
          .map((node) => Number(node.tagName.slice(1))),
        sidePanel: [...article.querySelectorAll('aside')].some((node) =>
          !node.closest('[data-block-type="footnote"]')),
      };
    });
    check(JSON.stringify(data.types) === JSON.stringify(expected),
      'Sequential block order changed');
    check(data.positions.every((top, index) => !index
      || top >= data.positions[index - 1]) && !data.sidePanel,
    'Persistent side panel or reordered blocks');
    check(data.headings[0] === 1 && data.headings.slice(1)
      .every((level) => level === 2), 'Heading hierarchy changed');
    check(await page.locator('#intro p').textContent() === 'Fixture paragraph',
      'Paragraph copy changed');
    check(await page.locator('#steps li').allTextContents()
      .then((items) => items.join('|') === 'Подготовка|Производство'),
    'Ordered list changed');
    check(await page.locator('#materials li').allTextContents()
      .then((items) => items.join('|') === 'Акрил|Металл'),
    'Unordered list changed');
    check(await page.locator('blockquote').textContent()
      .then((text) => text.includes('Fixture quote')), 'Quote absent');
    check(await page.locator('.content-footnote a').getAttribute('href')
      === '#intro', 'Footnote target absent');
    const chart = page.locator('[data-chart]');
    await chart.scrollIntoViewIfNeeded();
    await chart.locator('canvas').waitFor();
    const rect = await chart.boundingBox();
    await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
    await page.waitForFunction(() => [...document.querySelectorAll('div')]
      .some((node) => node.style.position === 'absolute'
        && node.textContent.includes('Series')
        && getComputedStyle(node).visibility !== 'hidden'));
    check(await page.locator('.content-chart__table tbody tr').count() === 1,
      'Chart native table absent');
    records.push({ width, order: true, headings: true, chartHover: true });
  }
  await page.goto(`${origin}/__article-check/block-policy/mdx/`);
  check(!await page.locator('article').textContent()
    .then((text) => text.includes('DRAFT_BLOCK_MUST_NOT_RENDER')),
  'Draft block leaked');
  check(await page.locator('.block-demo-notice').count() === 1
    && await page.locator('form[data-led-letters]').count() === 0,
  'Demo gate failed');
  // Delay real emitted images and compare the reserved frame before/after.
  let release;
  const gate = new Promise((done) => { release = done; });
  await page.route('**/_astro/*', async (route) => {
    if (route.request().resourceType() === 'image') await gate;
    await route.continue();
  });
  await page.goto(`${origin}/__article-check/demo-project/json/`,
    { waitUntil: 'domcontentloaded' });
  const frame = page.locator('.content-media-frame').first();
  const before = await frame.boundingBox();
  release();
  await page.locator('.content-media-frame img').first().evaluate((image) =>
    image.decode());
  const after = await frame.boundingBox();
  check(Math.abs(before.height - after.height) < 1, 'Slow image shifted frame');
  await page.unroute('**/_astro/*');
  // Scroll real build articles to force lazy assets through HTTP/decode.
  for (const route of ['/projects/2/', '/services/svetovye-bukvy/',
    '/services/montazh/', '/services/neon/', '/services/vyveski/',
    '/services/obyomnye-konstruktsii/']) {
    await page.goto(origin + route);
    for (const image of await page.locator('article img[src]')
      .filter({ visible: true }).all()) {
      // Remote demo providers are reported separately from emitted assets.
      if (!(await image.getAttribute('src')).startsWith('/')) continue;
      await image.scrollIntoViewIfNeeded();
      check(await image.evaluate(async (node) => {
        try { await node.decode(); } catch {
          throw new Error(`Decode failed: ${node.currentSrc}`);
        }
        return node.naturalWidth > 0;
      }), `${route}: broken real image`);
    }
  }
  check(!errors.length && !missing.length,
    `Errors: ${errors}; missing: ${missing}`);
  return { records, slowMediaStable: true, asset404: missing, errors };
}
