// Mobile drawer navigation and focus browser contracts.
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
  await expect(menu).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
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
