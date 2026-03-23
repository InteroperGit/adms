1) [Firefox] › tests\e2e\home.spec.ts:39:3 › home page › E1.6 contact section form is present ────

   Error: page.goto: NS_ERROR_CONNECTION_REFUSED
   Call log:
    - navigating to "http://localhost:4173/", waiting until "load"


      3 | test.describe('home page', () => {
      4 |   test.beforeEach(async ({ page }) => {
    > 5 |     await page.goto('/');
        |                ^
      6 |   });
      7 |
      8 |   test('E1.1 page title contains the agency name', async ({ page }) => {
        at D:\Projects\adms\src\apps\web\advertise-agency-landing\tests\e2e\home.spec.ts:5:16

    Error Context: test-results\home-home-page-E1-6-contact-section-form-is-present-Firefox\error-context.md

2) [Mobile Chrome] › tests\e2e\mobile_portfolio_listing.spec.ts:14:3 › mobile: Portfolio listing (E8) › E8.2 Breadcrumbs render on /portfolio

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('nav').first()
    Expected: visible
    Received: hidden
    Timeout:  10000ms

    Call log:
      - Expect "toBeVisible" with timeout 10000ms
      - waiting for locator('nav').first()
        13 × locator resolved to <nav class="hidden items-center gap-8 md:flex">…</nav>
           - unexpected value "hidden"


      15 |     // BreadCrumbs is the only nav element on the page when the mobile menu is closed
      16 |     const breadcrumbs = page.locator('nav').first();
    > 17 |     await expect(breadcrumbs).toBeVisible({ timeout: 10000 });
         |                               ^
      18 |   });
      19 |
      20 |   test('E8.3 Portfolio cards render on mobile', async ({ page }) => {
        at D:\Projects\adms\src\apps\web\advertise-agency-landing\tests\e2e\mobile_portfolio_listing.spec.ts:17:31

    Error Context: test-results\mobile_portfolio_listing-m-64833-dcrumbs-render-on-portfolio-Mobile-Chrome\error-context.md

3) [Mobile Safari] › tests\e2e\mobile_portfolio_listing.spec.ts:14:3 › mobile: Portfolio listing (E8) › E8.2 Breadcrumbs render on /portfolio

    Error: expect(locator).toBeVisible() failed

    Locator:  locator('nav').first()
    Expected: visible
    Received: hidden
    Timeout:  10000ms

    Call log:
      - Expect "toBeVisible" with timeout 10000ms
      - waiting for locator('nav').first()
        10 × locator resolved to <nav class="hidden items-center gap-8 md:flex">…</nav>
           - unexpected value "hidden"


      15 |     // BreadCrumbs is the only nav element on the page when the mobile menu is closed
      16 |     const breadcrumbs = page.locator('nav').first();
    > 17 |     await expect(breadcrumbs).toBeVisible({ timeout: 10000 });
         |                               ^
      18 |   });
      19 |
      20 |   test('E8.3 Portfolio cards render on mobile', async ({ page }) => {
        at D:\Projects\adms\src\apps\web\advertise-agency-landing\tests\e2e\mobile_portfolio_listing.spec.ts:17:31

    Error Context: test-results\mobile_portfolio_listing-m-64833-dcrumbs-render-on-portfolio-Mobile-Safari\error-context.md

4) [Mobile Safari] › tests\e2e\mobile_portfolio_listing.spec.ts:33:3 › mobile: Portfolio listing (E8) › E8.4 Portfolio card image or title visible

    Error: expect(received).toBeTruthy()

    Received: false

      38 |       const image = firstCard.locator('img');
      39 |       const either = (await title.isVisible()) || (await image.isVisible());
    > 40 |       expect(either).toBeTruthy();
         |                      ^
      41 |     }
      42 |   });
      43 |
        at D:\Projects\adms\src\apps\web\advertise-agency-landing\tests\e2e\mobile_portfolio_listing.spec.ts:40:22

5) [Mobile Safari] › tests\e2e\mobile_portfolio_listing.spec.ts:44:3 › mobile: Portfolio listing (E8) › E8.5 Category nav renders on mobile

    Error: expect(received).toBeGreaterThanOrEqual(expected)

    Expected: >= 1
    Received:    0

      47 |     const links = categoryNav.locator('a');
      48 |     const count = await links.count();
    > 49 |     expect(count).toBeGreaterThanOrEqual(1); // At least "All"
         |                   ^
      50 |   });
      51 |
      52 |   test('E8.6 Tapping a category link changes URL', async ({ page }) => {
        at D:\Projects\adms\src\apps\web\advertise-agency-landing\tests\e2e\mobile_portfolio_listing.spec.ts:49:19

6) [Mobile Safari] › tests\e2e\mobile_portfolio_listing.spec.ts:52:3 › mobile: Portfolio listing (E8) › E8.6 Tapping a category link changes URL

    Error: expect(page).toHaveURL(expected) failed

    Expected pattern: /\/portfolio\/branding\/2023\/03\/artplex$/
    Received string:  "http://localhost:4173/portfolio/branding"
    Timeout: 5000ms

    Call log:
      - Expect "toHaveURL" with timeout 5000ms
        9 × unexpected value "http://localhost:4173/portfolio/branding"


      63 |     await firstCategoryLink.click();
      64 |
    > 65 |     await expect(page).toHaveURL(new RegExp(`${targetHref}$`));
         |                        ^
      66 |   });
      67 |
      68 |   test('E8.7 Category page shows filtered cards', async ({ page }) => {
        at D:\Projects\adms\src\apps\web\advertise-agency-landing\tests\e2e\mobile_portfolio_listing.spec.ts:65:24

    Error Context: test-results\mobile_portfolio_listing-m-18c94-a-category-link-changes-URL-Mobile-Safari\error-context.md

6 failed
[Firefox] › tests\e2e\home.spec.ts:39:3 › home page › E1.6 contact section form is present ─────
[Mobile Chrome] › tests\e2e\mobile_portfolio_listing.spec.ts:14:3 › mobile: Portfolio listing (E8) › E8.2 Breadcrumbs render on /portfolio
[Mobile Safari] › tests\e2e\mobile_portfolio_listing.spec.ts:14:3 › mobile: Portfolio listing (E8) › E8.2 Breadcrumbs render on /portfolio
[Mobile Safari] › tests\e2e\mobile_portfolio_listing.spec.ts:33:3 › mobile: Portfolio listing (E8) › E8.4 Portfolio card image or title visible
[Mobile Safari] › tests\e2e\mobile_portfolio_listing.spec.ts:44:3 › mobile: Portfolio listing (E8) › E8.5 Category nav renders on mobile
[Mobile Safari] › tests\e2e\mobile_portfolio_listing.spec.ts:52:3 › mobile: Portfolio listing (E8) › E8.6 Tapping a category link changes URL
10 skipped
238 passed (5.5m)

To open last HTML report run:

pnpm exec playwright show-report

ELIFECYCLE  Command failed with exit code 1.