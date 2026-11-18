// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./ProductionEvidenceCard.astro";
import { productionAndGuarantees } from "@/content/productionAndGuarantees";
import { render } from "../../../../../tests/helpers/render";

it("keeps evidence visible with a keyboard focus target", async () => {
  const item = productionAndGuarantees.productionOperations[0];
  const body = await render(Component, { item });

  expect(body.querySelector("article")).toHaveAttribute("tabindex", "0");
  expect(body.querySelector("h4")).toHaveTextContent(item.title);
  expect(body.querySelector(".production-evidence")).toHaveTextContent(
    item.evidence,
  );
});
