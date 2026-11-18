// Browser contracts for the offers carousel track, controls, and motion.
import { blockExternalRequests, expect, test } from "../fixtures";

test("keeps the first complete offer card without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 768, height: 900 },
  });
  await blockExternalRequests(context);
  const page = await context.newPage();
  await page.goto("/");

  const carousel = page.locator("#offers-carousel");
  const activeSlot = carousel.locator(
    '.offers-track-slot[data-track-offset="0"]',
  );
  await expect(
    activeSlot.locator(".offers-track-card:not([hidden])"),
  ).toBeVisible();
  await expect(
    activeSlot.locator(".offers-track-card:not([hidden]) .offers-track-copy"),
  ).toBeVisible();
  await expect(carousel.locator(".carousel-controls")).toBeHidden();
  await expect(
    carousel.locator('.offers-track-slot[aria-hidden="true"][inert]'),
  ).toHaveCount(4);
  await context.close();
});

test("keeps compact geometry and three-percent previews across themes", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();
  await page.evaluate(() => window.scrollTo(0, 0));

  const frame = page.locator("#offers-carousel");
  const previous = frame.locator('.carousel-arrow[data-direction="-1"]');
  const next = frame.locator('.carousel-arrow[data-direction="1"]');
  const dots = frame.locator(".carousel-dots");
  const surfaces = new Map<string, string>();
  const viewports = [
    {
      width: 390,
      height: 900,
      arrowLeft: 8,
      arrowRight: 338,
      arrowSize: 44,
      dotsLeft: 129,
      rootHeight: 586.64,
    },
    {
      width: 768,
      height: 900,
      arrowLeft: 0.02,
      arrowRight: 694.5,
      arrowSize: 73.47,
      dotsLeft: 318,
      rootHeight: 538.8,
    },
    {
      width: 1024,
      height: 900,
      arrowLeft: 0.02,
      arrowRight: 936,
      arrowSize: 88,
      dotsLeft: 446,
      rootHeight: 486.4,
    },
    {
      width: 1440,
      height: 900,
      arrowLeft: 0,
      arrowRight: 1328.5,
      arrowSize: 111.6,
      dotsLeft: 654,
      rootHeight: 684,
    },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await expect(frame).toHaveAttribute("data-ready", "true");
    for (const colorScheme of ["light", "dark"] as const) {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        colorScheme,
      );
      await expect(frame).toHaveCSS(
        "background-color",
        colorScheme === "dark" ? "rgb(28, 59, 59)" : "rgb(112, 147, 143)",
      );
      surfaces.set(
        colorScheme,
        await frame.evaluate(
          (element) => getComputedStyle(element).backgroundColor,
        ),
      );
      const root = await frame.boundingBox();
      const activeCard = await frame
        .locator(".offers-track-offset-0 .offers-track-card:not([hidden])")
        .boundingBox();
      const previousBounds = await previous.boundingBox();
      const nextBounds = await next.boundingBox();
      const dotsBounds = await dots.boundingBox();
      if (
        !root ||
        !activeCard ||
        !previousBounds ||
        !nextBounds ||
        !dotsBounds
      ) {
        throw new Error("Offers carousel geometry should be visible");
      }
      const closeTo = (actual: number, expected: number) =>
        expect(Math.abs(actual - expected)).toBeLessThan(1);

      closeTo(previousBounds.x, viewport.arrowLeft);
      closeTo(nextBounds.x, viewport.arrowRight);
      closeTo(
        previousBounds.y,
        root.y + root.height / 2 - viewport.arrowSize / 2,
      );
      closeTo(nextBounds.y, previousBounds.y);
      closeTo(previousBounds.width, viewport.arrowSize);
      closeTo(nextBounds.width, viewport.arrowSize);
      closeTo(root.height, viewport.rootHeight);
      closeTo(dotsBounds.x, viewport.dotsLeft);
      closeTo(
        root.y + root.height - dotsBounds.y - dotsBounds.height,
        Math.min(12, Math.max(8, viewport.width * 0.01)),
      );
      const pageWidth = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(pageWidth.scroll).toBeLessThanOrEqual(pageWidth.client);

      if (viewport.width < 768) {
        expect(activeCard.x).toBe(0);
        expect(activeCard.width).toBe(viewport.width);
        const slotVisibility = await frame
          .locator(".offers-track-slot")
          .evaluateAll((slots) =>
            slots.map((slot) => {
              const bounds = slot.getBoundingClientRect();
              return Math.max(
                0,
                Math.min(innerWidth, bounds.right) - Math.max(0, bounds.left),
              );
            }),
          );
        expect(slotVisibility.slice(0, 2).every((width) => width === 0)).toBe(
          true,
        );
        expect(slotVisibility.slice(3).every((width) => width === 0)).toBe(
          true,
        );
      } else {
        closeTo(activeCard.x, previousBounds.x + previousBounds.width / 2);
        closeTo(
          activeCard.x + activeCard.width,
          nextBounds.x + nextBounds.width / 2,
        );
        closeTo(
          activeCard.height,
          root.height * (viewport.width >= 1024 ? 0.98 : 0.966666),
        );
        closeTo(
          activeCard.y,
          root.y + root.height * (viewport.width >= 1024 ? 0.01 : 0.016667),
        );
        if (viewport.width < 1024) {
          closeTo(activeCard.width / activeCard.height, 4 / 3);
        }

        const previousSlot = await frame
          .locator('.offers-track-slot[data-track-offset="-1"]')
          .boundingBox();
        const currentSlot = await frame
          .locator('.offers-track-slot[data-track-offset="0"]')
          .boundingBox();
        const nextSlot = await frame
          .locator('.offers-track-slot[data-track-offset="1"]')
          .boundingBox();
        if (!previousSlot || !currentSlot || !nextSlot) {
          throw new Error("Both neighbor previews should be visible");
        }
        closeTo(previousSlot.x + previousSlot.width, activeCard.x - 16);
        closeTo(nextSlot.x, activeCard.x + activeCard.width + 16);
        closeTo(previousSlot.width, activeCard.width);
        closeTo(nextSlot.width, activeCard.width);
        closeTo(nextSlot.x - currentSlot.x - currentSlot.width, 16);
        const previousVisibleWidth = Math.max(
          0,
          Math.min(root.x + root.width, previousSlot.x + previousSlot.width) -
            Math.max(root.x, previousSlot.x),
        );
        const nextVisibleWidth = Math.max(
          0,
          Math.min(root.x + root.width, nextSlot.x + nextSlot.width) -
            Math.max(root.x, nextSlot.x),
        );
        closeTo(previousVisibleWidth, previousSlot.width * 0.03);
        closeTo(nextVisibleWidth, nextSlot.width * 0.03);
      }

      if (testInfo.project.name === "chromium") {
        await page.screenshot({
          path: testInfo.outputPath(
            `offers-after-${viewport.width}-${colorScheme}.png`,
          ),
        });
      }
    }
  }
  expect(new Set(surfaces.values()).size).toBe(2);
});

