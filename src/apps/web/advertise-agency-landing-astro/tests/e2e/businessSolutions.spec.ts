// Check business solution cards and their nested galleries in a real browser.
import { expect, test } from "./fixtures";

const WIDTHS = [390, 767, 768, 1199, 1200, 1440];
const GEOMETRY_TOLERANCE_PX = 1;
const MOBILE_MAX_WIDTH_PX = 767;
const STANDARD_DESKTOP_MAX_WIDTH_PX = 1199;

test("business solutions carousel fits and previews cards", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const carousel = page.locator("#business-solutions .card-carousel");
  const viewport = carousel.locator(".card-carousel-viewport");
  const cards = carousel.locator(".solution-item");
  await expect(cards).toHaveCount(4);

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 768 });
    const geometry = await viewport.evaluate((node, tolerance) => {
      const viewportBounds = node.getBoundingClientRect();
      const cardBounds = [
        ...node.querySelectorAll<HTMLElement>(".solution-item"),
      ].map((card) => card.getBoundingClientRect());
      const visible = cardBounds.filter(
        (card) =>
          card.right > viewportBounds.left && card.left < viewportBounds.right,
      );
      const complete = visible.filter(
        (card) =>
          card.left >= viewportBounds.left - tolerance &&
          card.right <= viewportBounds.right + tolerance,
      );
      const buttonBounds = [
        ...node.querySelectorAll<HTMLElement>(".solution-inquiry"),
      ].map((button) => button.getBoundingClientRect());

      return {
        equalWidths: cardBounds.every(
          (card) => Math.abs(card.width - cardBounds[0].width) < tolerance,
        ),
        equalHeights: cardBounds.every(
          (card) => Math.abs(card.height - cardBounds[0].height) < tolerance,
        ),
        buttonsCentered: buttonBounds.every((button, index) => {
          const card = cardBounds[index];
          return (
            Math.abs(
              button.left + button.width / 2 - (card.left + card.width / 2),
            ) < tolerance
          );
        }),
        buttonsAligned: buttonBounds.every(
          (button) => Math.abs(button.top - buttonBounds[0].top) < tolerance,
        ),
        hasPreview: visible.length > complete.length,
        completeCount: complete.length,
        firstFits:
          cardBounds[0].left >= viewportBounds.left - tolerance &&
          cardBounds[0].right <= viewportBounds.right + tolerance,
        pageOverflows:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      };
    }, GEOMETRY_TOLERANCE_PX);

    expect(geometry.equalWidths, `card widths at ${width}px`).toBe(true);
    expect(geometry.equalHeights, `card heights at ${width}px`).toBe(true);
    expect(geometry.buttonsCentered, `button centering at ${width}px`).toBe(
      true,
    );
    expect(geometry.buttonsAligned, `button alignment at ${width}px`).toBe(
      true,
    );
    expect(geometry.hasPreview, `next solution at ${width}px`).toBe(true);
    const expectedCompleteCount =
      width <= MOBILE_MAX_WIDTH_PX
        ? 1
        : width <= STANDARD_DESKTOP_MAX_WIDTH_PX
          ? 2
          : 3;
    expect(geometry.completeCount, `complete cards at ${width}px`).toBe(
      expectedCompleteCount,
    );
    expect(geometry.firstFits, `first card at ${width}px`).toBe(true);
    expect(geometry.pageOverflows, `page width at ${width}px`).toBe(false);

    const advancedPreview = await viewport.evaluate((node) => {
      const track = node.querySelector<HTMLElement>(".card-carousel-track")!;
      const firstCard = track.firstElementChild as HTMLElement;
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      node.style.scrollSnapType = "none";
      node.scrollLeft = firstCard.getBoundingClientRect().width + gap;
      const bounds = node.getBoundingClientRect();
      const cards = [
        ...node.querySelectorAll<HTMLElement>(".solution-item"),
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
    expect(advancedPreview, `preview after scrolling at ${width}px`).toBe(true);
    await viewport.evaluate((node) => {
      node.style.scrollBehavior = "auto";
      node.scrollLeft = node.scrollWidth;
    });
    await expect
      .poll(() => viewport.evaluate((node) => node.scrollLeft))
      .toBeGreaterThan(0);
    const lastFits = await cards.last().evaluate((card) => {
      const viewportBounds = card
        .closest(".card-carousel-viewport")!
        .getBoundingClientRect();
      const cardBounds = card.getBoundingClientRect();
      return (
        cardBounds.left >= viewportBounds.left - 1 &&
        cardBounds.right <= viewportBounds.right + 1
      );
    });
    expect(lastFits, `last solution at ${width}px`).toBe(true);
    await viewport.evaluate((node) => {
      node.scrollLeft = 0;
      node.style.removeProperty("scroll-behavior");
    });
  }
});

test("business solution cards fit tablet and desktop viewports", async ({
  page,
}) => {
  for (const viewportSize of [
    { width: 1024, height: 768 },
    { width: 1440, height: 700 },
  ]) {
    await page.setViewportSize(viewportSize);
    await page.goto("/");

    const cards = page.locator("#business-solutions .solution-item");
    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      const bounds = await card.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.height).toBeLessThanOrEqual(viewportSize.height);
      const stack = await card.evaluate((node) =>
        [
          ".solution-gallery",
          ".solution-heading",
          ".solution-copy",
          ".solution-inquiry",
        ].map(
          (selector) =>
            node.querySelector<HTMLElement>(selector)!.getBoundingClientRect()
              .top,
        ),
      );
      expect(stack).toEqual([...stack].sort((first, second) => first - second));
      await expect(card.locator(".solution-inquiry")).toBeVisible();
      await expect(card.locator(".solution-gallery figcaption")).toContainText(
        "Test-only image rights",
      );
    }
  }
});

