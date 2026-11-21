// Browser contracts for responsive pricing example cards.
import { expect, test } from "./fixtures";

const GEOMETRY_TOLERANCE_PX = 1;
const DESKTOP_MIN_WIDTH_PX = 1200;
const MOUSE_DRAG_DISTANCE_PX = 280;
const MOUSE_DRAG_COUNT = 5;
const TOUCH_DRAG_DISTANCE_PX = 280;
const TOUCH_DRAG_COUNT = 5;
const TOUCH_POINTER_ID = 1;

test("pricing carousel cards fit across breakpoints", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#cookie-banner [data-cookie-choice='accepted']").click();

  const carousel = page.locator("#pricing .card-carousel");
  const viewport = carousel.locator(".card-carousel-viewport");
  const cards = carousel.locator(".pricing-example");
  await expect(cards).toHaveCount(5);
  const textSurfaceColors = await page.evaluate(() => ({
    project: getComputedStyle(
      document.querySelector("#projects .catalog-copy")!,
    ).backgroundColor,
    pricing: getComputedStyle(
      document.querySelector("#pricing .pricing-example")!,
    ).backgroundColor,
  }));
  expect(textSurfaceColors.pricing).toBe(textSurfaceColors.project);

  for (const width of [390, 767, 768, 1199, DESKTOP_MIN_WIDTH_PX, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    const geometry = await viewport.evaluate((node, tolerance) => {
      const bounds = node.getBoundingClientRect();
      const cardBounds = [
        ...node.querySelectorAll<HTMLElement>(".pricing-example"),
      ].map((card) => card.getBoundingClientRect());
      const visible = cardBounds.filter(
        (card) => card.right > bounds.left && card.left < bounds.right,
      );
      const complete = visible.filter(
        (card) => card.left >= bounds.left && card.right <= bounds.right,
      );
      const buttonTops = [
        ...node.querySelectorAll<HTMLElement>(".pricing-inquiry"),
      ].map((button) => button.getBoundingClientRect().top);

      return {
        equalWidths: cardBounds.every(
          (card) => Math.abs(card.width - cardBounds[0].width) < tolerance,
        ),
        equalHeights: cardBounds.every(
          (card) => Math.abs(card.height - cardBounds[0].height) < tolerance,
        ),
        alignedButtons: buttonTops.every(
          (top) => Math.abs(top - buttonTops[0]) < tolerance,
        ),
        firstCardFits:
          cardBounds[0].left >= bounds.left - tolerance &&
          cardBounds[0].right <= bounds.right + tolerance,
        hasPreview: visible.length > complete.length,
        hasPartialThird:
          cardBounds[2].left < bounds.right &&
          cardBounds[2].right > bounds.right,
        pageOverflows:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      };
    }, GEOMETRY_TOLERANCE_PX);

    expect(geometry.equalWidths, `card widths at ${width}px`).toBe(true);
    expect(geometry.equalHeights, `card heights at ${width}px`).toBe(true);
    expect(geometry.alignedButtons, `button alignment at ${width}px`).toBe(
      true,
    );
    expect(geometry.firstCardFits, `first card at ${width}px`).toBe(true);
    expect(geometry.hasPreview, `next card at ${width}px`).toBe(true);
    if (width >= DESKTOP_MIN_WIDTH_PX) {
      expect(geometry.hasPartialThird, `third card at ${width}px`).toBe(true);
    }
    expect(geometry.pageOverflows, `page width at ${width}px`).toBe(false);

    await viewport.evaluate((node) => {
      const track = node.querySelector<HTMLElement>(".card-carousel-track");
      const firstCard = track?.firstElementChild as HTMLElement | null;
      const gap = Number.parseFloat(getComputedStyle(track!).columnGap) || 0;
      node.style.scrollBehavior = "auto";
      node.style.scrollSnapType = "none";
      node.scrollLeft = (firstCard?.getBoundingClientRect().width ?? 0) + gap;
    });
    await expect
      .poll(() => viewport.evaluate((node) => node.scrollLeft))
      .toBeGreaterThan(0);
    const afterAdvance = await viewport.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      const cards = [
        ...node.querySelectorAll<HTMLElement>(".pricing-example"),
      ].map((card) => card.getBoundingClientRect());
      const visible = cards.filter(
        (card) => card.right > bounds.left && card.left < bounds.right,
      );
      const complete = visible.filter(
        (card) =>
          card.left >= bounds.left - 1 && card.right <= bounds.right + 1,
      );
      return visible.length > complete.length && complete.length > 0;
    });
    expect(afterAdvance, `preview after advancing at ${width}px`).toBe(true);

    await cards.last().scrollIntoViewIfNeeded();
    const lastCardGeometry = await viewport.evaluate((node, tolerance) => {
      const viewportBounds = node.getBoundingClientRect();
      const lastCard = node
        .querySelectorAll<HTMLElement>(".pricing-example")
        .item(4)
        .getBoundingClientRect();
      return {
        fits:
          lastCard.left >= viewportBounds.left - tolerance &&
          lastCard.right <= viewportBounds.right + tolerance,
        cardLeft: lastCard.left,
        cardRight: lastCard.right,
        viewportLeft: viewportBounds.left,
        viewportRight: viewportBounds.right,
        scrollLeft: node.scrollLeft,
        maxScroll: node.scrollWidth - node.clientWidth,
      };
    }, GEOMETRY_TOLERANCE_PX);
    expect(lastCardGeometry.fits, JSON.stringify(lastCardGeometry)).toBe(true);
    await viewport.evaluate((node) => {
      node.style.scrollBehavior = "auto";
      node.scrollLeft = 0;
      node.style.removeProperty("scroll-behavior");
      node.style.removeProperty("scroll-snap-type");
    });
  }

  await viewport.focus();
  await page.keyboard.press("End");
  await expect
    .poll(() =>
      viewport.evaluate(
        (node) => node.scrollLeft >= node.scrollWidth - node.clientWidth - 1,
      ),
    )
    .toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  await viewport.evaluate((node) => {
    node.style.scrollBehavior = "auto";
    node.style.scrollSnapType = "none";
    node.scrollLeft = 0;
  });
  const viewportBounds = await viewport.boundingBox();
  if (!viewportBounds) {
    throw new Error("Pricing carousel viewport is not visible");
  }
  for (let drag = 0; drag < MOUSE_DRAG_COUNT; drag += 1) {
    const scrollStart = await viewport.evaluate((node) => node.scrollLeft);
    const startX = viewportBounds.x + viewportBounds.width - 20;
    const y = viewportBounds.y + viewportBounds.height / 2;
    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(startX - MOUSE_DRAG_DISTANCE_PX, y, {
      steps: 4,
    });
    await page.mouse.up();
    await expect
      .poll(() => viewport.evaluate((node) => node.scrollLeft))
      .toBeGreaterThan(scrollStart);
  }
  await expect
    .poll(() =>
      cards.last().evaluate((card, tolerance) => {
        const cardBounds = card.getBoundingClientRect();
        const viewportBounds =
          card.parentElement!.parentElement!.getBoundingClientRect();
        return (
          cardBounds.left >= viewportBounds.left - tolerance &&
          cardBounds.right <= viewportBounds.right + tolerance
        );
      }, GEOMETRY_TOLERANCE_PX),
    )
    .toBe(true);
  if (browserName === "chromium") {
    await viewport.evaluate((node) => {
      node.scrollLeft = 0;
    });
    await expect
      .poll(() => viewport.evaluate((node) => node.scrollLeft))
      .toBe(0);
    const touchSession = await page.context().newCDPSession(page);
    await touchSession.send("Emulation.setTouchEmulationEnabled", {
      enabled: true,
      maxTouchPoints: 1,
    });
    const touchBounds = await viewport.boundingBox();
    if (!touchBounds) {
      throw new Error("Pricing carousel viewport is not visible");
    }
    const touchY = Math.round(touchBounds.y + touchBounds.height / 2);
    const touchStartX = Math.round(touchBounds.x + touchBounds.width - 20);
    const touchPoint = (x: number) => ({
      id: TOUCH_POINTER_ID,
      x,
      y: touchY,
    });
    for (let swipe = 0; swipe < TOUCH_DRAG_COUNT; swipe += 1) {
      const scrollStart = await viewport.evaluate((node) => node.scrollLeft);
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
      await expect
        .poll(() => viewport.evaluate((node) => node.scrollLeft))
        .toBeGreaterThan(scrollStart);
    }
    await touchSession.detach();
    await expect
      .poll(() =>
        cards.last().evaluate((card, tolerance) => {
          const cardBounds = card.getBoundingClientRect();
          const viewportBounds =
            card.parentElement!.parentElement!.getBoundingClientRect();
          return (
            cardBounds.left >= viewportBounds.left - tolerance &&
            cardBounds.right <= viewportBounds.right + tolerance
          );
        }, GEOMETRY_TOLERANCE_PX),
      )
      .toBe(true);
  }
  await viewport.evaluate((node) => {
    node.style.removeProperty("scroll-behavior");
    node.style.removeProperty("scroll-snap-type");
  });

  const inquiry = cards.first().locator(".pricing-inquiry");
  await inquiry.focus();
  if (browserName === "firefox") {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
  } else {
    await page.keyboard.press("ArrowRight");
  }
  await expect(inquiry).toBeFocused();
  await expect
    .poll(() => inquiry.evaluate((node) => node.matches(":focus-visible")))
    .toBe(true);
});

