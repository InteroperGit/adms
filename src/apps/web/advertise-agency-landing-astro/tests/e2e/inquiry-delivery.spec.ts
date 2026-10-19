// Browser contracts for inquiry delivery failure, retry and fallback.
import { type Page } from '@playwright/test';
import { expect, test } from './fixtures';

type FailureResponse =
  | { name: string; json: Record<string, unknown> }
  | { name: string; body: string };

const failureResponses: FailureResponse[] = [
  { name: 'accepted false', json: { accepted: false } },
  { name: 'missing receipt', json: { accepted: true } },
  { name: 'empty receipt', json: { accepted: true, receiptId: '' } },
  { name: 'invalid JSON', body: '{invalid-json' },
];

function disableInquiry(html: string): string {
  const marker = /(<form\b[^>]*\bdata-inquiry\b[^>]*\bdata-enabled=")true(")/;
  return html.replace(marker, '$1false$2');
}

async function fillInquiry(
  page: Page,
  message = 'Synthetic inquiry',
): Promise<void> {
  const form = page.locator('#order-inquiry form');
  await form.locator('[name="name"]').fill('Synthetic visitor');
  await form.locator('[name="email"]').fill('visitor@example.test');
  await form.locator('[name="message"]').fill(message);
  await form.locator('[name="consent"]').check();
}

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
  await fillInquiry(page);
  const submit = form.locator('[type="submit"]');
  await submit.click();
  await expect(form.locator('[role="status"]')).toHaveText('TEST_FAILURE');
  await expect(form.locator('[role="status"]')).toBeFocused();
  await expect(form.locator('[name="name"]')).toHaveValue('Synthetic visitor');
  accepted = true;
  await submit.click();
  await expect(form.locator('[role="status"]')).toHaveText('TEST_SUCCESS');
  await expect(form.locator('[role="status"]')).toBeFocused();
  await expect(form.locator('[name="name"]')).toHaveValue('');
  expect(requests).toHaveLength(2);
  expect(requests[0].requestId).toBe(requests[1].requestId);
});

test('unavailable delivery stays disabled and explains fallback', async ({
  page,
}) => {
  await page.route('**/', async (route) => {
    const response = await route.fetch();
    const html = await response.text();
    await route.fulfill({
      response,
      body: disableInquiry(html),
    });
  });
  await page.goto('/');
  const form = page.locator('#order-inquiry form');
  await expect(form.locator('[type="submit"]')).toBeDisabled();
  await form.evaluate((node) => (node as HTMLFormElement).requestSubmit());
  await expect(form.locator('[role="status"]')).toHaveText('TEST_UNAVAILABLE');
});

test('pending delivery blocks duplicate submission until release', async ({
  page,
}) => {
  const requests: Record<string, string>[] = [];
  let release: (() => void) | undefined;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/__fixture/inquiry', async (route) => {
    requests.push(route.request().postDataJSON());
    await held;
    await route.fulfill({
      status: 200,
      json: { accepted: true, receiptId: 'held-receipt' },
    });
  });

  try {
    await page.goto('/');
    await fillInquiry(page);
    const form = page.locator('#order-inquiry form');
    const fields = form.locator('fieldset');
    const submit = form.locator('[type="submit"]');
    await submit.click();
    expect(await form.locator('[role="status"]').textContent()).toBe(
      'TEST_SENDING',
    );
    expect(
      await form.evaluate((node) => ({
        fieldsDisabled: node.querySelector('fieldset')?.disabled,
        submitDisabled:
          node.querySelector<HTMLButtonElement>('[type="submit"]')?.disabled,
        busy: node.getAttribute('aria-busy'),
      })),
    ).toEqual({
      fieldsDisabled: true,
      submitDisabled: true,
      busy: 'true',
    });
    await expect.poll(() => requests.length, { timeout: 500 }).toBe(1);
    await form.evaluate((node) => (node as HTMLFormElement).requestSubmit());
    await expect.poll(() => requests.length, { timeout: 500 }).toBe(1);
    release?.();
    await expect(form.locator('[role="status"]')).toHaveText('TEST_SUCCESS');
    await expect(fields).toBeEnabled();
    await expect(submit).toBeEnabled();
    await expect(form).not.toHaveAttribute('aria-busy');
    await expect(form.locator('[name="name"]')).toHaveValue('');
  } finally {
    release?.();
  }
});

