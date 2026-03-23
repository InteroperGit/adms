import { test, expect, type Page } from '@playwright/test';

async function getCaseUrl(page: Page): Promise<string> {
  await page.goto('/portfolio');
  await page.waitForLoadState('networkidle');
  const cardLink = page.locator('article a[href^="/portfolio/"]').first();
  const href = await cardLink.getAttribute('href');
  if (!href) {
    throw new Error('No portfolio case found to test');
  }
  return href;
}

test.describe('mobile: Portfolio case page (E9)', () => {
  let caseUrl: string;

  test.beforeAll(async ({ browser }) => {
    // Get a valid case URL once for the suite
    const page = await browser.newPage();
    // Emulate mobile for URL discovery to ensure we get a mobile-visible card if any
    await page.setViewportSize({ width: 390, height: 844 });
    caseUrl = await getCaseUrl(page);
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(caseUrl);
    // Wait for the specific main-content of CasePage to be sure we're on the right page
    // Using a more reliable way to wait for navigation to settle
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
  });

  test('E9.1 CaseHero h1 visible on mobile', async ({ page }) => {
    // CaseHero renders h1 (text-3xl on mobile)
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Verify it is indeed the title from CaseHero (centered in a container)
    // Badge renders as a div with rounded-full
    const badge = page.locator('.rounded-full').filter({ hasText: /.+/ }).first();
    await expect(badge).toBeVisible();
  });

  test('E9.2 Breadcrumbs render without horizontal overflow', async ({ page }) => {
    // BreadCrumbs uses a nav with aria-label="Breadcrumb"
    // Just find the link and get its parent nav
    const link = page.locator('a[href="/portfolio"]').first();
    await expect(link).toBeVisible({ timeout: 15000 });

    const breadcrumbs = link.locator('..');
    // We already know link is visible, so its parent container should be too.
    // We'll test overflow on the link's ancestor nav if possible, otherwise the parent.
    const isOverflowing = await breadcrumbs.evaluate((el) => {
      const nav = el.closest('nav');
      const target = nav || el;
      return target.scrollWidth > target.clientWidth + 1;
    });
    expect(isOverflowing).toBeFalsy();
  });

  test('E9.3 CaseOverview shows metadata items', async ({ page }) => {
    // CaseOverview renders a grid with metadata items
    // "Клиент" is the label for the client field in Russian
    const section = page.locator('section').filter({ hasText: /Клиент/i }).first();
    await expect(section).toBeVisible({ timeout: 15000 });

    const items = section.locator('.grid > div');

    // Wait for the count to be stable
    await expect(async () => {
      const count = await items.count();
      expect(count).toBeGreaterThanOrEqual(3);
    }).toPass({ timeout: 5000 });
  });

  test('E9.4 CaseCTA button visible and within viewport', async ({ page }) => {
    // CaseCTA renders a section with a button
    // The button link might be /#contact (relative)
    const ctaButton = page.locator('section a[href*="#contact"]').first();

    await ctaButton.scrollIntoViewIfNeeded();
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeInViewport();
  });

  test('E9.5 No horizontal overflow in page content', async ({ page }) => {
    // Wait for everything to settle (animations, images)
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isOverflowing).toBeFalsy();
  });

  test('E9.6 Breadcrumb back link navigates to portfolio', async ({ page }) => {
    // Find the link to the main portfolio listing in the breadcrumbs
    const portfolioLink = page.locator('a[href="/portfolio"]').first();
    await expect(portfolioLink).toBeVisible({ timeout: 15000 });

    await portfolioLink.click();
    await expect(page).toHaveURL(/\/portfolio$/);
  });
});
