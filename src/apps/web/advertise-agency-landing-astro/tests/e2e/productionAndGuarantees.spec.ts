// Browser contracts for publication gates and guidance card states.
import { expect, test } from "./fixtures";

const GUIDANCE_CARD_COUNT = 3;

test("guidance cards scroll while evidence is unapproved", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const section = page.locator("#production-and-guarantees");
  const carousel = section.locator(".card-carousel");
  const viewport = carousel.locator(".card-carousel-viewport");
  const cards = carousel.locator(".production-card");
  const controls = carousel.locator(".card-carousel-controls");
  const previous = carousel.locator('[data-direction="-1"]');
  const next = carousel.locator('[data-direction="1"]');
  await expect(cards).toHaveCount(GUIDANCE_CARD_COUNT);
  await expect(carousel).toHaveAttribute("aria-label", "Наши гарантии");
  await expect(section.locator(".production-photos")).toHaveCount(0);
  await expect(section.locator(".warranty-group")).toHaveCount(0);
  await expect(section.locator(".maintenance-group")).toHaveCount(0);

  const firstCard = cards.first();
  await firstCard.focus();
  await expect(firstCard).toBeFocused();
  await expect(controls).toBeVisible();
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();
  expect(
    await firstCard.evaluate((card) => {
      const viewportRect =
        card.parentElement!.parentElement!.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      return (
        cardRect.left >= viewportRect.left &&
        cardRect.right <= viewportRect.right
      );
    }),
  ).toBe(true);
  expect(
    await cards.nth(1).evaluate((card) => {
      const viewportRect =
        card.parentElement!.parentElement!.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      return (
        cardRect.left < viewportRect.right &&
        cardRect.right > viewportRect.right
      );
    }),
  ).toBe(true);
  const scrollStep = await firstCard.evaluate((card) => {
    const gap = Number.parseFloat(
      getComputedStyle(card.parentElement!).columnGap,
    );
    return card.getBoundingClientRect().width + gap;
  });

  await viewport.hover();
  await page.mouse.wheel(scrollStep, 0);
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0);
  await expect(previous).toBeEnabled();
  await viewport.evaluate((node) => {
    node.scrollLeft = 0;
  });
  await expect(previous).toBeDisabled();

  await next.focus();
  await page.keyboard.press("Enter");
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0);
  await expect(previous).toBeEnabled();
  const maximumScroll = await viewport.evaluate(
    (node) => node.scrollWidth - node.clientWidth,
  );
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThanOrEqual(Math.min(scrollStep, maximumScroll) - 1);

  for (let index = 0; index < GUIDANCE_CARD_COUNT; index += 1) {
    if (await next.isDisabled()) {
      break;
    }
    const previousScroll = await viewport.evaluate((node) => node.scrollLeft);
    const targetScroll = Math.min(previousScroll + scrollStep, maximumScroll);
    await next.click();
    await expect
      .poll(() => viewport.evaluate((node) => node.scrollLeft))
      .toBeGreaterThanOrEqual(targetScroll - 1);
  }
  await expect(next).toBeDisabled();

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await viewport.evaluate((node) => getComputedStyle(node).scrollBehavior),
  ).toBe("auto");

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(viewport).toBeVisible();
  await expect(controls).toBeHidden();
});
