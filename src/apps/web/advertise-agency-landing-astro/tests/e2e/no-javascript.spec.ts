// Browser contracts for navigation and inquiry fallback without JavaScript.
import { expect, blockExternalRequests, test } from './fixtures';

test('no JavaScript retains navigation and protects inquiry', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
  });
  await blockExternalRequests(context);
  const page = await context.newPage();
  try {
    await page.goto(`${baseURL}/projects/`);
    await page.locator('[data-project-link]').first().click();
    await expect(page).toHaveURL(/\/projects\/1\//);
    await expect(page.locator('main')).toBeVisible();
    await page.goto(`${baseURL}/`);
    await expect(page.locator('#order-inquiry [type="submit"]')).toBeDisabled();
    await expect(page.locator('#order-inquiry noscript')).toBeVisible();
  } finally {
    await context.close();
  }
});
