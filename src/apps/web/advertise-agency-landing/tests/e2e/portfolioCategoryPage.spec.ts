import { test, expect } from '@playwright/test';

// Skeleton/shimmer elements use animate-pulse (from Skeleton component) or inline shimmer animation.
// After network idle all images should have loaded and no skeletons should remain visible.

test.describe('portfolioCategoryPage — image loading', () => {
  test('E_IMG.1 /portfolio: no skeleton elements remain after network idle', async ({ page }) => {
    await page.goto('/portfolio');
    await page.waitForLoadState('networkidle');
    // All lazy images above the fold should have loaded and dismissed their skeletons
    const visibleSkeletons = page
      .locator('[class*="animate-pulse"]')
      .filter({ has: page.locator(':visible') });
    await expect(visibleSkeletons).toHaveCount(0);
  });

  test('E_IMG.2 /portfolio/all: no skeleton elements remain after network idle', async ({
    page,
  }) => {
    await page.goto('/portfolio/all');
    await page.waitForLoadState('networkidle');
    const visibleSkeletons = page
      .locator('[class*="animate-pulse"]')
      .filter({ has: page.locator(':visible') });
    await expect(visibleSkeletons).toHaveCount(0);
  });

  test('E_IMG.3 first category page: images load without permanent skeletons', async ({
    page,
  }) => {
    await page.goto('/portfolio');
    await page.waitForLoadState('networkidle');
    // Navigate to the first real category (not 'All')
    const categoryLinks = page.locator('nav a[href^="/portfolio/"]');
    const count = await categoryLinks.count();
    if (count === 0) {
      test.skip();
      return;
    }
    const href = await categoryLinks.first().getAttribute('href');
    await page.goto(href!);
    await page.waitForLoadState('networkidle');
    const visibleSkeletons = page
      .locator('[class*="animate-pulse"]')
      .filter({ has: page.locator(':visible') });
    await expect(visibleSkeletons).toHaveCount(0);
  });

  test('E_IMG.4 navigating from /portfolio/all to a category and back: no stale skeletons', async ({
    page,
  }) => {
    await page.goto('/portfolio/all');
    await page.waitForLoadState('networkidle');

    // Click first category link
    const categoryLinks = page.locator('nav a[href^="/portfolio/"]');
    const count = await categoryLinks.count();
    if (count === 0) {
      test.skip();
      return;
    }
    const categoryHref = await categoryLinks.first().getAttribute('href');
    await page.goto(categoryHref!);
    await page.waitForLoadState('networkidle');

    // Navigate back to /portfolio/all
    await page.goto('/portfolio/all');
    await page.waitForLoadState('networkidle');

    const visibleSkeletons = page
      .locator('[class*="animate-pulse"]')
      .filter({ has: page.locator(':visible') });
    await expect(visibleSkeletons).toHaveCount(0);
  });

  test('E_IMG.5 scrolling to bottom of /portfolio reveals cards without permanent skeletons', async ({
    page,
  }) => {
    await page.goto('/portfolio');
    await page.waitForLoadState('networkidle');

    // Scroll to bottom to trigger lazy-loaded images below the fold
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Give browser time to load newly visible images
    await page.waitForTimeout(1000);

    // Cards should be present
    const cards = page.locator('article');
    await expect(cards.first()).toBeVisible();

    // No skeletons should remain visible after scroll + wait
    const visibleSkeletons = page
      .locator('[class*="animate-pulse"]')
      .filter({ has: page.locator(':visible') });
    await expect(visibleSkeletons).toHaveCount(0);
  });
});
