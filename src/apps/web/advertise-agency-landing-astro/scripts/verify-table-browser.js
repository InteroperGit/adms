// Run with Playwright CLI against the isolated table acceptance build.
async (page) => {
  const route = 'http://127.0.0.1:54382/__table-check/';
  const output = 'output/playwright/vcb-05';
  const records = [];
  const errors = [];
  const check = (value, message) => {
    if (!value) throw new Error(message);
  };
  page.on('pageerror', (error) => errors.push(error.message));

  const inspect = (target) => target.evaluate(() => {
    const visible = (node) => node.getClientRects().length > 0;
    return [...document.querySelectorAll('.content-table')].map((block) => {
      const table = block.querySelector('table');
      const scroll = block.querySelector('.table-scroll');
      const stack = block.querySelector('.table-stack');
      const labels = [...table.querySelectorAll('th')];
      const desktop = [...table.querySelectorAll('tbody tr')].map((row) =>
        [...row.cells].map((cell) => cell.textContent));
      const mobile = [...stack.querySelectorAll('dl')].map((row) =>
        [...row.querySelectorAll('dd')].map((cell) => cell.textContent));
      const pairs = [...stack.querySelectorAll('.stack-pair')];
      const rows = [...block.querySelectorAll('tbody tr, dl')]
        .filter(visible);
      return {
        columns: labels.length,
        desktop,
        mobile,
        labelsCorrect: pairs.every((pair, index) =>
          pair.querySelector('dt').textContent
            === labels[index % labels.length].textContent),
        scopes: labels.every((label) => label.scope === 'col'),
        tableVisible: visible(scroll),
        stackVisible: visible(stack),
        localOverflow: scroll.scrollWidth > scroll.clientWidth + 1,
        scrollable: getComputedStyle(scroll).overflowX === 'auto',
        numeric: labels.map((label) => label.classList.contains('numeric')),
        align: labels.map((label) => getComputedStyle(label).textAlign),
        header: {
          background: getComputedStyle(labels[0]).backgroundColor,
          color: getComputedStyle(labels[0]).color,
          width: labels[0].getBoundingClientRect().width,
        },
        fieldRules: pairs.map((pair) => ({
          width: getComputedStyle(pair).borderBottomWidth,
          labelWeight: getComputedStyle(pair.querySelector('dt')).fontWeight,
          labelRule: getComputedStyle(pair.querySelector('dt'))
            .borderInlineStartWidth,
          labelFill: getComputedStyle(pair.querySelector('dt')).backgroundColor,
          rowFill: getComputedStyle(pair.closest('dl')).backgroundColor,
        })),
        rowRules: [...stack.querySelectorAll('dl')].map((row) =>
          getComputedStyle(row).borderBottomWidth),
        oddOutlines: [...stack.querySelectorAll('dl:nth-of-type(odd)')]
          .every((row) => ['Top', 'Right', 'Bottom', 'Left'].every((side) =>
            getComputedStyle(row)[`border${side}Width`] === '1px')),
        stripes: rows.map((row) => getComputedStyle(row).backgroundColor),
        card: getComputedStyle(block).boxShadow !== 'none'
          || parseFloat(getComputedStyle(block).borderTopWidth) > 0,
      };
    });
  });

  // Verify both data trees, but only one accessible representation per width.
  const verify = async (target, id, mobile) => {
    const tables = await inspect(target);
    check(JSON.stringify(tables.map((table) => table.columns))
      === '[2,4,8]', `${id}: column coverage`);
    const expectedNumeric = [[false, true], [false, true, true, false],
      [false, true, true, false, false, false, false, false]];
    for (const [index, table] of tables.entries()) {
      check(JSON.stringify(table.desktop) === JSON.stringify(table.mobile)
        && table.labelsCorrect && table.scopes, `${id}: lost data/labels`);
      check(table.stackVisible === mobile && table.tableVisible !== mobile,
        `${id}: duplicate or absent view`);
      check(JSON.stringify(table.numeric)
        === JSON.stringify(expectedNumeric[index]), `${id}: numeric inference`);
      check(table.stripes[0] !== table.stripes[1] && !table.card,
        `${id}: zebra or enclosing card`);
      if (!mobile) {
        check(table.header.width >= 160
          && table.header.color !== table.header.background,
        `${id}: readable contrasting header`);
        check(table.scrollable && table.align.every((align, column) =>
          align === (table.numeric[column] ? 'end' : 'start')),
        `${id}: scroll/alignment`);
      } else {
        check(table.rowRules.every((width) => width === '1px')
          && table.oddOutlines
          && table.fieldRules.every((rule) => rule.width === '1px'
            && rule.labelWeight === '700' && rule.labelRule === '3px'
            && rule.labelFill !== rule.rowFill),
        `${id}: subtle rules and prominent labels on every row`);
      }
    }
    check(await target.evaluate(() => document.documentElement.scrollWidth
      <= window.innerWidth + 1), `${id}: document overflow`);
    check(await target.locator('.content-table b').count() === 0,
      `${id}: unescaped markup`);
    // Accessibility snapshot excludes display:none, unlike raw textContent.
    const snapshot = await target.locator('main').ariaSnapshot();
    for (const name of ['Alpha', 'Delta', 'Eta', 'Theta', 'Iota']) {
      const role = mobile ? 'definition' : 'cell';
      const count = snapshot.split('\n').filter((line) =>
        line.includes(`- ${role}: ${name}`)
        || line.includes(`- ${role} "${name}"`)).length;
      check(count === 1, `${id}: ${name} read ${count} times`);
    }
    check(mobile ? !snapshot.includes('- table')
      : !snapshot.includes('- definition'), `${id}: inactive accessible tree`);
    return tables;
  };

  for (const width of [320, 768, 1440]) {
    for (const theme of ['light', 'dark']) {
      for (const scale of [100, 200]) {
        const id = `${width}-${theme}-${scale}`;
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(route);
        await page.evaluate(({ theme, scale }) => {
          document.documentElement.dataset.theme = theme;
          document.documentElement.style.fontSize = `${scale}%`;
        }, { theme, scale });
        await page.waitForFunction(({ scale }) =>
          parseFloat(getComputedStyle(document.documentElement).fontSize)
            === 16 * scale / 100, { scale });
        const mobile = width < 768;
        const tables = await verify(page, id, mobile);
        const rows = page.locator(mobile ? '.stack-row' : 'tbody tr');
        await page.mouse.move(0, 0);
        const base = await rows.first().evaluate((row) =>
          getComputedStyle(row).backgroundColor);
        await rows.first().hover();
        const hover = await rows.first().evaluate((row) =>
          getComputedStyle(row).backgroundColor);
        check(base !== hover, `${id}: hover highlight`);
        await page.mouse.move(0, 0);
        // Native Tab reaches only the active view, then highlights its row.
        await page.goto(route);
        await page.evaluate(({ theme, scale }) => {
          document.documentElement.dataset.theme = theme;
          document.documentElement.style.fontSize = `${scale}%`;
        }, { theme, scale });
        await page.keyboard.press('Tab');
        if (!mobile) await page.keyboard.press('Tab');
        const focus = await rows.first().evaluate((row) => ({
          active: document.activeElement === row,
          outline: getComputedStyle(row).outlineStyle,
          background: getComputedStyle(row).backgroundColor,
        }));
        check(focus.active && focus.outline === 'solid'
          && focus.background === hover, `${id}: keyboard row focus`);
        await page.locator('main').screenshot({ path: `${output}/${id}.png` });
        records.push({ id, tables });
      }
    }
  }

  // No-JS contexts exercise all widths and both themes with static content.
  for (const width of [320, 768, 1440]) {
    for (const theme of ['light', 'dark']) {
      const context = await page.context().browser().newContext({
        javaScriptEnabled: false,
        viewport: { width, height: 1000 },
        reducedMotion: 'reduce',
      });
      const target = await context.newPage();
      await target.goto(route);
      await target.evaluate((theme) => {
        document.documentElement.dataset.theme = theme;
      }, theme);
      const id = `${width}-${theme}-no-js`;
      records.push({ id, tables: await verify(target, id, width < 768) });
      await context.close();
    }
  }

  // Wide tables really scroll locally with native keyboard arrows.
  await page.setViewportSize({ width: 768, height: 1000 });
  await page.goto(route);
  const wide = page.locator('.table-scroll').nth(2);
  check(await wide.evaluate((node) => node.scrollWidth > node.clientWidth),
    'Eight-column fixture must exercise actual local overflow');
  await wide.focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(() =>
    document.querySelectorAll('.table-scroll')[2].scrollLeft > 0);
  await page.emulateMedia({ media: 'print' });
  await page.setViewportSize({ width: 320, height: 1000 });
  const printed = await inspect(page);
  check(printed.every((table) => table.tableVisible && !table.stackVisible),
    'Print must expose one complete comparison view');
  await page.emulateMedia({ media: 'screen' });
  check(errors.length === 0, errors.join('\n'));
  return { passed: records.length, keyboardScroll: true, print: true, records };
}