for (const response of failureResponses) {
  test(`delivery rejects ${response.name} and permits retry`, async ({
    page,
  }) => {
    const requests: Record<string, string>[] = [];
    await page.route('**/__fixture/inquiry', async (route) => {
      requests.push(route.request().postDataJSON());
      if ('body' in response) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: response.body,
        });
        return;
      }
      await route.fulfill({ status: 200, json: response.json });
    });

    await page.goto('/');
    await fillInquiry(page);
    const form = page.locator('#order-inquiry form');
    const submit = form.locator('[type="submit"]');
    await submit.click();
    await expect(form.locator('[role="status"]')).toHaveText('TEST_FAILURE');
    await expect(form.locator('[role="status"]')).toBeFocused();
    await expect(form.locator('[name="message"]')).toHaveValue(
      'Synthetic inquiry',
    );

    await submit.click();
    await expect(form.locator('[role="status"]')).toHaveText('TEST_FAILURE');
    expect(requests).toHaveLength(2);
    expect(requests[0].requestId).toBe(requests[1].requestId);

    await form.locator('[name="message"]').fill('Changed inquiry');
    await submit.click();
    await expect(form.locator('[role="status"]')).toHaveText('TEST_FAILURE');
    expect(requests).toHaveLength(3);
    expect(requests[2].requestId).not.toBe(requests[0].requestId);
  });
}

test('successful delivery assigns a new ID to a new inquiry', async ({
  page,
}) => {
  const requests: Record<string, string>[] = [];
  await page.route('**/__fixture/inquiry', async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      json: { accepted: true, receiptId: 'success-receipt' },
    });
  });

  await page.goto('/');
  const form = page.locator('#order-inquiry form');
  await fillInquiry(page);
  await form.locator('[type="submit"]').click();
  await expect(form.locator('[role="status"]')).toHaveText('TEST_SUCCESS');
  await expect(form.locator('[role="status"]')).toBeFocused();
  await fillInquiry(page, 'Second inquiry');
  await form.locator('[type="submit"]').click();
  await expect(form.locator('[role="status"]')).toHaveText('TEST_SUCCESS');
  await expect(form.locator('[role="status"]')).toBeFocused();
  expect(requests).toHaveLength(2);
  expect(requests[0].requestId).not.toBe(requests[1].requestId);
});

test('aborted delivery reports failure and preserves the inquiry', async ({
  page,
}) => {
  await page.route('**/__fixture/inquiry', (route) => route.abort());
  await page.goto('/');
  await fillInquiry(page);
  const form = page.locator('#order-inquiry form');
  await form.locator('[type="submit"]').click();
  await expect(form.locator('[role="status"]')).toHaveText('TEST_FAILURE');
  await expect(form.locator('[role="status"]')).toBeFocused();
  await expect(form.locator('[name="message"]')).toHaveValue(
    'Synthetic inquiry',
  );
});

test('timed out delivery reports failure before releasing the route', async ({
  page,
}) => {
  let release: (() => void) | undefined;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/__fixture/inquiry', async (route) => {
    await held;
    try {
      await route.fulfill({
        status: 200,
        json: { accepted: true, receiptId: 'late-receipt' },
      });
    } catch {
      // The browser has already aborted this route after the timeout.
    }
  });

  try {
    await page.goto('/');
    await fillInquiry(page);
    const form = page.locator('#order-inquiry form');
    await form.locator('[type="submit"]').click();
    await expect(form.locator('[role="status"]')).toHaveText('TEST_FAILURE', {
      timeout: 1500,
    });
    await expect(form.locator('[role="status"]')).toBeFocused();
    await expect(form.locator('[name="name"]')).toHaveValue(
      'Synthetic visitor',
    );
  } finally {
    release?.();
  }
});
