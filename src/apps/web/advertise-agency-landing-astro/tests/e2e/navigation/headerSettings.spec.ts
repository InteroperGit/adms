// Header and settings browser contracts.
import { expect, test } from "../fixtures";

test("mobile header hides down and returns up while scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();
  await page.emulateMedia({ reducedMotion: "reduce" });

  const header = page.locator(".site-header");
  await expect(header).toHaveCSS("position", "sticky");
  await page.mouse.wheel(0, 500);
  await expect.poll(() => header.getAttribute("data-hidden")).toBe("true");

  await page.mouse.wheel(0, -100);
  await expect.poll(() => header.getAttribute("data-hidden")).toBe("false");
});

test("tablet and desktop headers stay in document flow", async ({ page }) => {
  for (const width of [768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const decline = page.locator('[data-cookie-choice="declined"]');
    if (await decline.isVisible()) {
      await decline.click();
    }

    const header = page.locator(".site-header");
    await expect(header).toHaveCSS("position", "static");
    await page.mouse.wheel(0, 600);
    await expect.poll(() => header.getAttribute("data-hidden")).toBe("false");

    await page.mouse.wheel(0, -120);
    await expect.poll(() => header.getAttribute("data-hidden")).toBe("false");
  }
});

test("mobile menu shows themed links without contact action buttons", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();

  const settingsTrigger = page.locator("[data-settings-trigger]");
  const settingsSurface = settingsTrigger.locator(".settings-surface");
  const settingsColors = await settingsSurface.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      background: style.backgroundColor,
      color: style.color,
      border: style.borderColor,
    };
  });
  await settingsTrigger.hover();
  await expect(settingsSurface).toHaveCSS(
    "background-color",
    settingsColors.background,
  );
  await expect(settingsSurface).toHaveCSS("color", settingsColors.color);
  await expect(settingsSurface).toHaveCSS(
    "border-color",
    settingsColors.border,
  );
  await settingsTrigger.click();
  await expect(settingsTrigger).toHaveAttribute("aria-expanded", "true");
  const expandedColors = await settingsSurface.evaluate((element) => {
    const style = getComputedStyle(element);
    return { background: style.backgroundColor, color: style.color };
  });
  expect(expandedColors.background).not.toBe(settingsColors.background);
  expect(expandedColors.color).not.toBe(settingsColors.color);
  await settingsTrigger.click();
  await expect(settingsTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(settingsSurface).toHaveCSS(
    "background-color",
    settingsColors.background,
  );
  await expect(settingsSurface).toHaveCSS("color", settingsColors.color);
  await expect(settingsSurface).toHaveCSS(
    "border-color",
    settingsColors.border,
  );
  await expect(settingsTrigger).not.toBeFocused();

  const opener = page.locator("#mobile-menu-open");
  const openerColors = await opener.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      background: style.backgroundColor,
      color: style.color,
      border: style.borderColor,
    };
  });
  await opener.hover();
  await expect(opener).toHaveCSS("background-color", openerColors.background);
  await expect(opener).toHaveCSS("color", openerColors.color);
  await expect(opener).toHaveCSS("border-color", openerColors.border);
  await opener.click();
  await opener.click();
  await expect(opener).toHaveCSS("background-color", openerColors.background);
  await expect(opener).toHaveCSS("color", openerColors.color);
  await expect(opener).toHaveCSS("border-color", openerColors.border);
  await expect(opener).not.toBeFocused();

  await page.locator("#mobile-menu-open").click();
  const menu = page.locator("#mobile-menu");
  const firstLink = menu.locator("a").first();
  await expect(menu).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(firstLink).toHaveCSS("color", "rgb(24, 34, 45)");
  await expect(menu.locator(".mobile-link-icon")).toHaveCount(3);
  await expect(menu.locator(".mobile-link-divider")).toHaveCount(2);
  await expect(menu.locator('a[href^="tel:"]')).toHaveCount(0);
  await expect(menu.locator('a[href="https://max.ru/"]')).toHaveCount(0);
  await expect(menu.locator('a[href="/projects/"]')).toHaveCount(1);
  await expect(menu.locator('a[href="/#order-inquiry"]')).toHaveCount(1);
  await expect(menu.locator('a[href="/#contacts"]')).toHaveCount(1);

  await page.locator("html").evaluate((element) => {
    element.setAttribute("data-theme", "dark");
  });
  await expect(menu).toHaveCSS("background-color", "rgb(24, 33, 43)");
  await expect(firstLink).toHaveCSS("color", "rgb(237, 242, 247)");
});

test("desktop settings show the heading above expanded theme choices", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();
  await page.locator("[data-settings-trigger]").click();

  const panel = page.locator("[data-settings-panel]");
  const heading = panel.locator(".theme-label");
  await expect(heading).toBeVisible();
  const headingBounds = await heading.boundingBox();
  const options = panel.locator(".theme-option");
  const firstOptionBounds = await options.first().boundingBox();
  expect(headingBounds!.y + headingBounds!.height).toBeLessThan(
    firstOptionBounds!.y,
  );
  const widths = await panel
    .locator(".theme-option")
    .evaluateAll((items) =>
      items.map((item) => Math.round(item.getBoundingClientRect().width)),
    );
  expect(new Set(widths).size).toBe(1);
  expect(widths[0]).toBeGreaterThan(120);
  const bounds = await options.evaluateAll((items) =>
    items.map((item) => {
      const { left, right } = item.getBoundingClientRect();
      return { left, right };
    }),
  );
  expect(Math.round(bounds[1].left - bounds[0].right)).toBe(8);
  expect(Math.round(bounds[2].left - bounds[1].right)).toBe(8);
});

test("tablet header has navigation and a nonmodal contact menu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();

  await expect(page.locator(".desktop-navigation")).toBeVisible();
  const address = page.locator(".header-address");
  await expect(address).toBeVisible();
  await expect(address).toHaveAttribute("href", "/#contacts");
  const supportsFineHover = await page.evaluate(
    () =>
      matchMedia("(min-width: 48rem) and (hover: hover) and (pointer: fine)")
        .matches,
  );
  await address.hover();
  if (supportsFineHover) {
    await expect(address).toHaveCSS("text-decoration-line", "underline");
  }
  await address.click();
  await expect(page).toHaveURL(/\/#contacts$/);
  const call = page.locator(".header-call");
  await expect(call).toContainText("TEST_PHONE");
  const callColors = await call.evaluate((element) => {
    const style = getComputedStyle(element);
    return { background: style.backgroundColor, color: style.color };
  });
  const addressBounds = await address.boundingBox();
  const callBounds = await call.boundingBox();
  expect(
    callBounds!.x - (addressBounds!.x + addressBounds!.width),
  ).toBeGreaterThanOrEqual(24);
  await call.hover();
  await expect(call).toHaveCSS(
    "filter",
    supportsFineHover ? "brightness(1.12)" : "none",
  );
  await expect(call).toHaveCSS("background-color", callColors.background);
  await expect(call).toHaveCSS("color", callColors.color);
  const opener = page.locator(".contact-menu-opener-desktop");
  await opener.click();
  const menu = page.locator("#contact-menu");
  await expect(menu).toBeVisible();
  await expect(menu).not.toHaveAttribute("aria-modal", "true");
  await expect(menu).not.toHaveCSS("position", "absolute");
  const settings = page.locator("[data-theme-settings]");
  expect(
    await settings.boundingBox().then((bounds) => bounds!.x),
  ).toBeGreaterThan(await opener.boundingBox().then((bounds) => bounds!.x));
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});
