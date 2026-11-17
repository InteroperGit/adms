// Browser contracts for catalog pagination links and history.
import { expect, test } from "../fixtures";

test("pagination links navigate, reload and select the current page", async ({
  page,
}) => {
  await page.goto("/projects/");

  const pagination = page.locator("[data-catalog-pagination]");
  const visibleLinks = page.locator(
    "[data-project-card]:visible [data-project-link]",
  );

  await pagination.getByRole("link", { name: "Page 2" }).click();
  await expect
    .poll(() => new URL(page.url()).pathname)
    .toBe("/projects/page/2/");
  await expect(visibleLinks).toHaveAttribute("href", "/projects/2/");
  await expect(
    pagination.getByRole("link", { name: "Page 2" }),
  ).toHaveAttribute("aria-current", "page");

  await page.reload();
  await expect
    .poll(() => new URL(page.url()).pathname)
    .toBe("/projects/page/2/");
  await expect(visibleLinks).toHaveAttribute("href", "/projects/2/");

  await page.goto("/projects/page/3/");
  await expect
    .poll(() => new URL(page.url()).pathname)
    .toBe("/projects/page/3/");
  await expect(visibleLinks).toHaveAttribute("href", "/projects/3/");
  await expect(
    page
      .locator("[data-catalog-pagination]")
      .getByRole("link", { name: "Last page" }),
  ).toHaveAttribute("aria-current", "page");
});

test("pagination boundaries expose disabled direction controls", async ({
  page,
}) => {
  await page.goto("/projects/");

  const pagination = page.locator("[data-catalog-pagination]");
  const previous = pagination.getByRole("link", { name: "Previous page" });
  const next = pagination.getByRole("link", { name: "Next page" });

  await expect(previous).toHaveAttribute("aria-disabled", "true");
  await expect(previous).toHaveAttribute("tabindex", "-1");
  await expect(next).not.toHaveAttribute("aria-disabled", "true");
  await expect(next).not.toHaveAttribute("tabindex", "-1");

  await page.goto("/projects/page/3/");
  const lastPagination = page.locator("[data-catalog-pagination]");
  const lastPrevious = lastPagination.getByRole("link", {
    name: "Previous page",
  });
  const lastNext = lastPagination.getByRole("link", { name: "Next page" });

  await expect(lastPrevious).not.toHaveAttribute("aria-disabled", "true");
  await expect(lastNext).toHaveAttribute("aria-disabled", "true");
  await expect(lastNext).toHaveAttribute("tabindex", "-1");
});

test("category pagination preserves state through history navigation", async ({
  page,
}) => {
  await page.goto("/projects/?category=sample");

  const pagination = page.locator("[data-catalog-pagination]");
  const visibleLinks = page.locator(
    "[data-project-card]:visible [data-project-link]",
  );

  await pagination.getByRole("link", { name: "Last page" }).click();
  await expect
    .poll(() => {
      const url = new URL(page.url());
      return [url.pathname, url.searchParams.get("category")];
    })
    .toEqual(["/projects/page/2/", "sample"]);
  await expect(visibleLinks).toHaveAttribute("href", "/projects/2/");

  await page.goBack();
  await expect
    .poll(() => {
      const url = new URL(page.url());
      return [url.pathname, url.searchParams.get("category")];
    })
    .toEqual(["/projects/", "sample"]);
  await expect(visibleLinks).toHaveAttribute("href", "/projects/1/");

  await page.goForward();
  await expect
    .poll(() => {
      const url = new URL(page.url());
      return [url.pathname, url.searchParams.get("category")];
    })
    .toEqual(["/projects/page/2/", "sample"]);
  await expect(visibleLinks).toHaveAttribute("href", "/projects/2/");
});

test("a one-result search resets the current pagination route", async ({
  page,
}) => {
  await page.goto("/projects/page/2/");

  const search = page.locator('[data-catalog-controls] input[type="search"]');
  const pagination = page.locator("[data-catalog-pagination]");
  const visibleLinks = page.locator(
    "[data-project-card]:visible [data-project-link]",
  );

  await search.fill("Synthetic project 2");
  await expect(visibleLinks).toHaveCount(1);
  await expect(visibleLinks).toHaveAttribute("href", "/projects/2/");
  await expect.poll(() => new URL(page.url()).pathname).toBe("/projects/");
  await expect
    .poll(() => new URL(page.url()).searchParams.get("q"))
    .toBe("Synthetic project 2");
  await expect(pagination).toBeHidden();
});
