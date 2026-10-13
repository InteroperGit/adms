// CLI scenario: enable delivery only in parser-time test DOM, intercept POST.
async (page) => {
  const origin = 'http://127.0.0.1:54382';
  const check = (value, message) => {
    if (!value) throw new Error(message);
  };
  const browser = page.context().browser();
  const context = await browser.newContext();
  await context.addInitScript(() => {
    // Run before deferred form initialization; never alter production config.
    new MutationObserver(() => {
      document.querySelectorAll('form[data-led-letters]').forEach((form) => {
        form.dataset.enabled = 'true';
        form.dataset.endpoint = '/__mock-inquiry';
      });
    }).observe(document, { childList: true, subtree: true });
  });
  const tab = await context.newPage();
  const errors = [];
  tab.on('pageerror', (error) => errors.push(error.message));
  let payload;
  let accepted = true;
  await tab.route('**/__mock-inquiry', async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ accepted, receiptId: 'TEST-ONLY-082' }) });
  });
  for (const owner of ['project', 'service']) {
    await tab.goto(`${origin}/__article-check/published-${owner}/mdx/`);
    const form = tab.locator('form[data-led-letters]');
    const button = form.locator('[type="submit"]');
    await button.waitFor();
    await button.click();
    check(await form.locator('[name="name"]').getAttribute('aria-invalid')
      === 'true' && !payload, 'Empty form reached endpoint');
    await form.locator('[name="name"]').fill('Acceptance fixture');
    await form.locator('[name="phone"]').fill('+7 999 123 45 67');
    await button.click();
    check(await form.locator('[name="consent"]').getAttribute('aria-invalid')
      === 'true' && !payload, 'Consent gate failed');
    await form.locator('[name="contactMethod"]').selectOption('email');
    await button.click();
    check(await form.locator('[name="email"]').getAttribute('aria-invalid')
      === 'true', 'Conditional email requirement failed');
    await form.locator('[name="email"]').fill('fixture@example.invalid');
    await form.locator('[name="consent"]').check();
    await button.click();
    await tab.waitForFunction(() => !document.querySelector('form')
      .hasAttribute('aria-busy'));
    check(payload?.serviceId === 'svetovye-bukvy'
      && (owner === 'service' ? !payload.projectId
        : payload.projectId === '501') && payload.consent === 'on'
      && payload.requestId, 'Mock identity/consent payload failed');
    const feedback = JSON.parse(await form.getAttribute('data-feedback'));
    check(await form.locator('[role="status"]').textContent()
      === feedback.success, 'Receipt success feedback failed');
    accepted = false;
    await form.locator('[name="name"]').fill('Acceptance fixture');
    await form.locator('[name="phone"]').fill('+7 999 123 45 67');
    await form.locator('[name="consent"]').check();
    await button.click();
    await tab.waitForFunction(() => !document.querySelector('form')
      .hasAttribute('aria-busy'));
    check(await form.locator('[role="status"]').textContent()
      === feedback.failure, 'Unconfirmed receipt accepted');
    payload = undefined;
    accepted = true;
  }
  check(!errors.length, errors.join('; '));
  await context.close();
  return { owners: ['project/led-letters', 'service/svetovye-bukvy'],
    validation: true, consent: true, receiptFeedback: true, errors };
}
