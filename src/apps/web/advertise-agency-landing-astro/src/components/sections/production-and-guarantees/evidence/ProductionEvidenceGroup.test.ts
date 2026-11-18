// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./ProductionEvidenceGroup.astro";
import { productionAndGuarantees } from "@/content/productionAndGuarantees";
import { render } from "../../../../../tests/helpers/render";

it("labels a group and renders each supplied evidence card", async () => {
  const item = {
    ...productionAndGuarantees.productionOperations[0],
    approval: "approved" as const,
  };
  const body = await render(Component, {
    title: "Fixture group",
    items: [item],
  });

  expect(body.querySelector("section")).toHaveAttribute(
    "aria-labelledby",
    "Fixture group-heading",
  );
  expect(body.querySelector(".production-evidence")).toHaveTextContent(
    item.evidence,
  );
});
