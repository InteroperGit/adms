// Browser contracts for inquiry delivery failure, retry and fallback.
import { expect, test } from './fixtures';

test('inquiry retries errors and resets after receipt', async ({ page }) => {
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
  await expect(form.locator('[name="name"]')).toHaveValue('Synthetic visitor');
  accepted = true;
  await submit.click();
  await expect(form.locator('[role="status"]')).toHaveText('TEST_SUCCESS');
  await expect(form.locator('[name="name"]')).toHaveValue('');
  expect(requests).toHaveLength(2);
  expect(requests[0].requestId).toBe(requests[1].requestId);
});

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
