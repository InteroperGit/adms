// Desktop contact menu browser contracts.
import { expect, test } from "../fixtures";

test("desktop contacts preserve choices and control alignment", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();

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
  await expect(page.locator(".desktop-navigation")).toBeVisible();
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
      .locator(".contact-menu-opener-desktop")
      .evaluate((element) => element.clientHeight),
  ]);
  expect(new Set(heights).size).toBe(1);

  const opener = page.locator(".contact-menu-opener-desktop");
  await expect(opener.locator(".lucide-message-circle")).toBeVisible();
  await expect(opener.locator(".lucide-phone")).toHaveCount(0);
  await opener.click();
  const dialog = page.locator("#contact-menu");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.locator("[data-contact-options] .mobile-call-option"),
  ).toBeHidden();
  await dialog.locator("[data-callback-start]").click();
  await expect(dialog).toBeHidden();
  await expect(opener).toHaveAttribute("aria-expanded", "false");
  const callback = page.locator("#callback-dialog");
  await expect(callback).toBeVisible();
  await expect(callback).toHaveAccessibleName("Обратный звонок");
  expect(await callback.evaluate((element) => element.matches(":modal"))).toBe(
    true,
  );
  await expect(callback.locator('[type="submit"]')).toBeDisabled();
  const callbackBounds = await callback.boundingBox();
  expect(callbackBounds?.x).toBe(0);
  expect(callbackBounds?.y).toBe(0);
  expect(callbackBounds?.width).toBe(1440);
  expect(callbackBounds?.height).toBe(900);
  await page.keyboard.press("Escape");
  await expect(callback).toBeHidden();
  await expect(opener).toBeFocused();
  await opener.click();
  await expect(dialog).toBeVisible();
  await expect(callback).toBeHidden();
  await expect(dialog.locator("[data-contact-options]")).toBeVisible();
  await dialog.locator("[data-callback-start]").click();
  await expect(callback).toBeVisible();
  await callback.locator("[data-callback-close]").click();
  await expect(callback).toBeHidden();
  await expect(opener).toBeFocused();
  await opener.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
