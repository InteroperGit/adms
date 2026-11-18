// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./ProductionGuidance.astro";
import { productionAndGuarantees } from "@/content/productionAndGuarantees";
import { render } from "../../../../tests/helpers/render";

it("renders supplied general guidance and its decorative icon", async () => {
  const body = await render(Component, {
    items: productionAndGuarantees.guidance,
  });

  expect(body.querySelector(".production-card h3")).toHaveTextContent(
    productionAndGuarantees.guidance[0].title,
  );
  expect(body.querySelector(".production-card-icon")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});
