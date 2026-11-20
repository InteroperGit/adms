// Verify the catalog composition wires caller data into each shared block.
// @vitest-environment node
import { expect, it } from "vitest";
import { buildProject } from "../../../../tests/helpers/fixtures";
import { render } from "../../../../tests/helpers/render";
import ProjectCard from "@/components/features/projects/ProjectCard.astro";
import Component from "./Catalog.astro";

it("composes catalog blocks around a caller card", async () => {
  const project = buildProject({ id: 8, title: "Composed project" });
  const body = await render(Component, {
    Item: ProjectCard,
    basePath: "/projects/",
    categories: [{ value: "signs", label: "Signs" }],
    currentPage: 1,
    id: "project-catalog",
    items: [
      {
        category: "signs",
        searchText: "Composed project",
        props: { project },
      },
    ],
    labels: {
      allCategories: "All projects",
      category: "Category",
      count: "Items found",
      emptyMessage: "No projects.",
      emptyTitle: "No projects yet",
      pagination: "Project pages",
      reset: "Reset filters",
      results: "Catalog results",
      search: "Search projects",
      searchEmptyMessage: "Change the search.",
      searchEmptyTitle: "No matches",
      searchPlaceholder: "Name or client",
    },
    pageCount: 2,
    pageHref: (page: number) => `/projects/page/${page}/`,
    pageSize: 1,
    resultsId: "catalog-results",
  });

  expect(body.querySelector("[data-catalog]")).toHaveAttribute(
    "data-catalog-base-path",
    "/projects/",
  );
  expect(body.querySelector("#project-catalog-category option")).toHaveValue(
    "",
  );
  expect(body.querySelector("#catalog-results h3")).toHaveTextContent(
    "Composed project",
  );
  expect(body.querySelector("[data-catalog-search-empty]")).toHaveAttribute(
    "hidden",
  );
  expect(body.querySelector("[data-catalog-pagination]")).toBeInTheDocument();
});
