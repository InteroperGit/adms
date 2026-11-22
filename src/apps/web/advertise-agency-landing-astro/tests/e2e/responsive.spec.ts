// Browser contracts for responsive routes and failed image geometry.
import { expect, test } from "./fixtures";

const routes = ["/", "/projects/", "/projects/1/", "/services/neon/"];
const widths = [320, 375, 1440];
const themes = ["light", "dark"] as const;
const CENTER_ALIGNMENT_TOLERANCE_PX = 1;

for (const colorScheme of themes) {
  test(`article reflows at 200% text in ${colorScheme}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.emulateMedia({ colorScheme });
    await page.goto("/projects/1/");
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await expect(page.locator("article")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  });
}

for (const route of routes) {
  for (const width of widths) {
    for (const colorScheme of themes) {
      test(`${route} at ${width}px ${colorScheme}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.emulateMedia({
          colorScheme,
          reducedMotion: "reduce",
        });
        await page.goto(route);

        if (route === "/") {
          const banner = page.locator("#cookie-banner");
          if (await banner.isVisible()) {
            await banner.locator('[data-cookie-choice="declined"]').click();
          }
          const stats = page.locator("#about dl");
          await expect(stats).toHaveCSS("grid-auto-flow", "row");
          const columns = await stats.evaluate((list) =>
            getComputedStyle(list).gridTemplateColumns.split(" "),
          );
          expect(columns).toHaveLength(width === 1440 ? 3 : 1);

          const action = page.locator("#projects .projects-catalog-link");
          const button = action.locator('a[href="/projects/"]');
          const [actionBounds, buttonBounds] = await Promise.all([
            action.boundingBox(),
            button.boundingBox(),
          ]);
          if (!actionBounds || !buttonBounds) {
            throw new Error("Project catalogue action has no layout box");
          }
          expect(
            Math.abs(
              actionBounds.x +
                actionBounds.width / 2 -
                buttonBounds.x -
                buttonBounds.width / 2,
            ),
          ).toBeLessThan(CENTER_ALIGNMENT_TOLERANCE_PX);
        }

        await expect(page.locator("main")).toBeVisible();
        await expect(page.locator("main h1")).toHaveCount(1);
        await expect
          .poll(() =>
            page.evaluate(
              () =>
                document.documentElement.scrollWidth <=
                document.documentElement.clientWidth + 1,
            ),
          )
          .toBe(true);

        const footer = page.locator("footer");
        await footer.scrollIntoViewIfNeeded();
        await expect(footer).toBeVisible();
      });
    }
  }
}

test("homepage keeps alternating surfaces and shared action spacing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const actionSelectors = [
    "#projects .projects-catalog-link",
    "#ordering-process .ordering-action",
    "#production-and-guarantees .production-action",
    "#faq .faq-inquiry",
  ];
  const actionMargins = [];
  for (const selector of actionSelectors) {
    const action = page.locator(selector);
    if (await action.count()) {
      actionMargins.push(
        await action.evaluate((element) => getComputedStyle(element).marginTop),
      );
    }
  }
  expect(actionMargins.length).toBeGreaterThan(0);
  expect(new Set(actionMargins).size).toBe(1);

  const offers = page.locator(".homepage-sections > #offers");
  await expect(offers).toBeVisible();
  const sectionCount = await page
    .locator(".homepage-sections > section")
    .count();
  await offers.evaluate((section) => section.remove());
  const surfaces = await page
    .locator(".homepage-sections > section")
    .evaluateAll((sections) =>
      sections.map((section) => getComputedStyle(section).backgroundColor),
    );

  expect(surfaces).toHaveLength(sectionCount - 1);
  for (let index = 1; index < surfaces.length; index += 1) {
    expect(surfaces[index]).not.toBe(surfaces[index - 1]);
  }
});

test("failed service image preserves loaded geometry", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.emulateMedia({
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  await page.route("**/favicon.svg", (route) => route.abort());
  await page.goto("/services/neon/");

  const image = page.locator('.service-reading img[alt]:not([alt=""])').first();
  await expect(image).toHaveJSProperty("complete", true);
  await expect(image).toHaveJSProperty("naturalWidth", 0);
  const failedFrame = page
    .locator(".service-reading .responsive-image-frame")
    .first();
  const failedBox = await failedFrame.boundingBox();
  if (!failedBox) throw new Error("Failed image has no layout box");
  expect(failedBox.width).toBeGreaterThan(0);
  expect(failedBox.height).toBeGreaterThan(0);
  expect(failedBox.x).toBeGreaterThanOrEqual(-1);
  expect(failedBox.x + failedBox.width).toBeLessThanOrEqual(376);

  const cleanPage = await page.context().newPage();
  await cleanPage.setViewportSize({ width: 375, height: 800 });
  await cleanPage.emulateMedia({
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  await cleanPage.goto("/services/neon/");
  const cleanImage = cleanPage
    .locator('.service-reading img[alt]:not([alt=""])')
    .first();
  await expect(cleanImage).toHaveJSProperty("complete", true);
  await expect
    .poll(() =>
      cleanImage.evaluate(
        (element) => (element as HTMLImageElement).naturalWidth,
      ),
    )
    .toBeGreaterThan(0);
  const cleanFrame = cleanPage
    .locator(".service-reading .responsive-image-frame")
    .first();
  const cleanBox = await cleanFrame.boundingBox();
  if (!cleanBox) throw new Error("Loaded image has no layout box");
  expect(cleanBox.width).toBeGreaterThan(0);
  expect(cleanBox.height).toBeGreaterThan(0);
  expect(failedBox.width).toBeCloseTo(cleanBox.width, 0);
  expect(failedBox.height).toBeCloseTo(cleanBox.height, 0);
  await cleanPage.close();
});
