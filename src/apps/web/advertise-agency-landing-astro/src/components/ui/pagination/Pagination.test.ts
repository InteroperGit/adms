// Verify generic pagination links, accessible names, and disabled boundaries.
// @vitest-environment node
import { expect, it } from "vitest";
import { render } from "../../../../tests/helpers/render";
import { getPaginationItems } from "./pagination";
import Component from "./Pagination.astro";

it.each([
  { total: 1, current: 1, expected: [] },
  { total: 7, current: 4, expected: [1, 2, 3, 4, 5, 6, 7] },
  { total: 10, current: 1, expected: [1, 2, 3, 4, 5, "ellipsis", 10] },
  {
    total: 10,
    current: 5,
    expected: [1, "ellipsis", 4, 5, 6, "ellipsis", 10],
  },
  { total: 10, current: 10, expected: [1, "ellipsis", 6, 7, 8, 9, 10] },
])(
  "builds a page window for $current of $total",
  ({ total, current, expected }) => {
    expect(getPaginationItems(total, current)).toEqual(expected);
  },
);

it("renders accessible links from the supplied route builder", async () => {
  const body = await render(Component, {
    currentPage: 2,
    label: "Article pages",
    pageCount: 4,
    pageHref: (page: number) => `/articles/page/${page}/?topic=design#list`,
  });
  const nav = body.querySelector("nav");

  expect(nav).toHaveAttribute("aria-label", "Article pages");
  expect(nav?.querySelector('[aria-current="page"]')).toHaveTextContent("2");
  expect(nav?.querySelector('[aria-label="Previous page"]')).toHaveAttribute(
    "href",
    "/articles/page/1/?topic=design#list",
  );
  expect(nav?.querySelector('[aria-label="Next page"]')).toHaveAttribute(
    "href",
    "/articles/page/3/?topic=design#list",
  );
});

it("disables edge controls and hides a single-page navigation", async () => {
  const first = await render(Component, {
    currentPage: 1,
    label: "Project pages",
    pageCount: 2,
    pageHref: (page: number) => `/projects/page/${page}/`,
  });
  const previous = first.querySelector('[aria-label="Previous page"]');

  expect(previous).toHaveAttribute("href", "/projects/page/1/");
  expect(previous).toHaveAttribute("aria-disabled", "true");
  expect(previous).toHaveAttribute("tabindex", "-1");

  const single = await render(Component, {
    currentPage: 1,
    label: "Project pages",
    pageCount: 1,
    pageHref: (page: number) => `/projects/page/${page}/`,
  });
  expect(single.querySelector("nav")).toHaveAttribute("hidden");
});