test("pricing cards remain readable with enlarged text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });

  const card = page.locator("#pricing .pricing-example").first();
  await expect(card).toBeVisible();
  await expect(card.locator(".pricing-quote")).toContainText("₽");
  await expect(card.locator(".pricing-context")).toBeVisible();
  await expect(card.locator(".pricing-conditions")).toBeVisible();
  await expect(card.locator(".pricing-inquiry")).toBeVisible();

  const layout = await card.evaluate((node) => ({
    cardWidth: node.clientWidth,
    contentWidth: node.scrollWidth,
  }));
  expect(layout.contentWidth).toBeLessThanOrEqual(layout.cardWidth);
});

test("a single pricing card fills the carousel with reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const carousel = page.locator("#pricing .card-carousel");
  const viewport = carousel.locator(".card-carousel-viewport");
  await carousel.locator(".pricing-example").evaluateAll((cards) => {
    cards.slice(1).forEach((card) => card.remove());
  });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
  );

  const geometry = await viewport.evaluate((node) => {
    const track = node.querySelector<HTMLElement>(".card-carousel-track")!;
    const card = node.querySelector<HTMLElement>(".pricing-example")!;
    return {
      viewportWidth: node.clientWidth,
      cardWidth: card.getBoundingClientRect().width,
      cardBasis: getComputedStyle(card).flexBasis,
      hasOnlyChild: track.matches(":has(> :only-child)"),
      trackChildren: track.children.length,
      scrollBehavior: getComputedStyle(node).scrollBehavior,
    };
  });
  expect(geometry.cardWidth, JSON.stringify(geometry)).toBe(
    geometry.viewportWidth,
  );
  expect(geometry.scrollBehavior).toBe("auto");
});