test("business solution sections align across cards", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");

  const alignment = await page
    .locator("#business-solutions .card-carousel-viewport")
    .evaluate((viewport) => {
      const selectors = [
        ".solution-gallery",
        ".solution-heading",
        ".solution-summary",
        ".solution-task",
        ".solution-approach",
        ".solution-example",
        ".solution-attribution",
        ".solution-inquiry",
      ];
      const cards = [
        ...viewport.querySelectorAll<HTMLElement>(".solution-item"),
      ];
      const rows = selectors.map((selector) =>
        cards.map(
          (card) =>
            card.querySelector<HTMLElement>(selector)!.getBoundingClientRect()
              .top,
        ),
      );
      const firstCard = cards[0];
      const cardBounds = firstCard.getBoundingClientRect();
      const galleryBounds = firstCard
        .querySelector<HTMLElement>(".solution-gallery")!
        .getBoundingClientRect();
      const borderWidth = Number.parseFloat(
        getComputedStyle(firstCard).borderTopWidth,
      );
      const button = firstCard.querySelector<HTMLElement>(".solution-inquiry")!;

      return {
        rows,
        galleryEdges: {
          top: galleryBounds.top - cardBounds.top - borderWidth,
          left: galleryBounds.left - cardBounds.left - borderWidth,
          right: cardBounds.right - galleryBounds.right - borderWidth,
        },
        buttonHasTopSpacing:
          Number.parseFloat(getComputedStyle(button).marginTop) > 0,
      };
    });

  for (const [index, row] of alignment.rows.entries()) {
    expect(row, `section row ${index + 1}`).toEqual(row.map(() => row[0]));
  }
  for (const [edge, offset] of Object.entries(alignment.galleryEdges)) {
    expect(Math.abs(offset), `gallery ${edge} edge offset`).toBeLessThan(1);
  }
  expect(alignment.buttonHasTopSpacing).toBe(true);
});

test("nested photo controls stay within the current solution", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");

  const gallery = page.locator("#business-solutions .solution-gallery").first();
  const firstCard = page.locator("#business-solutions .solution-item").first();
  const firstImage = gallery.locator(".carousel-slide").first();
  const nextImage = gallery.locator(".carousel-slide").nth(1);
  const nextImageButton = gallery.locator(
    ".carousel-arrow[data-direction='1']",
  );
  await firstCard.scrollIntoViewIfNeeded();
  await expect(firstImage).toBeVisible();
  await nextImageButton.evaluate((button) => {
    button.focus({ preventScroll: true });
  });
  await page.keyboard.press("Enter");
  await expect(nextImage).toBeVisible();
  await expect(firstCard).toBeInViewport();
  await expect(gallery.locator("figcaption")).toContainText(
    "Test-only image rights",
  );
});

test("business gallery captions stay accessible and images are taller", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");

  const gallery = page.locator("#business-solutions .solution-gallery").first();
  const caption = gallery.locator("figcaption");
  const image = gallery.locator(".carousel-slide").first();
  const captionDimensions = await caption.boundingBox();
  const imageDimensions = await image.boundingBox();

  expect(captionDimensions).not.toBeNull();
  expect(captionDimensions!.height).toBeLessThanOrEqual(1);
  await expect(caption).toContainText("Test-only image rights");
  expect(imageDimensions).not.toBeNull();
  expect(imageDimensions!.height / imageDimensions!.width).toBeGreaterThan(0.5);
});

test("business inquiry buttons match the pricing CTA size", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");

  const businessButton = page
    .locator("#business-solutions .solution-inquiry")
    .first();
  const pricingButton = page.locator("#pricing .pricing-inquiry").first();
  const readMetrics = (element: typeof businessButton) =>
    element.evaluate((button) => {
      const style = getComputedStyle(button);
      return {
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        minHeight: style.minHeight,
        paddingBlock: style.paddingBlock,
      };
    });

  await expect(businessButton).toHaveClass(/btn-md/);
  expect(await readMetrics(businessButton)).toEqual(
    await readMetrics(pricingButton),
  );
});

test("business carousel supports keyboard and reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const carousel = page.locator("#business-solutions .card-carousel");
  const viewport = carousel.locator(".card-carousel-viewport");
  await expect(carousel.locator(".solution-item")).toHaveCount(4);
  await viewport.focus();
  await page.keyboard.press("End");
  await expect
    .poll(() =>
      viewport.evaluate(
        (node) => node.scrollLeft >= node.scrollWidth - node.clientWidth - 1,
      ),
    )
    .toBe(true);
  expect(
    await viewport.evaluate((node) => getComputedStyle(node).scrollBehavior),
  ).toBe("auto");
});

test("business solution content stays inside narrow enlarged cards", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });

  const card = page.locator("#business-solutions .solution-item").first();
  await expect(card).toBeVisible();
  await expect(card.locator(".solution-inquiry")).toBeVisible();
  const bounds = await card.evaluate((node) => ({
    width: node.clientWidth,
    contentWidth: node.scrollWidth,
  }));
  expect(bounds.contentWidth).toBeLessThanOrEqual(bounds.width);
});

test.describe("business solutions without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("native business carousel scrolls without JavaScript", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const carousel = page.locator("#business-solutions .card-carousel");
    const viewport = carousel.locator(".card-carousel-viewport");
    await expect(carousel.locator(".solution-item")).toHaveCount(4);
    await expect(carousel.locator(".card-carousel-controls")).toBeHidden();
    expect(
      await viewport.evaluate(
        (node) =>
          node.scrollWidth > node.clientWidth &&
          getComputedStyle(node).overflowX === "auto",
      ),
    ).toBe(true);
  });
});
