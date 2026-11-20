// Verify the distinct empty states and their accessible reset action.
// @vitest-environment node
import { expect, it } from "vitest";
import { render } from "../../../../tests/helpers/render";
import Component from "./CatalogEmpty.astro";

const labels = {
  emptyTitle: "No items yet",
  emptyMessage: "Published items will appear here.",
  searchEmptyTitle: "No matches",
  searchEmptyMessage: "Change the search.",
  reset: "Reset filters",
};

it("renders the empty catalog with a named section", async () => {
  const body = await render(Component, {
    id: "catalog-empty",
    kind: "catalog",
    labels,
  });
  const section = body.querySelector("section");

  expect(section).toHaveAttribute("aria-labelledby", "catalog-empty-title");
  expect(body.querySelector("#catalog-empty-title")).toHaveTextContent(
    "No items yet",
  );
  expect(section?.querySelector("button")).toBeNull();
});

it("hides search feedback until enhancement and exposes reset", async () => {
  const body = await render(Component, {
    id: "catalog-search-empty",
    kind: "search",
    labels,
  });
  const section = body.querySelector("[data-catalog-search-empty]");

  expect(section).toHaveAttribute("hidden");
  expect(section).toHaveAttribute(
    "aria-labelledby",
    "catalog-search-empty-title",
  );
  expect(section).toHaveTextContent("No matches");
  expect(section?.querySelector("[data-catalog-reset]")).toHaveTextContent(
    "Reset filters",
  );
});
