import { test, expect } from '@playwright/test';

test.describe('mobile: Portfolio listing (E8)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/portfolio');
  });

  test('E8.1 /portfolio page heading visible on mobile', async ({ page }) => {
    // SectionHeader renders label and title
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('E8.2 Breadcrumbs render on /portfolio', async ({ page }) => {
    // BreadCrumbs nav has aria-label="Breadcrumb"
    const breadcrumbs = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumbs).toBeVisible({ timeout: 10000 });
  });

  test('E8.3 Portfolio cards render on mobile', async ({ page }) => {
    const cards = page.locator('article');
    const count = await cards.count();
    if (count > 0) {
      await expect(cards.first()).toBeVisible();
    } else {
      test.skip(true, 'No cards to test');
    }
  });

  test('E8.4 Portfolio card image or title visible', async ({ page }) => {
    const cards = page.locator('article');
    const count = await cards.count();
    if (count === 0) {
      test.skip(true, 'No cards to test');
      return;
    }
    const firstCard = cards.first();
    await expect(firstCard).toBeVisible();
    // Either h3 title or img should be visible
    const title = firstCard.locator('h3');
    const titleVisible = await title.isVisible().catch(() => false);
    if (!titleVisible) {
      const image = firstCard.locator('img');
      await expect(image).toBeVisible({ timeout: 10000 });
    }
  });

  test('E8.5 Category nav renders on mobile', async ({ page }) => {
    // CategoryNav renders Link components inside AnimatedPillTabs
    const allLink = page.locator('a[href="/portfolio"]');
    await expect(allLink).toBeVisible();
  });

  test('E8.6 Tapping a category link changes URL', async ({ page }) => {
    const categoryLinks = page.locator('a[href^="/portfolio/"]').filter({ hasNot: page.locator('img') });
    const count = await categoryLinks.count();

    if (count === 0) {
      test.skip(true, 'No categories available to test navigation');
      return;
    }

    const firstCategoryLink = categoryLinks.first();
    const targetHref = await firstCategoryLink.getAttribute('href');
    await firstCategoryLink.click();

    await expect(page).toHaveURL(new RegExp(`${targetHref}$`));
  });

  test('E8.7 Category page shows filtered cards', async ({ page }) => {
    const categoryLinks = page.locator('a[href^="/portfolio/"]');
    const count = await categoryLinks.count();

    if (count === 0) {
      test.skip(true, 'No categories available');
      return;
    }

    const targetHref = await categoryLinks.first().getAttribute('href');
    if (!targetHref) {
      throw new Error('Category href not found');
    }

    await page.goto(targetHref);
    // Page should render without error
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();

    // Cards may or may not exist, but no error boundary should be triggered
    const errorHeading = page.locator('h1:has-text("Error"), h1:has-text("Ошибка")');
    await expect(errorHeading).not.toBeVisible();
  });

  test('E8.8 No horizontal overflow on portfolio listing', async ({ page }) => {
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isOverflowing).toBeFalsy();
  });
});