test("manual controls rotate and announce complete offer cards", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();

  const carousel = page.locator("#offers-carousel");
  const activeCard = carousel.locator(
    ".offers-track-offset-0 .offers-track-card:not([hidden])",
  );
  const dots = carousel.locator(".carousel-dot");
  const status = carousel.locator('[role="status"]');

  await dots.nth(0).focus();
  await expect(carousel).toHaveAttribute("data-count", "3");
  await expect(carousel.locator(".carousel-controls")).toBeVisible();
  await expect(activeCard).toHaveAttribute("data-track-index", "0");
  await expect(dots.nth(0)).toHaveAttribute("aria-current", "true");

  await carousel.locator('[data-direction="1"]').focus();
  await page.keyboard.press("Enter");
  await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
  await expect(activeCard).toHaveAttribute("data-track-index", "1");
  await expect(status).toContainText("2");
  await expect(carousel.locator(".offers-track")).toHaveCSS(
    "transition-duration",
    "0.42s",
  );

  await carousel.locator('[data-direction="-1"]').click();
  await expect(dots.nth(0)).toHaveAttribute("aria-current", "true");
  await expect(activeCard).toHaveAttribute("data-track-index", "0");

  await carousel.locator('[data-direction="-1"]').click();
  await expect(dots.nth(2)).toHaveAttribute("aria-current", "true");
  await expect(activeCard).toHaveAttribute("data-track-index", "2");

  await dots.nth(1).click();
  await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
  await expect(activeCard).toHaveAttribute("data-track-index", "1");
  await expect(
    carousel.locator('.carousel-dot[aria-current="true"]'),
  ).toHaveCount(1);
  await expect(
    carousel.locator('.offers-track-slot[aria-hidden="true"][inert]'),
  ).toHaveCount(4);
});

