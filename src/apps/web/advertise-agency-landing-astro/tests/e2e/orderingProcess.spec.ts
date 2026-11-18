// Browser contracts for the ordered process and its keyboard states.
import { expect, test } from "./fixtures";

test("ordering steps keep list, focus, layout and motion behavior", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const list = page.locator("#ordering-process ol.ordering-steps");
  const items = list.locator(":scope > li");
  await expect(items).toHaveCount(5);
  await expect(items.first().locator("article")).toHaveAttribute(
    "tabindex",
    "0",
  );
  await expect(items.first().locator(".ordering-step-number")).toHaveText("01");
  await expect(
    page.locator('#ordering-process a[href="/#order-inquiry"]'),
  ).toBeVisible();

  const card = items.first().locator("article");
  await card.focus();
  await expect(card).toBeFocused();
  expect(
    await list.evaluate(
      (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
    ),
  ).toBe(1);

  await page.setViewportSize({ width: 1280, height: 900 });
  expect(
    await list.evaluate(
      (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
    ),
  ).toBe(3);

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await card.evaluate((node) =>
      Number.parseFloat(getComputedStyle(node).transitionDuration),
    ),
  ).toBeLessThanOrEqual(0.001);
});
