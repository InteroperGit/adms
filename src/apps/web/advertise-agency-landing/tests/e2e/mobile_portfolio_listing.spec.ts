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
    // BreadCrumbs is the only nav element on the page when the mobile menu is closed
    const breadcrumbs = page.locator('nav').first();
    await expect(breadcrumbs).toBeVisible({ timeout: 10000 });
  });

  test('E8.3 Portfolio cards render on mobile', async ({ page }) => {
    const cards = page.locator('article');
    const count = await cards.count();
    // It's valid to have 0 cards if repo is empty, but usually there's at least one in examples
    if (count > 0) {
      await expect(cards.first()).toBeVisible();
    } else {
      // Check for empty label if no cards
      const emptyLabel = page.locator('p.col-span-full');
      await expect(emptyLabel).toBeVisible();
    }
  });

  test('E8.4 Portfolio card image or title visible', async ({ page }) => {
    const firstCard = page.locator('article').first();
    const count = await firstCard.count();
    if (count > 0) {
      const title = firstCard.locator('h3');
      const image = firstCard.locator('img');
      const either = (await title.isVisible()) || (await image.isVisible());
      expect(either).toBeTruthy();
    }
  });

  test('E8.5 Category nav renders on mobile', async ({ page }) => {
    // CategoryNav uses AnimatedPillTabs which is a div containing category links
    const categoryNav = page.locator('div').filter({ has: page.locator('a[href="/portfolio"]') }).first();
    const links = categoryNav.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(1); // At least "All"
  });

  test('E8.6 Tapping a category link changes URL', async ({ page }) => {
    const categoryLinks = page.locator('a[href^="/portfolio/"]');
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
