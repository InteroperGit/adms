// Browser contracts for publication gates and guidance card states.
import { expect, test } from "./fixtures";

const GUIDANCE_CARD_COUNT = 6;
const MOUSE_DRAG_DISTANCE_PX = 320;
const TOUCH_DRAG_DISTANCE_PX = 240;
const TOUCH_START_INSET_PX = 30;
const TOUCH_POINTER_ID = 1;
const GEOMETRY_TOLERANCE_PX = 1;

test("guidance cards use a mobile carousel and wide-screen grid", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const section = page.locator("#production-and-guarantees");
  const carousel = section.locator(".card-carousel");
  const viewport = carousel.locator(".card-carousel-viewport");
  const cards = carousel.locator(".production-card");
  const controls = carousel.locator(".card-carousel-controls");
  await expect(cards).toHaveCount(GUIDANCE_CARD_COUNT);
  await expect(carousel).toHaveAttribute("aria-label", "Наши гарантии");
  await expect(section.locator(".production-photos")).toHaveCount(0);
  await expect(section.locator(".warranty-group")).toHaveCount(0);
  await expect(section.locator(".maintenance-group")).toHaveCount(0);

  const firstCard = cards.first();
  await firstCard.focus();
  await expect(firstCard).toBeFocused();
  await expect(controls).toBeHidden();
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
  await viewport.evaluate((node) => {
    node.scrollLeft = 0;
  });
  await expect.poll(() => viewport.evaluate((node) => node.scrollLeft)).toBe(0);
  if (browserName === "chromium") {
    const bounds = await viewport.boundingBox();
    if (!bounds) {
      throw new Error("Card carousel viewport is not visible");
    }

    const touchSession = await page.context().newCDPSession(page);
    await touchSession.send("Emulation.setTouchEmulationEnabled", {
      enabled: true,
      maxTouchPoints: 1,
    });
    const touchY = Math.round(bounds.y + bounds.height / 2);
    const touchStartX = Math.round(
      bounds.x + bounds.width - TOUCH_START_INSET_PX,
    );
    const touchPoint = (x: number) => ({
      id: TOUCH_POINTER_ID,
      x,
      y: touchY,
    });
    await touchSession.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [touchPoint(touchStartX)],
    });
    await touchSession.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [touchPoint(touchStartX - TOUCH_DRAG_DISTANCE_PX / 2)],
    });
    await touchSession.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [touchPoint(touchStartX - TOUCH_DRAG_DISTANCE_PX)],
    });
    await touchSession.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await touchSession.detach();
    await expect
      .poll(() => viewport.evaluate((node) => node.scrollLeft))
      .toBeGreaterThan(0);
    await viewport.evaluate((node) => {
      node.scrollLeft = 0;
    });
  }

  const mobileBounds = await viewport.boundingBox();
  if (!mobileBounds) {
    throw new Error("Card carousel viewport is not visible");
  }
  const dragStartX = mobileBounds.x + mobileBounds.width / 2;
  const dragY = mobileBounds.y + mobileBounds.height / 2;
  await page.mouse.move(dragStartX, dragY);
  await page.mouse.down();
  await page.mouse.move(dragStartX - MOUSE_DRAG_DISTANCE_PX, dragY, {
    steps: 5,
  });
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0);
  expect(
    await page.evaluate(() => window.getSelection()?.toString() ?? ""),
  ).toBe("");
  await page.mouse.up();
  await expect(viewport).not.toHaveClass(/is-mouse-pressed/);
  await viewport.evaluate((node) => {
    node.scrollLeft = node.scrollWidth;
  });
  await expect
    .poll(() =>
      cards.last().evaluate((card) => {
        const viewport =
          card.parentElement!.parentElement!.getBoundingClientRect();
        return Math.abs(card.getBoundingClientRect().right - viewport.right);
      }),
    )
    .toBeLessThanOrEqual(GEOMETRY_TOLERANCE_PX);
  await viewport.evaluate((node) => {
    node.scrollLeft = 0;
  });
  await firstCard.evaluate((card) => {
    (card as HTMLElement).blur();
  });
  await page.mouse.move(0, 0);

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await viewport.evaluate((node) => getComputedStyle(node).scrollBehavior),
  ).toBe("auto");

  for (const width of [800, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(viewport).toBeVisible();
    await expect(controls).toBeHidden();
    expect(
      await carousel
        .locator(".card-carousel-track")
        .evaluate((track) => getComputedStyle(track).display),
    ).toBe("grid");
    expect(
      await viewport.evaluate((node) => node.scrollWidth - node.clientWidth),
    ).toBeLessThanOrEqual(GEOMETRY_TOLERANCE_PX);
    await expect(cards).toHaveCount(GUIDANCE_CARD_COUNT);
  }
});
