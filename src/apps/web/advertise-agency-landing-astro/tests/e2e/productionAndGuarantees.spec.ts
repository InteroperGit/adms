// Browser contracts for publication gates and guidance card states.
import { expect, test } from "./fixtures";

test("production guidance stays usable while evidence is unapproved", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const section = page.locator("#production-and-guarantees");
  const guidance = section.locator(".production-guidance");
  const cards = guidance.locator(".production-card");
  await expect(cards).not.toHaveCount(0);
  await expect(section.locator(".production-photos")).toHaveCount(0);
  await expect(section.locator(".warranty-group")).toHaveCount(0);
  await expect(section.locator(".maintenance-group")).toHaveCount(0);

  const firstCard = cards.first();
  await firstCard.focus();
  await expect(firstCard).toBeFocused();
  expect(
    await guidance.evaluate(
      (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
    ),
  ).toBe(1);

  await page.setViewportSize({ width: 1280, height: 900 });
  expect(
    await guidance.evaluate(
      (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
    ),
  ).toBeGreaterThan(1);

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await firstCard.evaluate((node) =>
      Number.parseFloat(getComputedStyle(node).transitionDuration),
    ),
  ).toBeLessThanOrEqual(0.001);
});
