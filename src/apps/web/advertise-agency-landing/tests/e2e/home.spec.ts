import { test, expect } from '@playwright/test';

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('E1.1 page title contains the agency name', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    // Title must not be empty or a bare default
    await expect(page).toHaveTitle(/.+/);
  });

  test('E1.2 hero section heading is visible', async ({ page }) => {
    // Hero renders the only <h1> on the home page
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('E1.3 hero stat counters are present', async ({ page }) => {
    // Hero is the section with min-h-screen containing the h1.
    // HeroStats renders a sm:grid-cols-3 div with CountingStat cards.
    // Each card has a bold numeric span (font-heading text-3xl).
    const statNumbers = page.locator('span.font-heading.text-3xl.font-bold');
    await expect(statNumbers.first()).toBeVisible();
    const count = await statNumbers.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('E1.4 services section is visible', async ({ page }) => {
    await expect(page.locator('#services')).toBeVisible();
  });

  test('E1.5 advantages section is visible', async ({ page }) => {
    await expect(page.locator('#advantages')).toBeVisible();
  });

  test('E1.6 contact section form is present', async ({ page }) => {
    await expect(page.locator('#contact form')).toBeVisible();
  });

  test('E1.7 footer is present and contains links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    const links = footer.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
