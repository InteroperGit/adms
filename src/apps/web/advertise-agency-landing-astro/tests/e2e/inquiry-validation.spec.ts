// Browser contracts for accessible inquiry validation and correction.
import { type Page } from '@playwright/test';
import { expect, test } from './fixtures';

async function setupInquiry(page: Page): Promise<Array<unknown>> {
  const requests: Array<unknown> = [];
  await page.route('**/__fixture/inquiry', async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      json: { accepted: true, receiptId: 'validation-receipt' },
    });
  });
  await page.route('**/', async (route) => {
    const response = await route.fetch();
    const html = await response.text();
    await route.fulfill({
      response,
      body: html.replace('data-enabled="false"', 'data-enabled="true"'),
    });
  });
  return requests;
}

test('empty inquiry focuses the first error without sending', async ({
  page,
}) => {
  const requests = await setupInquiry(page);
  await page.goto('/');
  const form = page.locator('#order-inquiry form');
  const name = form.locator('[name="name"]');
  const error = form.locator('#inquiry-name-error');

  await form.locator('[type="submit"]').click();
  await expect(form.locator('[role="status"]')).toHaveText('TEST_INVALID');
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await expect(name).toHaveAttribute(
    'aria-describedby',
    /inquiry-name-error/,
  );
  await expect(error).toBeVisible();
  await expect(error).toHaveText('TEST_REQUIRED');
  expect(requests).toHaveLength(0);
});

test('invalid email blocks a partially completed inquiry', async ({ page }) => {
  const requests = await setupInquiry(page);
  await page.goto('/');
  const form = page.locator('#order-inquiry form');
  await form.locator('[name="name"]').fill('Synthetic visitor');
  const email = form.locator('[name="email"]');
  await email.fill('wrong');
  await form.locator('[name="message"]').fill('Synthetic inquiry');
  await form.locator('[name="consent"]').check();

  await form.locator('[type="submit"]').click();
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(form.locator('#inquiry-email-error')).toBeVisible();
  await expect(form.locator('#inquiry-email-error'))
    .toHaveText('test@example.com');
  expect(requests).toHaveLength(0);
});

test('missing consent blocks otherwise valid inquiry fields', async ({
  page,
}) => {
  const requests = await setupInquiry(page);
  await page.goto('/');
  const form = page.locator('#order-inquiry form');
  await form.locator('[name="name"]').fill('Synthetic visitor');
  await form.locator('[name="email"]').fill('visitor@example.test');
  await form.locator('[name="message"]').fill('Synthetic inquiry');
  const consent = form.locator('[name="consent"]');

  await form.locator('[type="submit"]').click();
  await expect(consent).toBeFocused();
  await expect(consent).toHaveAttribute('aria-invalid', 'true');
  await expect(form.locator('#inquiry-consent-error')).toBeVisible();
  await expect(form.locator('#inquiry-consent-error'))
    .toHaveText('TEST_REQUIRED');
  expect(requests).toHaveLength(0);
});

test('corrected email clears its error before one successful request', async ({
  page,
}) => {
  const requests = await setupInquiry(page);
  await page.goto('/');
  const form = page.locator('#order-inquiry form');
  await form.locator('[name="name"]').fill('Synthetic visitor');
  const email = form.locator('[name="email"]');
  await email.fill('wrong');
  await form.locator('[name="message"]').fill('Synthetic inquiry');
  await form.locator('[name="consent"]').check();
  await form.locator('[type="submit"]').click();
  await expect(email).toHaveAttribute('aria-invalid', 'true');

  await email.fill('visitor@example.test');
  await expect(email).toHaveAttribute('aria-invalid', 'false');
  await expect(form.locator('#inquiry-email-error')).toBeHidden();
  await form.locator('[type="submit"]').click();

  await expect(form.locator('[role="status"]')).toHaveText('TEST_SUCCESS');
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatchObject({
    captchaToken: 'synthetic-yandex-token-1',
  });
});
