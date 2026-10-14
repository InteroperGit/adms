// Run via Playwright CLI against the isolated acceptance server on 54382.
async (page) => {
  const origin = 'http://127.0.0.1:54382';
  const route = `${origin}/__visual-check/paragraph/`;
  const output = 'output/playwright/vcb-03';
  const records = [];
  const errors = [];
  const check = (value, message) => {
    if (!value) throw new Error(message);
  };
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('https://**/*', (request) =>
    request.fulfill({ body: '' }));
  await page.addInitScript(() => {
    localStorage.setItem('cookieConsent', 'accepted');
  });
  const inspect = async (target) => target.evaluate(() => {
    const sections = [...document.querySelectorAll('.content-paragraph')];
    const first = sections[0];
    const link = first.querySelector('a');
    const paragraph = first.querySelector('p');
    const style = getComputedStyle(paragraph);
    const luminance = (color) => {
      const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number)
        .map((channel) => channel / 255)
        .map((value) => value <= 0.04045 ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4);
      return channels[0] * 0.2126 + channels[1] * 0.7152
        + channels[2] * 0.0722;
    };
    const background = luminance(getComputedStyle(document.body)
      .backgroundColor);
    const contrast = (color) => {
      const foreground = luminance(color);
      return (Math.max(foreground, background) + 0.05)
        / (Math.min(foreground, background) + 0.05);
    };
    const headingIds = sections.filter((node) => node.querySelector('h2'))
      .map((node) => node.getAttribute('aria-labelledby'));
    return {
      theme: document.documentElement.dataset.theme,
      rootSize: parseFloat(getComputedStyle(document.documentElement).fontSize),
      overflow: document.documentElement.scrollWidth > innerWidth,
      sections: sections.length,
      headingLabels: headingIds.every((id) => id
        && document.getElementById(id)?.tagName === 'H2'),
      uniqueLabels: new Set(headingIds).size === headingIds.length,
      unlabelled: !sections[3].hasAttribute('aria-labelledby'),
      escaped: sections[3].querySelector('img, script, a') === null,
      links: sections.reduce((sum, node) => sum
        + node.querySelectorAll('a').length, 0),
      href: link.getAttribute('href'),
      underline: getComputedStyle(link).textDecorationLine,
      textContrast: contrast(style.color),
      linkContrast: contrast(getComputedStyle(link).color),
      leading: parseFloat(style.lineHeight) / parseFloat(style.fontSize),
      width: first.getBoundingClientRect().width,
      maxWidth: parseFloat(getComputedStyle(first).maxInlineSize),
      gap: parseFloat(getComputedStyle(paragraph.nextElementSibling)
        .marginBlockStart),
      background: getComputedStyle(first).backgroundColor,
      shadow: getComputedStyle(first).boxShadow,
    };
  });
  for (const width of [320, 768, 1440]) {
    for (const theme of ['light', 'dark']) {
      for (const scale of [100, 200]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(route);
        await page.waitForLoadState('load');
        await page.evaluate(({ theme, scale }) => {
          document.documentElement.dataset.theme = theme;
          document.documentElement.style.fontSize = `${scale}%`;
        }, { theme, scale });
        // Let theme variables and relative measures settle before reading CSS.
        await page.evaluate(() => new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await page.waitForFunction(({ theme, scale }) =>
          document.documentElement.dataset.theme === theme
            && parseFloat(getComputedStyle(document.documentElement).fontSize)
              === 16 * scale / 100, { theme, scale });
        const data = await inspect(page);
        const id = `${width}-${theme}-${scale}`;
        check(data.theme === theme && data.rootSize === 16 * scale / 100,
          `${id}: preference not applied (${data.theme}/${data.rootSize})`);
        check(!data.overflow && data.sections === 4, `${id}: layout`);
        check(data.headingLabels && data.uniqueLabels && data.unlabelled,
          `${id}: section labels`);
        check(data.escaped && data.links === 1 && !data.href.endsWith('.'),
          `${id}: unsafe linking or changed punctuation`);
        check(data.textContrast >= 4.5 && data.linkContrast >= 4.5,
          `${id}: contrast`);
        check(data.leading >= 1.6 && data.gap >= 12,
          `${id}: paragraph rhythm`);
        check(data.width <= data.maxWidth + 1, `${id}: reading measure`);
        check(data.background === 'rgba(0, 0, 0, 0)' && data.shadow === 'none',
          `${id}: unexpected prose surface`);
        check(data.underline.includes('underline'), `${id}: link underline`);
        await page.locator('[data-visual-fixture]').screenshot({
          path: `${output}/${id}.png`,
          style: 'header { visibility: hidden !important; }',
        });
        records.push({ id, ...data });
      }
    }
  }
  // Tab from the document start to the real URL, without clicking off-site.
  await page.goto(route);
  const link = page.locator('.content-paragraph a');
  let reached = false;
  for (let index = 0; index < 100; index++) {
    await page.keyboard.press('Tab');
    reached = await link.evaluate((node) => node === document.activeElement);
    if (reached) break;
  }
  check(reached && await link.evaluate((node) =>
    getComputedStyle(node).outlineStyle !== 'none'), 'Keyboard URL focus');
  for (const theme of ['light', 'dark']) {
    const context = await page.context().browser().newContext({
      javaScriptEnabled: false, colorScheme: theme,
      viewport: { width: 320, height: 1000 },
    });
    const native = await context.newPage();
    await native.route('https://**/*', (request) =>
      request.fulfill({ body: '' }));
    await native.goto(route);
    const data = await inspect(native);
    check(!data.overflow && data.headingLabels && data.links === 1,
      `No-JS/${theme}: native semantics`);
    check(data.textContrast >= 4.5 && data.linkContrast >= 4.5,
      `No-JS/${theme}: contrast`);
    records.push({ id: `no-js-${theme}`, ...data });
    await context.close();
  }
  check(!errors.length, errors.join(', '));
  return { records, keyboard: true, errors };
}
