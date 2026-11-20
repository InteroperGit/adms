// Verify the catalog count keeps its label and changing value accessible.
// @vitest-environment node
import { expect, it } from "vitest";
import { render } from "../../../../tests/helpers/render";
import Component from "./CatalogCount.astro";

it("renders the count in a polite live status", async () => {
  const body = await render(Component, { count: 3, label: "Items found" });
  const status = body.querySelector('[role="status"]');

  expect(status).toHaveAttribute("aria-live", "polite");
  expect(body.querySelector(".catalog-count__label")).toHaveTextContent(
    "Items found",
  );
  expect(body.querySelector("[data-catalog-count-value]")).toHaveTextContent(
    "3",
  );
});
