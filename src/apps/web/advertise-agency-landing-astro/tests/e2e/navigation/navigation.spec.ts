// Mobile navigation and focus browser contracts.
import { expect, test } from "../fixtures";

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
  const contacts = page.locator("#contacts");
  await expect(contacts).toBeFocused();
  // Browsers can adjust the final offset as lazy content changes its height.
  // The destination must enter the viewport without the header covering it.
  await expect
    .poll(() =>
      contacts.evaluate((element) => {
        const top = element.getBoundingClientRect().top;
        const header = document.querySelector("[data-auto-hide-header]");
        const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
        return top >= Math.max(0, headerBottom) && top < window.innerHeight;
      }),
    )
    .toBe(true);
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
