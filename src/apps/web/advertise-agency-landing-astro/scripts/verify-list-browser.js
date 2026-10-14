// Run through Playwright CLI against the isolated visual fixture on 54382.
async (page) => {
  const route = 'http://127.0.0.1:54382/__visual-check/long/';
  const output = 'output/playwright/vcb-04';
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
  const inspect = (target) => target.evaluate(() => {
    const lists = [...document.querySelectorAll('.content-list > ol, '
      + '.content-list > ul')];
    return lists.map((list) => {
      const style = getComputedStyle(list);
      const items = [...list.children];
      // Native selection checks that wrapping preserves selectable item text.
      const range = document.createRange();
      range.selectNodeContents(list);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      const selected = selection.toString().split('\n')
        .map((line) => line.trim()).filter(Boolean);
      selection.removeAllRanges();
      const wrapper = getComputedStyle(list.parentElement);
      return {
        tag: list.tagName,
        text: items.map((item) => item.textContent),
        selected,
        nativeItems: items.every((item) => item.tagName === 'LI'
          && getComputedStyle(item).display === 'list-item'),
        marker: style.listStyleType,
        position: style.listStylePosition,
        gutter: parseFloat(style.paddingInlineStart),
        guide: parseFloat(style.borderInlineStartWidth),
        aligned: items.every((item) => Math.abs(
          item.getBoundingClientRect().left
          - items[0].getBoundingClientRect().left,
        ) < 1),
        gap: parseFloat(getComputedStyle(items[1]).marginBlockStart),
        background: wrapper.backgroundColor,
        shadow: wrapper.boxShadow,
        overflow: list.scrollWidth > list.clientWidth + 1,
      };
    });
  });
  for (const width of [320, 768, 1440]) {
    for (const theme of ['light', 'dark']) {
      for (const scale of [100, 200]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(route);
        await page.evaluate(({ theme, scale }) => {
          document.documentElement.dataset.theme = theme;
          document.documentElement.style.fontSize = `${scale}%`;
          // Fixed navigation must not cover the list screenshots.
          document.querySelectorAll('header, .cookie-banner').forEach(
            (node) => { node.style.visibility = 'hidden'; },
          );
        }, { theme, scale });
        await page.waitForFunction(({ theme, scale }) =>
          document.documentElement.dataset.theme === theme
          && parseFloat(getComputedStyle(document.documentElement).fontSize)
            === 16 * scale / 100, { theme, scale });
        const lists = await inspect(page);
        const id = `${width}-${theme}-${scale}`;
        check(lists.length === 2, `${id}: missing lists`);
        check(lists[0].tag === 'OL' && lists[0].text.length === 10
          && lists[1].tag === 'UL' && lists[1].text.length === 2,
        `${id}: native order/count`);
        check(lists[0].marker === 'decimal' && lists[0].guide === 2
          && lists[1].marker === 'disc' && lists[1].guide === 0,
        `${id}: distinct markers and guide`);
        for (const list of lists) {
          check(list.nativeItems && list.position === 'outside'
            && list.aligned && list.gutter > 0 && list.gap > 0,
          `${id}: hanging indent/rhythm`);
          check(!list.overflow && list.shadow === 'none'
            && list.background === 'rgba(0, 0, 0, 0)',
          `${id}: overflow or card surface`);
          check(JSON.stringify(list.text) === JSON.stringify(list.selected),
            `${id}: selected text changed`);
        }
        for (const tag of ['ol', 'ul']) {
          await page.locator(`.content-list:has(> ${tag})`).screenshot({
            path: `${output}/${id}-${tag}.png`,
          });
        }
        records.push({ id, lists });
      }
    }
  }
  // Lists remain selectable and numbered without any client enhancement.
  for (const theme of ['light', 'dark']) {
    const context = await page.context().browser().newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 1000 },
    });
    const target = await context.newPage();
    await target.goto(route);
    await target.evaluate((theme) => {
      document.documentElement.dataset.theme = theme;
    }, theme);
    const lists = await inspect(target);
    check(lists.length === 2 && lists.every((list) => list.nativeItems
      && !list.overflow
      && JSON.stringify(list.text) === JSON.stringify(list.selected)),
    `${theme}: no-JavaScript fallback`);
    records.push({ id: `320-${theme}-no-js`, lists });
    await context.close();
  }
  check(errors.length === 0, errors.join('\n'));
  return { passed: records.length, records };
}
