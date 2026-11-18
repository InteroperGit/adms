// Browser contracts for the visible service collection and its grid.
import { expect, test } from "./fixtures";

test("services retain named links and adapt their card grid", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const section = page.locator("#services");
  const grid = section.locator(".services-grid");
  const cards = grid.locator(".catalog-card");
  await expect(section.locator("h2#services-heading")).toBeVisible();
  await expect(cards).not.toHaveCount(0);
  await expect(cards.first().locator(".catalog-title a")).toHaveAttribute(
    "href",
    /^\/services\//,
  );
  expect(
    await grid.evaluate(
      (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
    ),
  ).toBe(1);

  await page.setViewportSize({ width: 1280, height: 900 });
  expect(
    await grid.evaluate(
      (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
    ),
  ).toBeGreaterThan(1);
});