test("swipes move the shared track to its adjacent card", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();

  const carousel = page.locator("#offers-carousel");
  const dots = carousel.locator(".carousel-dot");
  await expect(carousel).toHaveCSS("touch-action", "pan-y");

  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await dots.nth(0).click();
    await dots.nth(0).focus();
    const activeCard = carousel.locator(
      ".offers-track-offset-0 .offers-track-card:not([hidden])",
    );
    const currentSlot = carousel.locator(
      '.offers-track-slot[data-track-offset="0"]',
    );
    const nextSlot = carousel.locator(
      '.offers-track-slot[data-track-offset="1"]',
    );
    const bounds = await activeCard.boundingBox();
    if (!bounds) {
      throw new Error("Active offer should have visible bounds");
    }
    const startX = bounds.x + bounds.width / 2;
    const startY = bounds.y + bounds.height / 2;
    const delta = -60;

    await carousel.dispatchEvent("pointerdown", {
      pointerId: 1,
      pointerType: "touch",
      isPrimary: true,
      button: 0,
      clientX: startX,
      clientY: startY,
    });
    await carousel.dispatchEvent("pointermove", {
      pointerId: 1,
      pointerType: "touch",
      isPrimary: true,
      button: 0,
      clientX: startX + delta,
      clientY: startY,
    });
    await expect(carousel).toHaveAttribute("data-swiping", "true");
    await expect(carousel).toHaveCSS("--offers-drag-offset", `${delta}px`);
    const [currentBounds, nextBounds] = await Promise.all([
      currentSlot.boundingBox(),
      nextSlot.boundingBox(),
    ]);
    if (!currentBounds || !nextBounds) {
      throw new Error("Track slots should stay measurable during a swipe");
    }
    expect(
      Math.abs(nextBounds.x - currentBounds.x - currentBounds.width - 16),
    ).toBeLessThan(1);

    await carousel.dispatchEvent("pointerup", {
      pointerId: 1,
      pointerType: "touch",
      isPrimary: true,
      button: 0,
      clientX: startX + delta,
      clientY: startY,
    });
    await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
    await expect(activeCard).toHaveAttribute("data-track-index", "1");
    await expect(carousel).not.toHaveAttribute("data-settling", "true");

    const nextCardBounds = await activeCard.boundingBox();
    if (!nextCardBounds) {
      throw new Error("Next offer should be active after the swipe");
    }
    await carousel.dispatchEvent("pointerdown", {
      pointerId: 2,
      pointerType: "touch",
      isPrimary: true,
      button: 0,
      clientX: nextCardBounds.x + nextCardBounds.width / 2,
      clientY: nextCardBounds.y + nextCardBounds.height / 2,
    });
    await carousel.dispatchEvent("pointermove", {
      pointerId: 2,
      pointerType: "touch",
      isPrimary: true,
      button: 0,
      clientX: nextCardBounds.x + nextCardBounds.width / 2 + 60,
      clientY: nextCardBounds.y + nextCardBounds.height / 2,
    });
    await carousel.dispatchEvent("pointerup", {
      pointerId: 2,
      pointerType: "touch",
      isPrimary: true,
      button: 0,
      clientX: nextCardBounds.x + nextCardBounds.width / 2 + 60,
      clientY: nextCardBounds.y + nextCardBounds.height / 2,
    });
    await expect(dots.nth(0)).toHaveAttribute("aria-current", "true");
    await expect(activeCard).toHaveAttribute("data-track-index", "0");
  }
});

