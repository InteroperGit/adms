// Verify labels, ids, category options, and the no-JavaScript hidden state.
// @vitest-environment node
import { expect, it } from "vitest";
import { render } from "../../../../tests/helpers/render";
import Component from "./CatalogControls.astro";

it("renders caller labels and category options", async () => {
  const body = await render(Component, {
    categories: [
      { value: "signs", label: "Signs" },
      { value: "letters", label: "Letters" },
    ],
    categoryId: "sample-category",
    labels: {
      search: "Search catalog",
      searchPlaceholder: "Name or client",
      category: "Category",
      allCategories: "All items",
    },
    searchId: "sample-search",
  });
  const search = body.querySelector<HTMLInputElement>("#sample-search");
  const category = body.querySelector<HTMLSelectElement>("#sample-category");

  expect(search?.placeholder).toBe("Name or client");
  expect(body.querySelector('label[for="sample-search"]')).toHaveTextContent(
    "Search catalog",
  );
  expect(category?.options[0]?.textContent).toBe("All items");
  expect([...category!.options].slice(1).map((option) => option.value)).toEqual(
    ["signs", "letters"],
  );
  expect(body.querySelector("form")?.hasAttribute("hidden")).toBe(true);
});
