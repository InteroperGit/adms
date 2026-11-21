// Verify the reusable carousel through the published offers section.
import { blockExternalRequests, expect, test } from "../fixtures";

test("renders slides once and shows the first without JS", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  await blockExternalRequests(context);
  const page = await context.newPage();
  await page.goto("/");

  const carousel = page.locator("#offers cylinder-carousel");
  await expect(carousel.locator("[data-cylinder-slide]")).toHaveCount(3);
  await expect(carousel.locator("[data-cylinder-slide]").first()).toBeVisible();
  await expect(carousel.locator("[data-cylinder-slide]").nth(1)).toBeHidden();
  await expect(carousel.locator(".cylinder-controls")).toBeHidden();
  await context.close();
});

test("moves existing slides with keyboard and pointer controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const carousel = page.locator("#offers cylinder-carousel");
  const slides = carousel.locator("[data-cylinder-slide]");
  const next = carousel.locator("[data-cylinder-next]");
  const dots = carousel.locator("[data-cylinder-index]");
  const firstSlide = slides.nth(0);
  await firstSlide.evaluate((slide) => {
    slide.dataset.testState = "preserved";
  });

  await expect(carousel).toHaveAttribute("data-ready", "true");
  await expect(slides).toHaveCount(3);
  await carousel.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slides.nth(1)).toHaveAttribute("data-active", "true");
  await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
  await expect(carousel.locator('[role="status"]')).toHaveText(/2.*3/);
  await expect(firstSlide).toHaveAttribute("data-test-state", "preserved");
  await expect(slides.nth(0)).toHaveAttribute("aria-hidden", "true");
  await expect(slides.nth(0)).toHaveAttribute("inert", "");
  await expect(slides.nth(0).locator("a")).toHaveCount(1);
  await slides
    .nth(0)
    .locator("a")
    .evaluate((link: HTMLElement) => link.focus());
  await expect(slides.nth(0).locator("a")).not.toBeFocused();

  await dots.nth(2).click();
  await expect(slides.nth(2)).toHaveAttribute("data-active", "true");
  await expect(slides.nth(2)).toHaveCSS("transition", /^none/);
  await expect(next).toHaveCSS("opacity", "0.5");
  const nextBounds = await next.boundingBox();
  if (!nextBounds) {
    throw new Error("The next carousel control should be visible");
  }
  await page.mouse.move(
    nextBounds.x + nextBounds.width / 2,
    nextBounds.y + nextBounds.height / 2,
  );
  await expect(next).toHaveCSS("opacity", "1");
  await expect(next).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await page.mouse.down();
  await expect(next).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await page.mouse.up();
  await expect(slides.nth(0)).toHaveAttribute("data-active", "true");
});

test("keeps mobile previews hidden and frame within the viewport", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const carousel = page.locator("#offers cylinder-carousel");
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(carousel).toHaveAttribute("data-ready", "true");
    const measurements = await carousel.evaluate((root) => {
      const frame = root.getBoundingClientRect();
      const active = root.querySelector<HTMLElement>(
        '[data-cylinder-slide][data-active="true"]',
      );
      const bounds = active?.getBoundingClientRect();
      return {
        frameWidth: frame.width,
        activeWidth: bounds?.width ?? 0,
        activeTop: bounds?.top ?? 0,
        activeBottom: bounds?.bottom ?? 0,
        viewport: innerWidth,
        frameHeight: frame.height,
        headerHeight:
          document.querySelector(".site-header")?.getBoundingClientRect()
            .height ?? 0,
        bottomHeight:
          document.querySelector(".mobile-bottom-nav")?.getBoundingClientRect()
            .height ?? 0,
        viewportHeight: innerHeight,
      };
    });
    expect(measurements.frameWidth).toBeLessThanOrEqual(width);
    expect(measurements.activeWidth).toBeGreaterThan(0);
    expect(measurements.activeTop).toBeGreaterThanOrEqual(0);
    expect(measurements.activeBottom).toBeLessThanOrEqual(10000);
    if (width < 768) {
      expect(measurements.activeWidth).toBe(measurements.frameWidth);
      expect(measurements.frameHeight).toBeLessThanOrEqual(
        measurements.viewportHeight -
          measurements.headerHeight -
          measurements.bottomHeight,
      );
    }
  }
});

test("follows horizontal pointer movement and clears text selection", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const carousel = page.locator("#offers cylinder-carousel");
  const active = carousel.locator('[data-cylinder-slide][data-active="true"]');
  const bounds = await active.boundingBox();
  await expect(carousel).toHaveCSS("cursor", "grab");
  if (!bounds) {
    throw new Error("The active carousel slide should have visible bounds");
  }
  const startX = bounds.x + bounds.width / 2;
  const startY = bounds.y + bounds.height / 2;
  await active.evaluate((slide) => {
    const range = document.createRange();
    range.selectNodeContents(slide);
    window.getSelection()?.addRange(range);
  });
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await expect(carousel).toHaveCSS("cursor", "grabbing");
  await page.mouse.move(startX - 60, startY);
  await expect(carousel).toHaveAttribute("data-swiping", "true");
  await expect
    .poll(() => page.evaluate(() => window.getSelection()?.toString()))
    .toBe("");
  await expect(active).toHaveCSS("user-select", "none");
  await expect(active).toHaveCSS("transform", /matrix\(/);
  await page.mouse.up();
  await expect(
    carousel.locator('[data-cylinder-slide][data-active="true"]'),
  ).toHaveCount(1);
});

test("wraps without shifting the image inside the active card", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const carousel = page.locator("#offers cylinder-carousel");
  const slides = carousel.locator("[data-cylinder-slide]");
  const previous = carousel.locator("[data-cylinder-prev]");
  const next = carousel.locator("[data-cylinder-next]");
  await expect(carousel).toHaveAttribute("data-ready", "true");

  await previous.click();
  await expect(slides.nth(2)).toHaveAttribute("data-active", "true");
  await expect
    .poll(() => slides.nth(2).getAttribute("style"))
    .toContain("transition: none");

  await next.click();
  await expect(slides.nth(0)).toHaveAttribute("data-active", "true");
  await expect
    .poll(() => slides.nth(0).getAttribute("style"))
    .toContain("transition: none");
  const geometry = await slides.nth(0).evaluate((slide) => {
    const card = slide.querySelector<HTMLElement>(".offers-track-card");
    const image = slide.querySelector<HTMLImageElement>("img");
    const cardBounds = card?.getBoundingClientRect();
    const imageBounds = image?.getBoundingClientRect();
    return {
      cardX: cardBounds?.x,
      imageX: imageBounds?.x,
      cardWidth: cardBounds?.width,
      imageWidth: imageBounds?.width,
    };
  });
  expect(geometry.imageX).toBe(geometry.cardX);
  expect(geometry.imageWidth).toBe(geometry.cardWidth);
});
