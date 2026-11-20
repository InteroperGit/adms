// Browser contracts for cookie consent and theme persistence.
import { expect, test } from "../fixtures";
import { expectDocumentFocus, expectThemeStyles } from "../support/themeStyles";

test("accepted cookie consent persists across reload and navigation", async ({
  page,
}) => {
  await page.goto("/");
  const banner = page.locator("#cookie-banner");
  await expect(banner).toBeVisible();
  await banner.locator('[data-cookie-choice="accepted"]').click();
  await expect(banner).toBeHidden();
  await expect(
    page.evaluate(() => localStorage.getItem("cookieConsent")),
  ).resolves.toBe("accepted");
  await page.reload();
  await expect(banner).toBeHidden();
  await page.goto("/projects/");
  await expect(page.locator("#cookie-banner")).toBeHidden();
});

test("declined cookie consent persists across reload and navigation", async ({
  page,
}) => {
  await page.goto("/");
  const banner = page.locator("#cookie-banner");
  await expect(banner).toBeVisible();
  await banner.locator('[data-cookie-choice="declined"]').click();
  await expect(banner).toBeHidden();
  await expect(
    page.evaluate(() => localStorage.getItem("cookieConsent")),
  ).resolves.toBe("declined");
  await page.reload();
  await expect(banner).toBeHidden();
  await page.goto("/projects/");
  await expect(page.locator("#cookie-banner")).toBeHidden();
});

test("cookie banner and theme work when storage is blocked", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const blocked = () => {
      throw new DOMException("Storage is unavailable", "SecurityError");
    };
    Storage.prototype.getItem = blocked;
    Storage.prototype.setItem = blocked;
  });
  await page.goto("/");
  const banner = page.locator("#cookie-banner");
  await expect(banner).toBeVisible();
  await banner.locator('[data-cookie-choice="declined"]').click();
  await expect(banner).toBeHidden();
  await page.locator("[data-settings-trigger]").click();
  await page.locator('[data-theme-radio][value="dark"]').check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("explicit light and dark choices persist after reload", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();
  await page.locator("[data-settings-trigger]").click();
  await page.locator('[data-theme-radio][value="light"]').check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expectThemeStyles(page, "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expectThemeStyles(page, "light");
  await page.emulateMedia({ colorScheme: "light" });
  await page.locator("[data-settings-trigger]").click();
  await page.locator('[data-theme-radio][value="dark"]').check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectThemeStyles(page, "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectThemeStyles(page, "dark");
});

test("system theme follows media changes until an explicit choice", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expectThemeStyles(page, "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectThemeStyles(page, "dark");
  await page.locator("[data-settings-trigger]").click();
  await page.locator('[data-theme-radio][value="light"]').check();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expectThemeStyles(page, "light");
});

test("document focus and motion respect accessibility preferences", async ({
  page,
}) => {
  await page.emulateMedia({
    colorScheme: "light",
    reducedMotion: "no-preference",
  });
  await page.goto("/projects/");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
  // All engines include form fields in Tab order; WebKit may skip links.
  // Use a field with the document ring, not Settings' local 2px offset.
  const search = page.locator("#project-catalog-search");
  await expect(search).toBeVisible();
  await search.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(search).toBeFocused();
  await expectDocumentFocus(page, "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expectDocumentFocus(page, "dark");

  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const selector of ["html", "body", "header"]) {
    const element = page.locator(selector);
    await expect(element).toHaveCSS("scroll-behavior", "auto");
    // Engines serialize this tiny duration in decimal or scientific form.
    for (const property of ["transition-duration", "animation-duration"]) {
      await expect
        .poll(() =>
          element.evaluate(
            (node, name) =>
              parseFloat(getComputedStyle(node).getPropertyValue(name)),
            property,
          ),
        )
        .toBe(0.00001);
    }
  }
});

test("settings popup stays in bounds when zoomed and keyboard opened", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();
  await page.evaluate(() => {
    document.documentElement.style.zoom = "125%";
  });

  const trigger = page.locator("[data-settings-trigger]");
  const panel = page.locator("[data-settings-panel]");
  await trigger.focus();
  await page.keyboard.press("Enter");

  await expect(panel).toBeVisible();
  await expect(panel.locator("[data-theme-radio]:checked")).toBeFocused();
  const bounds = await panel.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
  });

  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.top).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(bounds.width);
  expect(bounds.bottom).toBeLessThanOrEqual(bounds.height);
});

test("theme choice synchronizes across two pages in one context", async ({
  page,
  context,
}) => {
  const secondPage = await context.newPage();
  await page.goto("/");
  await secondPage.goto("/");
  await page.locator('[data-cookie-choice="declined"]').click();
  await secondPage.locator('[data-cookie-choice="declined"]').click();
  await page.locator("[data-settings-trigger]").click();
  await page.locator('[data-theme-radio][value="dark"]').check();
  await expect(secondPage.locator("html")).toHaveAttribute(
    "data-theme",
    "dark",
  );
  await secondPage.close();
});
