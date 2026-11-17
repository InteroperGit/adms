// Callback dialog browser contracts.
import { expect, test } from "../fixtures";

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
  await dialog.locator("[data-callback-start]").click();
  await expect(dialog).toBeHidden();
  await expect(opener).toHaveAttribute("aria-expanded", "false");
  const callbackDialog = page.locator("#callback-dialog");
  await expect(callbackDialog).toBeVisible();
  expect(
    await callbackDialog.evaluate((element) => element.matches(":modal")),
  ).toBe(true);
  const callbackBounds = await callbackDialog.boundingBox();
  expect(callbackBounds?.x).toBe(0);
  expect(callbackBounds?.y).toBe(0);
  expect(callbackBounds?.width).toBe(375);
  expect(callbackBounds?.height).toBe(800);
  const formSurface = callbackDialog.locator("[data-callback-form]");
  const formBounds = await formSurface.boundingBox();
  expect(formBounds!.x).toBeGreaterThan(0);
  expect(formBounds!.y).toBeGreaterThan(0);
  expect(formBounds!.x + formBounds!.width).toBeLessThan(375);
  expect(formBounds!.y + formBounds!.height).toBeLessThan(800);
  const name = callbackDialog.getByLabel("Имя", { exact: true });
  await name.fill("Visitor");
  await expect(name).toHaveValue("Visitor");
  const phone = callbackDialog.getByLabel("Телефон", { exact: true });
  await phone.fill("+7 900 123-45-67");
  await expect(phone).toHaveValue("+7 900 123-45-67");
  await expect(callbackDialog.locator('a[href^="tel:"]')).toHaveCount(0);
  const submit = callbackDialog.locator('[type="submit"]');
  await expect(submit).toBeDisabled();
  const submitColors = await submit.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      background: style.backgroundColor,
      color: style.color,
      border: style.borderColor,
    };
  });
  const themeColors = await callbackDialog.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.color = "var(--color-primary)";
    document.body.append(probe);
    const primary = getComputedStyle(probe).color;
    probe.style.color = "var(--color-primary-content)";
    const content = getComputedStyle(probe).color;
    probe.remove();
    return {
      primary,
      content,
    };
  });
  expect(submitColors.background).toBe(themeColors.primary);
  expect(submitColors.color).toBe(themeColors.content);
  expect(submitColors.border).toBe(themeColors.primary);
  const closeButton = callbackDialog.getByRole("button", {
    name: "Закрыть форму",
  });
  await expect(closeButton.locator(".lucide-x")).toBeVisible();
  const closeBounds = await closeButton.boundingBox();
  expect(closeBounds!.x).toBeGreaterThan(formBounds!.x + formBounds!.width / 2);
  expect(closeBounds!.y).toBeLessThan(formBounds!.y + 20);
  await page.keyboard.press("Escape");
  await expect(callbackDialog).toBeHidden();
  await expect(opener).toBeFocused();
  await opener.click();
  await expect(dialog).toBeVisible();
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