test.describe("pricing without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the native pricing track scrolls without JavaScript", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const carousel = page.locator("#pricing .card-carousel");
    const viewport = carousel.locator(".card-carousel-viewport");
    await expect(carousel.locator(".pricing-example")).toHaveCount(5);
    await expect(carousel.locator(".card-carousel-controls")).toBeHidden();
    const nativeScroll = await viewport.evaluate((node) => ({
      overflowX: getComputedStyle(node).overflowX,
      canScroll: node.scrollWidth > node.clientWidth,
    }));
    expect(nativeScroll.overflowX).toBe("auto");
    expect(nativeScroll.canScroll).toBe(true);
    await carousel
      .locator(".pricing-example")
      .last()
      .evaluate((card) => {
        card.scrollIntoView({ inline: "end", block: "nearest" });
      });
    await expect
      .poll(() =>
        carousel
          .locator(".pricing-example")
          .last()
          .evaluate((card, tolerance) => {
            const cardBounds = card.getBoundingClientRect();
            const viewportBounds =
              card.parentElement!.parentElement!.getBoundingClientRect();
            return (
              cardBounds.left >= viewportBounds.left - tolerance &&
              cardBounds.right <= viewportBounds.right + tolerance
            );
          }, GEOMETRY_TOLERANCE_PX),
      )
      .toBe(true);
  });
});
