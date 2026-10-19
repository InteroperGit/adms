// Browser contracts for catalog search, filtering and pagination.
import { expect, test } from './fixtures';

test('catalog search, filter, pagination and history share URL state', async ({
  page,
}) => {
  await page.goto('/projects/');
  const controls = page.locator('[data-catalog-controls]');
  const search = controls.locator('input[type="search"]');
  await search.fill('zzzz-no-match');
  await expect(page.locator('[data-catalog-search-empty]')).toBeVisible();
  await search.fill('');
  await controls.locator('select[name="category"]').selectOption('sample');
  await expect(page).toHaveURL(/category=sample/);
  await page.goBack();
  await expect(page).not.toHaveURL(/category=sample/);
  await page.goForward();
  await expect(page).toHaveURL(/category=sample/);
  await page.goto('/projects/page/2/');
  await expect(
    page.locator('[data-project-card]:visible [data-project-link]').first(),
  ).toHaveAttribute('href', '/projects/2/');
});
