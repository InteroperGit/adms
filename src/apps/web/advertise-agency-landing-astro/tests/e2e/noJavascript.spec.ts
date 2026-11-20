// Browser contracts for native navigation and no-JavaScript fallbacks.
import { expect, test } from "./fixtures";
import { expectThemeStyles } from "./support/themeStyles";

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("carousel keeps its first card visible without controls", async ({
    page,
  }) => {
    await page.goto("/");

    const carousel = page.locator("#offers cylinder-carousel");
    const activeSlide = carousel.locator("[data-cylinder-slide]").first();

    await expect(activeSlide).toBeVisible();
    await expect(activeSlide.locator(".offers-track-copy")).toBeVisible();
    await expect(carousel.locator(".cylinder-controls")).toBeHidden();
    await expect(carousel.locator("[data-cylinder-slide]")).toHaveCount(3);
  });

  for (const theme of ["light", "dark"] as const) {
    test(`system ${theme} renders the palette without JavaScript`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto("/projects/");
      await expect(page.locator("html")).not.toHaveAttribute("data-theme");
      await expectThemeStyles(page, theme);
      await expect(page.locator("[data-theme-control]")).toBeHidden();
    });
  }

  test("catalog links navigate to projects without JavaScript", async ({
    page,
  }) => {
    await page.goto("/projects/");
    await expect(page.locator("[data-catalog-controls]")).toBeHidden();
    await expect(page.locator("[data-catalog-search-empty]")).toBeHidden();
    await page.locator("[data-project-link]").first().click();
    await expect(page).toHaveURL(/\/projects\/1\//);
    await expect(page.locator("main")).toBeVisible();

    await page.goto("/projects/page/2/");
    const secondProject = page.locator(
      '[data-project-link][href="/projects/2/"]',
    );
    await expect(secondProject).toBeVisible();
    await secondProject.click();
    await expect(page).toHaveURL(/\/projects\/2\//);
    await expect(page.locator("main")).toBeVisible();
  });

  test("gallery and chart remain readable without JavaScript", async ({
    page,
  }) => {
    await page.goto("/projects/1/");
    const singleImage = page.locator(
      '[data-gallery-layout="single"] .gallery-tile',
    );
    await expect(singleImage).toHaveAttribute("href", "/favicon.svg");
    await singleImage.click();
    await expect(page).toHaveURL(/\/favicon\.svg$/);

    await page.goto("/projects/1/");
    const gallery = page.locator('[data-gallery-layout="tiles"]');
    await expect(gallery.locator("[data-gallery-dialog]")).toBeHidden();
    await gallery.locator('[data-gallery-open="1"]').click();
    await expect(page).toHaveURL(/\/favicon\.svg$/);

    await page.goto("/projects/1/");
    const article = page.locator("article");
    const chart = page.locator('[data-chart-figure="chart-e2e-chart"]');
    await expect(article).toContainText("Synthetic copy");
    await expect(
      article.locator('a[href="/favicon.svg"]').first(),
    ).toBeVisible();
    await expect(chart.locator("canvas")).toHaveCount(0);
    await chart.locator("summary").click();
    const table = chart.locator("table");
    await expect(table).toBeVisible();
    await expect(table).toContainText("Alpha");
    await expect(table).toContainText("Beta");
    await expect(table).toContainText("10 units");
    await expect(table).toContainText("20 units");
  });

  test("forms stay protected from submission without JavaScript", async ({
    page,
  }) => {
    const inquiryRequests: string[] = [];
    page.on("request", (request) => {
      if (new URL(request.url()).pathname === "/__fixture/inquiry") {
        inquiryRequests.push(request.url());
      }
    });

    await page.goto("/");
    const inquiry = page.locator("#order-inquiry");
    await expect(inquiry.locator('[type="submit"]')).toBeDisabled();
    await expect(inquiry.locator("noscript")).toBeVisible();

    await page.goto("/services/svetovye-bukvy/");
    const letteringForm = page.locator("form[data-led-letters]");
    await expect(letteringForm.locator('[type="submit"]')).toBeDisabled();
    await expect(letteringForm.locator("noscript")).toBeVisible();
    expect(inquiryRequests).toHaveLength(0);
  });

  test("legal footer links return successful local documents", async ({
    page,
  }) => {
    for (const path of ["/privacy-policy", "/terms-of-use"]) {
      await page.goto("/");
      const link = page.locator(`footer a[href="${path}"]`);
      await expect(link).toBeVisible();
      const responsePromise = page.waitForResponse((response) => {
        const url = new URL(response.url());
        return (
          url.origin === "http://127.0.0.1:4327" &&
          url.pathname.startsWith(path)
        );
      });
      await link.click();
      const response = await responsePromise;
      expect(response.status()).toBe(200);
      await expect(page).toHaveURL(new RegExp(`${path}/?$`));
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("main h1")).toBeVisible();
    }
  });
});
