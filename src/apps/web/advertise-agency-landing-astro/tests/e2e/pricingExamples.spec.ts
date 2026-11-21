// Browser contracts for responsive pricing example cards.
import { expect, test } from "./fixtures";

const GEOMETRY_TOLERANCE_PX = 1;
const DESKTOP_MIN_WIDTH_PX = 1200;

test("pricing carousel cards fit across breakpoints", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

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

  const image = cards.first().locator("img");
  await image.scrollIntoViewIfNeeded();
  const imageBounds = await image.boundingBox();
  expect(imageBounds).not.toBeNull();
  await page.mouse.move(
    imageBounds!.x + imageBounds!.width / 2,
    imageBounds!.y + imageBounds!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    imageBounds!.x + imageBounds!.width / 2 - 80,
    imageBounds!.y + imageBounds!.height / 2,
    { steps: 4 },
  );
  await page.mouse.up();
  await expect
    .poll(() => viewport.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0);
  await viewport.evaluate((node) => {
    node.style.scrollBehavior = "auto";
    node.scrollLeft = 0;
    node.style.removeProperty("scroll-behavior");
  });

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

  const inquiry = cards.first().locator(".pricing-inquiry");
  await inquiry.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
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

  const geometry = await viewport.evaluate((node) => ({
    viewportWidth: node.clientWidth,
    cardWidth: node.querySelector(".pricing-example")?.getBoundingClientRect()
      .width,
    scrollBehavior: getComputedStyle(node).scrollBehavior,
  }));
  expect(geometry.cardWidth).toBe(geometry.viewportWidth);
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
  });
});
