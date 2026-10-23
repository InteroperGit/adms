// Browser contracts for the project gallery dialog and focus return.
import { expect, test } from "./fixtures";

test("gallery navigation wraps and returns focus to the first tile", async ({
  page,
}) => {
  await page.goto("/projects/1/");
  const gallery = page.locator("[data-gallery]");
  const dialog = gallery.locator("[data-gallery-dialog]");
  const image = gallery.locator("[data-gallery-image]");

  await gallery.locator(".gallery-tile").first().click();
  await expect(dialog).toBeVisible();
  await gallery.locator("[data-gallery-next]").click();
  await expect(image).toHaveAttribute("alt", "Two");
  await gallery.locator("[data-gallery-previous]").click();
  await expect(image).toHaveAttribute("alt", "One");
  await gallery.locator("[data-gallery-previous]").click();
  await expect(image).toHaveAttribute("alt", "Two");
  await expect(
    dialog.locator('[data-gallery-lightbox-thumb="1"]'),
  ).toHaveAttribute("aria-current", "true");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(gallery.locator(".gallery-tile").first()).toBeFocused();
});

test("second gallery tile opens and restores its focus", async ({ page }) => {
  await page.goto("/projects/1/");
  const gallery = page.locator("[data-gallery]");
  const tile = gallery.locator('[data-gallery-open="1"]');
  const dialog = gallery.locator("[data-gallery-dialog]");

  await tile.click();
  await expect(dialog).toBeVisible();
  await expect(gallery.locator("[data-gallery-image]")).toHaveAttribute(
    "alt",
    "Two",
  );
  await dialog.locator("[data-gallery-close]").click();
  await expect(dialog).toBeHidden();
  await expect(tile).toBeFocused();
});

test("nine-image article gallery opens every tile in the lightbox", async ({
  page,
}) => {
  await page.goto("/projects/2/");
  const gallery = page.locator("[data-gallery]").first();
  const tiles = gallery.locator(".gallery-tile");
  const dialog = gallery.locator("[data-gallery-dialog]");

  await expect(tiles).toHaveCount(9);
  await tiles.nth(8).click();
  await expect(dialog).toBeVisible();
  await expect(gallery.locator("[data-gallery-image]")).toHaveAttribute(
    "alt",
    "Gallery image nine",
  );
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(tiles.nth(8)).toBeFocused();
});

test("gallery tiles highlight when hovered by a mouse", async ({ page }) => {
  await page.goto("/projects/2/");
  const tile = page.locator("[data-gallery] .gallery-tile").first();
  const image = tile.locator(".content-media-image");

  await tile.hover();

  await expect(tile).toHaveCSS("outline-style", "solid");
  await expect(tile).toHaveCSS("outline-offset", "-3px");
  await expect(image).not.toHaveCSS("transform", "none");
});

for (const scenario of [
  { name: "three columns", width: 1280, columns: 3, span: "span 2" },
  { name: "two columns", width: 720, columns: 2, span: "span 2" },
  { name: "one column", width: 390, columns: 1, span: "auto" },
]) {
  test(`article tile gallery uses ${scenario.name}`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: 900 });
    await page.goto("/projects/2/");
    const gallery = page.locator("[data-gallery]").first();
    const grid = gallery.locator(".gallery-grid");
    const firstTile = gallery.locator(".gallery-tile").first();
    const columns = await grid.evaluate(
      (element) =>
        getComputedStyle(element).gridTemplateColumns.split(" ").length,
    );
    const firstTileSpan = await firstTile.evaluate(
      (element) => getComputedStyle(element).gridColumnStart,
    );

    expect(columns).toBe(scenario.columns);
    expect(firstTileSpan).toBe(scenario.span);
    await page.screenshot({
      path:
        `output/playwright/task-141/article-2-${scenario.columns}` +
        "-columns.png",
      fullPage: true,
    });
  });
}

test("gallery keyboard controls keep focus inside the native dialog", async ({
  page,
}) => {
  await page.goto("/projects/1/");
  const gallery = page.locator("[data-gallery]");
  const dialog = gallery.locator("[data-gallery-dialog]");
  const image = gallery.locator("[data-gallery-image]");
  const lightboxThumbs = dialog.locator("[data-gallery-lightbox-thumb]");

  await gallery.locator(".gallery-tile").first().click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(image).toHaveAttribute("alt", "Two");
  await page.keyboard.press("ArrowLeft");
  await expect(image).toHaveAttribute("alt", "One");
  await lightboxThumbs.nth(1).click();
  await expect(lightboxThumbs.nth(1)).toHaveAttribute("aria-current", "true");
  await expect(lightboxThumbs.nth(0)).not.toHaveAttribute(
    "aria-current",
    "true",
  );

  await dialog.locator("[data-gallery-close]").focus();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.locator('[data-gallery-lightbox-thumb="1"]'),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.locator("[data-gallery-close]")).toBeFocused();
});

for (const scenario of [
  { name: "desktop", viewport: { width: 1280, height: 800 } },
  { name: "mobile reduced motion", viewport: { width: 375, height: 800 } },
]) {
  test(`first gallery tile works at ${scenario.name}`, async ({ page }) => {
    await page.setViewportSize(scenario.viewport);
    if (scenario.name === "mobile reduced motion") {
      await page.emulateMedia({ reducedMotion: "reduce" });
    }
    await page.goto("/projects/1/");
    const gallery = page.locator("[data-gallery]");
    const dialog = gallery.locator("[data-gallery-dialog]");

    await gallery.locator(".gallery-tile").first().click();
    await expect(dialog).toBeVisible();
    await gallery.locator("[data-gallery-next]").click();
    await expect(gallery.locator("[data-gallery-image]")).toHaveAttribute(
      "alt",
      "Two",
    );
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(gallery.locator(".gallery-tile").first()).toBeFocused();
  });
}
