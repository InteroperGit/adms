// Browser contracts for manual carousel controls and reduced motion.
import { expect, test } from "./fixtures";

test("manual controls select and announce slides", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();

  const carousel = page.locator("#offers-carousel");
  const slides = carousel.locator(".carousel-slide");
  const dots = carousel.locator(".carousel-dot");
  const status = carousel.locator('[role="status"]');

  // Select a known starting slide and suspend autoplay through control focus.
  await dots.nth(0).click();
  await dots.nth(0).focus();

  await expect(slides).toHaveCount(3);
  await expect(carousel.locator(".carousel-controls")).toBeVisible();
  await expect(
    carousel.locator(".carousel-slide:not([aria-hidden])"),
  ).toHaveCount(1);
  await expect(dots.nth(0)).toHaveAttribute("aria-current", "true");

  await carousel.locator('[data-direction="1"]').focus();
  await page.keyboard.press("Enter");
  await expect(slides.nth(1)).not.toHaveAttribute("aria-hidden", "true");
  await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
  await expect(status).toContainText("2 из 3");

  await carousel.locator('[data-direction="-1"]').click();
  await expect(dots.nth(0)).toHaveAttribute("aria-current", "true");
  await expect(status).toContainText("1 из 3");

  await carousel.locator('[data-direction="-1"]').click();
  await expect(dots.nth(2)).toHaveAttribute("aria-current", "true");
  await expect(status).toContainText("3 из 3");

  await dots.nth(1).click();
  await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
  await expect(status).toContainText("2 из 3");

  await expect(
    carousel.locator('.carousel-dot[aria-current="true"]'),
  ).toHaveCount(1);
  await expect(
    carousel.locator('.carousel-slide[aria-hidden="true"]'),
  ).toHaveCount(2);
  for (const index of [0, 2]) {
    await expect(slides.nth(index)).toHaveJSProperty("inert", true);
  }
});

test("scopes arrow styles across layouts, themes and viewport sizes", async ({
  page,
}) => {
  await page.emulateMedia({
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  await page.goto("/");

  const carousel = page.locator("#offers-carousel");
  const carouselList = carousel.locator(".carousel-list");
  const arrow = carousel.locator(".carousel-arrow").first();
  const nextArrow = carousel.locator('.carousel-arrow[data-direction="1"]');
  const outsidePosition = await page.locator("body").evaluate((body) => {
    const outsideArrow = document.createElement("div");
    outsideArrow.className = "carousel-arrow";
    body.append(outsideArrow);
    return getComputedStyle(outsideArrow).position;
  });
  await expect(carousel).toHaveAttribute("data-layout", "full");
  await expect(arrow).toHaveCSS("position", "absolute");
  await expect(arrow).toHaveCSS("border-top-width", "0px");
  await expect(arrow).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect
    .poll(() =>
      carousel.evaluate((element) =>
        Math.round(element.getBoundingClientRect().width),
      ),
    )
    .toBe(await page.evaluate(() => document.documentElement.clientWidth));
  const panelWidth = await carousel.evaluate((element) => {
    const section = element.parentElement;
    if (!section) {
      throw new Error("Carousel needs its section container");
    }
    element.dataset.layout = "panel";
    section.style.width = "320px";
    const width = element.getBoundingClientRect().width;
    section.style.width = "";
    return width;
  });
  expect(panelWidth).toBe(320);

  await expect(arrow).toHaveCSS("width", "128px");
  const iconWidth = await arrow
    .locator("svg")
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).width));
  expect(iconWidth).toBeGreaterThanOrEqual(43);
  const leftInset = await arrow.evaluate(
    (element) => element.getBoundingClientRect().left,
  );
  const rightInset = await nextArrow.evaluate(
    (element) =>
      document.documentElement.clientWidth -
      element.getBoundingClientRect().right,
  );
  expect(leftInset).toBeGreaterThanOrEqual(7);
  expect(leftInset).toBeLessThanOrEqual(13);
  expect(rightInset).toBeGreaterThanOrEqual(7);
  expect(rightInset).toBeLessThanOrEqual(13);

  const carouselBounds = await carousel.boundingBox();
  if (!carouselBounds) {
    throw new Error("Carousel should have visible bounds");
  }
  const outsideY = carouselBounds.y + carouselBounds.height + 8;
  await page.mouse.move(0, outsideY);
  await expect(arrow).toHaveCSS("opacity", "0");
  const restingFilter = await arrow.evaluate(
    (element) => getComputedStyle(element).filter,
  );
  expect(restingFilter).not.toBe("none");
  await carousel.hover();
  await expect(arrow).toHaveCSS("opacity", "1");
  await arrow.hover();
  await expect(arrow).toHaveCSS("color", "rgb(255, 255, 255)");
  const highlightedFilter = await arrow.evaluate(
    (element) => getComputedStyle(element).filter,
  );
  expect(highlightedFilter).not.toBe(restingFilter);
  await page.mouse.move(0, outsideY);
  await expect(arrow).toHaveCSS("opacity", "0");
  await expect(arrow).toHaveCSS("filter", restingFilter);

  await carousel.evaluate((element) => {
    element.dataset.layout = "panel";
    element.removeAttribute("data-ready");
  });
  await expect(carousel).toHaveAttribute("data-layout", "panel");
  await expect(carouselList).toHaveCSS("gap", "16px");

  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({
        colorScheme,
        reducedMotion: "reduce",
      });
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        colorScheme,
      );
      await expect(arrow).toHaveCSS("position", "absolute");
      const transitionDuration = await arrow.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).transitionDuration),
      );
      expect(transitionDuration).toBeLessThanOrEqual(0.00001);
      const width = await arrow.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).width),
      );
      expect(width).toBeGreaterThanOrEqual(112);
    }
  }

  expect(outsidePosition).toBe("static");
});

test("hidden slide links are excluded from keyboard navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();

  const carousel = page.locator("#offers-carousel");
  const hiddenLinks = carousel.locator(
    '.carousel-slide[aria-hidden="true"] .carousel-link',
  );

  await expect(hiddenLinks).toHaveCount(2);
  await carousel.locator('[data-direction="-1"]').focus();

  // Tab through every control and the active CTA to test native inert behavior.
  for (let step = 0; step < 5; step += 1) {
    await page.keyboard.press("Tab");
    await expect(
      carousel.locator(
        '.carousel-slide[aria-hidden="true"] .carousel-link:focus',
      ),
    ).toHaveCount(0);
  }
  await expect(
    carousel.locator(".carousel-slide:not([aria-hidden]) .carousel-link"),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    carousel.locator(
      '.carousel-slide[aria-hidden="true"] .carousel-link:focus',
    ),
  ).toHaveCount(0);
});

test("reduced motion retains usable manual carousel controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();

  const carousel = page.locator("#offers-carousel");
  const slides = carousel.locator(".carousel-slide");

  await expect(slides).toHaveCount(3);
  await expect(carousel.locator(".carousel-controls")).toBeVisible();
  await expect(
    carousel.locator(".carousel-slide:not([aria-hidden])"),
  ).toHaveCount(1);
  await carousel.locator('[data-direction="1"]').focus();
  await page.keyboard.press("Enter");
  await expect(
    carousel.locator('.carousel-dot[aria-current="true"]'),
  ).toHaveAttribute("data-index", "1");
});
