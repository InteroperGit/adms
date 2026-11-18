// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./WarrantyTerms.astro";
import { productionAndGuarantees } from "@/content/productionAndGuarantees";
import { render } from "../../../../../tests/helpers/render";

it("omits empty warranty groups and renders supplied terms", async () => {
  const empty = await render(Component, { terms: [] });
  const term = {
    ...productionAndGuarantees.warrantyTerms[0],
    approval: "approved" as const,
  };
  const populated = await render(Component, { terms: [term] });

  expect(empty.querySelector(".warranty-group")).toBeNull();
  expect(populated.querySelector("#warranty-heading")).toHaveTextContent(
    "Гарантия",
  );
  expect(populated.querySelector(".warranty-card")).toBeInTheDocument();
});
