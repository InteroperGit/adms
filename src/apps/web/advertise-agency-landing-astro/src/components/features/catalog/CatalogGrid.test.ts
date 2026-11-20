// Verify custom caller cards, searchable data, and static page visibility.
// @vitest-environment node
import { expect, it } from "vitest";
import { buildProject } from "../../../../tests/helpers/fixtures";
import { render } from "../../../../tests/helpers/render";
import ProjectCard from "@/components/features/projects/ProjectCard.astro";
import Component from "./CatalogGrid.astro";

it("renders the provided card and catalog metadata", async () => {
  const project = buildProject({ id: 42, title: "Custom project card" });
  const body = await render(Component, {
    Item: ProjectCard,
    items: [
      {
        category: "signs",
        searchText: "Custom project card Client Description Signs",
        props: { project },
      },
    ],
    page: 1,
    pageSize: 8,
    resultsId: "catalog-results",
    resultsLabel: "Catalog results",
  });
  const grid = body.querySelector("#catalog-results");
  const item = grid?.querySelector("[data-catalog-item]");

  expect(grid).toHaveAttribute("aria-label", "Catalog results");
  expect(item).toHaveAttribute("data-category", "signs");
  expect(item).toHaveAttribute("data-search", expect.stringContaining("Signs"));
  expect(item?.querySelector("h3")).toHaveTextContent("Custom project card");
});

it("hides items outside the server-rendered page", async () => {
  const items = [1, 2, 3].map((id) => ({
    category: "",
    searchText: `Project ${id}`,
    props: { project: buildProject({ id }) },
  }));
  const body = await render(Component, {
    Item: ProjectCard,
    items,
    page: 2,
    pageSize: 2,
    resultsId: "catalog-results",
    resultsLabel: "Catalog results",
  });

  expect(
    [...body.querySelectorAll("[data-catalog-item]")].map((item) =>
      item.hasAttribute("hidden"),
    ),
  ).toEqual([true, true, false]);
});
