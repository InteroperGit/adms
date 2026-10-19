// Browser contracts for isolation from external HTTP(S) requests.
import { expect, test } from './fixtures';

test('external requests fail while the document remains available', async ({
  page,
}) => {
  await expect(
    page.evaluate(() => fetch('https://example.test/blocked')),
  ).rejects.toThrow();
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
});
