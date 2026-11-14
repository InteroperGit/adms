// Mobile navigation and focus browser contracts.
import { expect, test } from "./fixtures";

test("mobile drawer opens below header and returns focus on Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();
  await page.locator("#mobile-menu-open").click();
  const menu = page.locator("#mobile-menu");
  const opener = page.locator("#mobile-menu-open");
  await expect(menu).toBeVisible();
  await expect(opener).toHaveAttribute("aria-expanded", "true");
  await expect(menu.locator("a").first()).toBeFocused();
  const layout = page.locator(".header-layout");
  const menuBounds = await menu.boundingBox();
  const headerBounds = await layout.boundingBox();
  expect(menuBounds?.y).toBeCloseTo(headerBounds!.height, 0);
  expect(menuBounds?.height).toBeCloseTo(800 - headerBounds!.height, 0);
  await menu.locator("a").first().focus();
  await page.keyboard.press("Tab");
  await expect(menu.locator("a").nth(1)).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(opener).toBeFocused();
});

test("mobile opener toggles the drawer and desktop resize closes it", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();
  const opener = page.locator("#mobile-menu-open");
  const menu = page.locator("#mobile-menu");
  await opener.click();
  await expect(opener).toHaveAttribute("aria-expanded", "true");
  await expect(opener.locator(".header-menu-close")).toHaveCSS("opacity", "1");
  await opener.click();
  await expect(menu).toBeHidden();
  await expect(opener).toHaveAttribute("aria-expanded", "false");
  await expect(opener).not.toBeFocused();
  await opener.click();
  await expect(menu).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(menu).toBeHidden();
  await page.setViewportSize({ width: 375, height: 800 });
  await expect(opener).toBeVisible();
  await opener.click();
  await expect(menu).toBeVisible();
});

test("same-page menu hash links close and focus their sections", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();
  await page.locator("#mobile-menu-open").click();
  await page.locator('#mobile-menu a[href="/#contacts"]').click();
  await expect(page).toHaveURL(/\/#contacts$/);
  await expect(page.locator("#mobile-menu")).toBeHidden();
  await expect(page.locator("#contacts")).toBeFocused();
});

test("menu links navigate from a secondary page to home sections", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/projects/");
  await page.locator('[data-cookie-choice="declined"]').click();
  await page.locator("#mobile-menu-open").click();
  await page.locator('#mobile-menu a[href="/#order-inquiry"]').click();
  await expect(page).toHaveURL(/\/#order-inquiry$/);
  await expect(page.locator("#order-inquiry")).toBeVisible();
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

test("desktop contacts preserve choices and control alignment", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();

  await expect(page.locator(".header-address")).toBeVisible();
  await expect(page.locator(".desktop-navigation")).toBeVisible();
  await expect(page.locator(".header-call")).toContainText("TEST_PHONE");
  const settingsTrigger = page.locator("[data-settings-trigger]");
  const settingsPanel = page.locator("[data-settings-panel]");
  await settingsTrigger.click();
  await expect(settingsPanel).toBeVisible();
  await settingsTrigger.click();
  await expect(settingsPanel).toBeHidden();
  await expect(settingsTrigger).not.toBeFocused();
  const heights = await Promise.all([
    page.locator(".header-call").evaluate((element) => element.clientHeight),
    page
      .locator("[data-theme-settings] .settings-surface")
      .evaluate((element) => element.clientHeight),
    page
      .locator(".header-layout [data-contact-menu-opener]")
      .evaluate((element) => element.clientHeight),
  ]);
  expect(new Set(heights).size).toBe(1);

  const opener = page.locator(".header-layout [data-contact-menu-opener]");
  await opener.click();
  const dialog = page.locator("#contact-menu");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-contact-options] a")).toHaveCount(3);
  await dialog.locator("[data-callback-start]").click();
  await expect(dialog.locator("[data-callback-form]")).toBeVisible();
  await expect(dialog.locator('[type="submit"]')).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("tablet header has navigation and a nonmodal contact menu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();

  await expect(page.locator(".desktop-navigation")).toBeVisible();
  await expect(page.locator(".header-call")).toContainText("TEST_PHONE");
  const opener = page.locator(".header-layout [data-contact-menu-opener]");
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

test("mobile contact opener presents a full-width sheet", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();
  const opener = page.locator(
    ".mobile-header-contacts [data-contact-menu-opener]",
  );
  await opener.click();

  const dialog = page.locator("#contact-menu");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".contact-handle")).toBeVisible();
  await expect(dialog.locator("[data-contact-options] > h2")).toBeHidden();
  const callback = dialog.locator("[data-callback-start]");
  await expect(callback.locator(".lucide-phone-call")).toBeVisible();
  await expect(callback).toHaveCSS("font-size", "18px");
  const bounds = await dialog.boundingBox();
  expect(bounds?.x).toBe(0);
  expect(bounds?.width).toBe(375);
  await expect(dialog.locator("[data-contact-options] a")).toHaveCount(3);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();

  await opener.click();
  await dialog.locator("[data-contact-menu-close]").click();
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();

  await page.setViewportSize({ width: 320, height: 700 });
  await opener.click();
  await expect(dialog).toBeVisible();
  const narrowBounds = await dialog.boundingBox();
  expect(narrowBounds?.width).toBe(320);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
