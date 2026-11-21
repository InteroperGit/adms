// Browser contracts for the ordered process and its keyboard states.
import { blockExternalRequests, expect, test } from "./fixtures";

const MOUSE_DRAG_DISTANCE_PX = 240;
const TOUCH_DRAG_DISTANCE_PX = 180;
const TOUCH_START_INSET_PX = 30;
const TOUCH_POINTER_ID = 1;
const GEOMETRY_TOLERANCE_PX = 1;

test("ordering steps scroll in one accessible horizontal carousel", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const carousel = page.locator("#ordering-process .card-carousel");
  const viewport = carousel.locator(".card-carousel-viewport");
  const list = carousel.locator("ol.card-carousel-list");
  const items = list.locator(":scope > li");
  await expect(carousel).toHaveAttribute("aria-label", "Как проходит заказ");
  await expect(items).toHaveCount(5);
  await expect(items.first().locator("article")).toHaveAttribute(
    "tabindex",
    "0",
  );
  await expect(items.first().locator(".ordering-step-number")).toHaveText("01");
  await expect(
    page.locator('#ordering-process a[href="/#order-inquiry"]'),
  ).toBeVisible();

  for (const width of [390, 767, 768, 1199, 1200, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const geometry = await viewport.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      const cardElements = [
        ...node.querySelectorAll<HTMLElement>(".card-carousel-list > li"),
      ];
      const cards = cardElements.map((card) => card.getBoundingClientRect());
      const visible = cards.filter(
        (card) => card.right > bounds.left && card.left < bounds.right,
      );
      const fullyVisible = visible.filter(
        (card) => card.left >= bounds.left && card.right <= bounds.right,
      );
      const icons = cardElements.map((card, index) => {
        const icon = card.querySelector<HTMLElement>(".ordering-icon")!;
        const iconBounds = icon.getBoundingClientRect();
        return {
          left: iconBounds.left - cards[index].left,
          top: iconBounds.top - cards[index].top,
          bottom: iconBounds.bottom - cards[index].top,
        };
      });

      return {
        firstCardFits:
          cards[0].left >= bounds.left && cards[0].right <= bounds.right,
        equalWidths: cards.every(
          (card) => Math.abs(card.width - cards[0].width) < 1,
        ),
        hasNextPreview: visible.length > fullyVisible.length,
        iconsAlign: icons.every(
          (icon) =>
            Math.abs(icon.left - icons[0].left) < 1 &&
            Math.abs(icon.top - icons[0].top) < 1 &&
            Math.abs(icon.bottom - icons[0].bottom) < 1,
        ),
        overflowsPage:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      };
    });

    expect(geometry.firstCardFits, `first card at ${width}px`).toBe(true);
    expect(geometry.equalWidths, `equal cards at ${width}px`).toBe(true);
    expect(geometry.hasNextPreview, `next preview at ${width}px`).toBe(true);
    expect(geometry.iconsAlign, `step icons at ${width}px`).toBe(true);
    expect(geometry.overflowsPage, `page width at ${width}px`).toBe(false);
  }

  await page.setViewportSize({ width: 1280, height: 900 });
  const firstCard = items.first().locator("article");
  const initialBackground = await firstCard.evaluate(
    (card) => getComputedStyle(card).backgroundColor,
  );
  await firstCard.hover();
  await expect(firstCard).toHaveCSS("background-color", initialBackground);
  await firstCard.click();
  await expect(firstCard).toHaveCSS("background-color", initialBackground);
  const controls = carousel.locator(".card-carousel-controls");
  const previous = carousel.locator('[data-direction="-1"]');
  const next = carousel.locator('[data-direction="1"]');
  await carousel.hover();
  await expect(controls).toBeVisible();
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();
  await next.click();
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0);
  await expect(previous).toBeEnabled();
  await previous.click();
  await expect.poll(() => viewport.evaluate((node) => node.scrollLeft)).toBe(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.keyboard.press("Tab");
  await viewport.focus();
  await expect(viewport).toBeFocused();
  await expect(viewport).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("End");
  await expect
    .poll(() =>
      viewport.evaluate(
        (node) => node.scrollLeft >= node.scrollWidth - node.clientWidth - 1,
      ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      items.last().evaluate((card) => {
        const bounds = card.getBoundingClientRect();
        const scrollViewport =
          card.parentElement!.parentElement!.parentElement!;
        const viewportBounds = scrollViewport.getBoundingClientRect();
        return Math.abs(bounds.right - viewportBounds.right);
      }),
    )
    .toBeLessThanOrEqual(GEOMETRY_TOLERANCE_PX);

  await viewport.evaluate((node) => {
    node.scrollLeft = 0;
  });
  await expect.poll(() => viewport.evaluate((node) => node.scrollLeft)).toBe(0);
  await viewport.hover();
  await page.mouse.wheel(500, 0);
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0);
  await viewport.evaluate((node) => {
    node.style.scrollBehavior = "auto";
    node.scrollLeft = 0;
  });

  if (browserName === "chromium") {
    const bounds = await viewport.boundingBox();
    if (!bounds) {
      throw new Error("Ordering carousel viewport is not visible");
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
    const firstItemLeft = await items
      .first()
      .evaluate((item) => item.getBoundingClientRect().left);
    const touchStartingScrollLeft = await viewport.evaluate(
      (node) => node.scrollLeft,
    );
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
    const touchDrag = await viewport.evaluate(
      (node, initial) => node.scrollLeft - initial,
      touchStartingScrollLeft,
    );
    const touchItemDelta = await items
      .first()
      .evaluate(
        (item, initialLeft) => item.getBoundingClientRect().left - initialLeft,
        firstItemLeft,
      );
    const isDragging = await viewport.evaluate((node) =>
      node.classList.contains("is-dragging"),
    );
    expect({ touchDrag, touchItemDelta, isDragging }).toEqual({
      touchDrag: TOUCH_DRAG_DISTANCE_PX,
      touchItemDelta: -TOUCH_DRAG_DISTANCE_PX,
      isDragging: true,
    });
    await touchSession.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(viewport).not.toHaveClass(/is-dragging/);
    await touchSession.detach();
    await expect
      .poll(() => viewport.evaluate((node) => node.scrollLeft))
      .toBeGreaterThan(0);
    await viewport.evaluate((node) => {
      node.scrollLeft = 0;
    });
    await expect
      .poll(() => viewport.evaluate((node) => node.scrollLeft))
      .toBe(0);
  }

  const bounds = await viewport.boundingBox();
  if (!bounds) {
    throw new Error("Ordering carousel viewport is not visible");
  }
  const startX = bounds.x + bounds.width / 2;
  const startY = bounds.y + bounds.height / 2;
  const firstItemLeft = await items
    .first()
    .evaluate((item) => item.getBoundingClientRect().left);
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await expect(viewport).toHaveClass(/is-mouse-pressed/);
  await page.mouse.move(startX - MOUSE_DRAG_DISTANCE_PX, startY, {
    steps: 5,
  });
  await expect
    .poll(() =>
      items
        .first()
        .evaluate(
          (item, initialLeft) =>
            item.getBoundingClientRect().left - initialLeft,
          firstItemLeft,
        ),
    )
    .toBeCloseTo(-MOUSE_DRAG_DISTANCE_PX, 0);
  expect(
    await page.evaluate(() => window.getSelection()?.toString() ?? ""),
  ).toBe("");
  await page.mouse.up();
  await expect(viewport).not.toHaveClass(/is-mouse-pressed/);
  await expect(viewport).not.toHaveClass(/is-dragging/);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(viewport).toHaveCSS("scroll-behavior", "auto");
  expect(
    await items
      .first()
      .locator("article")
      .evaluate((node) =>
        Number.parseFloat(getComputedStyle(node).transitionDuration),
      ),
  ).toBeLessThanOrEqual(0.001);
});

test("ordering steps remain natively scrollable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  await blockExternalRequests(context);
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const viewport = page.locator("#ordering-process .card-carousel-viewport");
  const items = page.locator("#ordering-process ol.card-carousel-list > li");
  await expect(items).toHaveCount(5);
  expect(
    await viewport.evaluate((node) => node.scrollWidth > node.clientWidth),
  ).toBe(true);
  await viewport.focus();
  await viewport.hover();
  await page.mouse.wheel(1200, 0);
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft > 0))
    .toBe(true);

  await context.close();
});
