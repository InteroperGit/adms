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

test('search and category filters show matching fixture projects', async ({
  page,
}) => {
  await page.goto('/projects/');

  const controls = page.locator('[data-catalog-controls]');
  const search = controls.locator('input[type="search"]');
  const category = controls.locator('select[name="category"]');
  const visibleLinks = page.locator(
    '[data-project-card]:visible [data-project-link]',
  );
  const count = page.locator('[data-catalog-count-value]');

  await expect(controls).toBeVisible();
  await search.fill('Synthetic project 2');
  await expect(visibleLinks).toHaveCount(1);
  await expect(visibleLinks).toHaveAttribute('href', '/projects/2/');
  await expect(count).toHaveText('1');
  await expect.poll(() => new URL(page.url()).searchParams.get('q'))
    .toBe('Synthetic project 2');

  await search.fill('zzzz-no-match');
  await expect(page.locator('[data-catalog-search-empty]')).toBeVisible();
  await expect(visibleLinks).toHaveCount(0);
  await expect(
    page.getByRole('navigation', { name: 'Навигация по проектам' }),
  ).toHaveCount(0);

  await search.fill('');
  await category.selectOption('other');
  await expect(visibleLinks).toHaveCount(1);
  await expect(visibleLinks).toHaveAttribute('href', '/projects/3/');
  await expect(count).toHaveText('1');
  await expect.poll(() => new URL(page.url()).searchParams.get('category'))
    .toBe('other');

  await category.selectOption('sample');
  await expect(count).toHaveText('2');
  await expect(
    page.locator('[data-project-card][data-category="sample"]'),
  ).toHaveCount(2);
  await expect(page.locator('[data-project-card]:visible'))
    .toHaveCount(1);
  await expect.poll(() => new URL(page.url()).searchParams.get('category'))
    .toBe('sample');

  await search.fill('Synthetic project 2');
  await expect(visibleLinks).toHaveCount(1);
  await expect(visibleLinks).toHaveAttribute('href', '/projects/2/');
  await expect(count).toHaveText('1');
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('q'), params.get('category')];
  }).toEqual(['Synthetic project 2', 'sample']);

  await search.fill('zzzz-no-match');
  await expect(page.locator('[data-catalog-search-empty]')).toBeVisible();
  await page.locator('[data-catalog-reset]').click();
  await expect(search).toHaveValue('');
  await expect(category).toHaveValue('');
  await expect(count).toHaveText('3');
  await expect(page.locator('[data-project-card]:visible'))
    .toHaveCount(1);
  await expect.poll(() => new URL(page.url()).pathname)
    .toBe('/projects/');
  await expect.poll(() => new URL(page.url()).search)
    .toBe('');
});

test('direct URLs, reload and history restore catalog results', async ({
  page,
}) => {
  const url = '/projects/?q=Synthetic%20project%202&category=sample';
  await page.goto(url);

  const search = page.locator('[data-catalog-controls] input[type="search"]');
  const category = page.locator(
    '[data-catalog-controls] select[name="category"]',
  );
  const count = page.locator('[data-catalog-count-value]');
  const visibleLinks = page.locator(
    '[data-project-card]:visible [data-project-link]',
  );
  const empty = page.locator('[data-catalog-search-empty]');

  await expect(search).toHaveValue('Synthetic project 2');
  await expect(category).toHaveValue('sample');
  await expect(visibleLinks).toHaveCount(1);
  await expect(visibleLinks).toHaveAttribute('href', '/projects/2/');
  await expect(count).toHaveText('1');

  await page.reload();
  await expect(search).toHaveValue('Synthetic project 2');
  await expect(category).toHaveValue('sample');
  await expect(visibleLinks).toHaveAttribute('href', '/projects/2/');
  await expect(count).toHaveText('1');

  await category.selectOption('other');
  await expect(category).toHaveValue('other');
  await expect(empty).toBeVisible();
  await expect(visibleLinks).toHaveCount(0);
  await expect(count).toHaveText('0');
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return [params.get('q'), params.get('category')];
  }).toEqual(['Synthetic project 2', 'other']);

  await page.goBack();
  await expect(search).toHaveValue('Synthetic project 2');
  await expect(category).toHaveValue('sample');
  await expect(empty).toBeHidden();
  await expect(visibleLinks).toHaveAttribute('href', '/projects/2/');
  await expect(count).toHaveText('1');

  await page.goForward();
  await expect(search).toHaveValue('Synthetic project 2');
  await expect(category).toHaveValue('other');
  await expect(empty).toBeVisible();
  await expect(visibleLinks).toHaveCount(0);
  await expect(count).toHaveText('0');
});
