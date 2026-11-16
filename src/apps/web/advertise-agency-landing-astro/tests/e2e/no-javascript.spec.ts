// Browser contracts for native navigation and no-JavaScript fallbacks.
import { expect, test } from "./fixtures";
import { expectThemeStyles } from "./support/theme-styles";

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("carousel starts with only its first slide visible", async ({
    page,
  }) => {
    await page.goto("/");

    const carousel = page.locator("#offers-carousel");
    const slides = carousel.locator(".carousel-slide");

    await expect(slides).toHaveCount(3);
    await expect(
      carousel.locator(".carousel-slide:not([aria-hidden])"),
    ).toHaveCount(1);
    await expect(slides.nth(1)).toHaveCSS("visibility", "hidden");
    await expect(slides.nth(2)).toHaveCSS("visibility", "hidden");
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
    const gallery = page.locator("[data-gallery]");
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
