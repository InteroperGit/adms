// Comparison data has one accessible view and a keyboard scroll fallback.
import { expect, test } from "../fixtures";

for (const javaScriptEnabled of [true, false]) {
  test.describe(`comparison with JavaScript ${javaScriptEnabled}`, () => {
    test.use({ javaScriptEnabled });

    for (const width of [320, 768, 1440]) {
      test(`one readable representation at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/projects/1/");
        const block = page.locator(".content-table").first();
        const table = block.locator("table");
        const stack = block.locator(".table-stack");

        const values = await table.locator("tbody td").allTextContents();
        expect(await stack.locator("dd").allTextContents()).toEqual(values);
        await expect(table.locator('th[scope="col"]')).toHaveCount(8);
        const labels = await table.locator("th").allTextContents();
        expect(await stack.locator("dt").allTextContents()).toEqual([
          ...labels,
          ...labels,
        ]);

        if (width < 768) {
          await expect(table).toBeHidden();
          await expect(stack).toBeVisible();
          await expect(block.getByRole("table")).toHaveCount(0);
          await expect(block.getByRole("definition")).toHaveCount(16);
        } else {
          await expect(table).toBeVisible();
          await expect(stack).toBeHidden();
          await expect(block.getByRole("definition")).toHaveCount(0);
          await expect(block.getByRole("cell")).toHaveCount(16);
        }

        const row = block.locator(width < 768 ? "dl" : "tbody tr").first();
        await row.focus();
        await expect(row).toBeFocused();
        await expect(row).toHaveCSS("outline-style", "solid");
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        ).toBe(true);

        await page.emulateMedia({ media: "print" });
        await expect(table).toBeVisible();
        await expect(stack).toBeHidden();
        await expect(block.getByRole("cell")).toHaveCount(16);
        await expect(block.getByRole("definition")).toHaveCount(0);
      });
    }
  });
}

test("wide comparison scrolls with native keyboard arrows", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/projects/1/");
  const region = page.locator(".content-table .table-scroll").first();
  expect(
    await region.evaluate((node) => node.scrollWidth > node.clientWidth),
  ).toBe(true);
  await region.focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => region.evaluate((node) => node.scrollLeft))
    .toBeGreaterThan(0);
});
