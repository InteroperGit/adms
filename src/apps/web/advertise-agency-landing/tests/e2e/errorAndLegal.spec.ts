import { test, expect } from '@playwright/test';

test.describe('error and legal', () => {
  test('E6.1 /404 renders the Not Found page with a back link', async ({ page }) => {
    await page.goto('/404');
    await page.waitForLoadState('domcontentloaded');

    // NotFound renders an <h1> with aria-label "Error 404" and an <h2> with the title text.
    // Scope to the NotFound container to avoid strict-mode conflicts with other h2 elements
    // that may be present (e.g. in the header carousel or other pages loaded in the same session).
    const errorCode = page.locator('[aria-label^="Error"]');
    await expect(errorCode).toBeVisible();

    // Back link is a <Link> rendered as <a>
    const backLink = page.getByRole('link', { name: /на главную|back|назад/i });
    await expect(backLink).toBeVisible();
  });

  test('E6.2 pre-rendered /404 page shows Not Found content', async ({ page }) => {
    // The SSG only pre-renders known routes; unknown slugs are handled by
    // the catch-all route which also renders the NotFound component.
    // The pre-rendered /404 page is the canonical way to verify this content.
    await page.goto('/404');
    await page.waitForLoadState('domcontentloaded');

    // NotFound renders the error code (h1) with aria-label "Error 404"
    const errorCode = page.locator('[aria-label^="Error"]');
    await expect(errorCode).toBeVisible();

    // The title text is rendered in an <h2>
    const title = page.locator('h2').first();
    await expect(title).toBeVisible();
  });

  test('E6.3 /privacy-policy renders without error and has a heading', async ({ page }) => {
    await page.goto('/privacy-policy');
    await page.waitForLoadState('domcontentloaded');

    // LegalPageLayout renders an <h1> with the document title
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('E6.4 /user-agreement renders without error and has a heading', async ({ page }) => {
    await page.goto('/user-agreement');
    await page.waitForLoadState('domcontentloaded');

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('E6.5 /consent renders without error and has a heading', async ({ page }) => {
    await page.goto('/consent');
    await page.waitForLoadState('domcontentloaded');

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('E6.6 legal pages have a home link via the site header', async ({ page }) => {
    for (const route of ['/privacy-policy', '/user-agreement', '/consent']) {
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');

      // The App layout always renders <Header /> which contains a logo link to "/"
      const homeLink = page.locator('header a[href="/"]');
      await expect(homeLink).toBeVisible();
    }
  });
});