test("keeps the right arrow clickable beside the action rail", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();

  const carousel = page.locator("#offers-carousel");
  const next = carousel.locator('.carousel-arrow[data-direction="1"]');
  const bounds = await next.boundingBox();
  if (!bounds) {
    throw new Error("Right carousel arrow should have visible bounds");
  }
  const point = {
    x: bounds.x + bounds.width - 4,
    y: bounds.y + bounds.height / 2,
  };
  await page.mouse.move(point.x, point.y);
  await expect(next).toHaveCSS("opacity", "1");
  expect(
    await page.evaluate(
      ({ x, y }) =>
        Boolean(document.elementFromPoint(x, y)?.closest(".carousel-arrow")),
      point,
    ),
  ).toBe(true);
  await page.mouse.click(point.x, point.y);
  await expect(
    carousel.locator('.carousel-dot[aria-current="true"]'),
  ).toHaveAttribute("data-index", "1");
});

test("keeps arrows local and reveals them over the full frame", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const carousel = page.locator("#offers-carousel");
  const arrow = carousel.locator(".carousel-arrow").first();
  const outsidePosition = await page.locator("body").evaluate((body) => {
    const outsideArrow = document.createElement("div");
    outsideArrow.className = "carousel-arrow";
    body.append(outsideArrow);
    return getComputedStyle(outsideArrow).position;
  });
  await expect(arrow).toHaveCSS("position", "absolute");
  const arrowWidth = Number.parseFloat(
    await arrow.evaluate((element) => getComputedStyle(element).width),
  );
  expect(Math.abs(arrowWidth - (30 + 1280 * 0.0566))).toBeLessThan(0.05);

  const frameBounds = await carousel.boundingBox();
  if (!frameBounds) {
    throw new Error("Offers frame should have visible bounds");
  }
  await page.mouse.move(0, frameBounds.y + frameBounds.height + 8);
  await expect(arrow).toHaveCSS("opacity", "0");
  await page.mouse.move(
    frameBounds.x + 4,
    frameBounds.y + frameBounds.height / 2,
  );
  await expect(arrow).toHaveCSS("opacity", "1");
  await page.mouse.move(
    frameBounds.x + frameBounds.width - 4,
    frameBounds.y + frameBounds.height / 2,
  );
  await expect(arrow).toHaveCSS("opacity", "1");
  expect(outsidePosition).toBe("static");
});

test("keeps inactive offer links out of keyboard navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();

  const carousel = page.locator("#offers-carousel");
  const inactiveSlots = carousel.locator(
    '.offers-track-slot[aria-hidden="true"][inert]',
  );
  await expect(inactiveSlots).toHaveCount(4);
  await expect(inactiveSlots.locator(".offers-track-link:focus")).toHaveCount(
    0,
  );
  await expect(
    carousel.locator(
      ".offers-track-slot[data-active] .offers-track-card:not([hidden]) .offers-track-link",
    ),
  ).toBeEnabled();
});

test("reduced motion keeps controls usable without track transitions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();

  const carousel = page.locator("#offers-carousel");
  const activeCard = carousel.locator(
    ".offers-track-offset-0 .offers-track-card:not([hidden])",
  );
  await expect(carousel.locator(".carousel-controls")).toBeVisible();
  await expect(activeCard).toHaveAttribute("data-track-index", "0");
  await carousel.locator('[data-direction="1"]').focus();
  await page.keyboard.press("Enter");
  await expect(
    carousel.locator('.carousel-dot[aria-current="true"]'),
  ).toHaveAttribute("data-index", "1");
  await expect(activeCard).toHaveAttribute("data-track-index", "1");
  const transitionDuration = Number.parseFloat(
    await carousel
      .locator(".offers-track")
      .evaluate((track) => getComputedStyle(track).transitionDuration),
  );
  expect(transitionDuration).toBeLessThanOrEqual(0.00001);
});
