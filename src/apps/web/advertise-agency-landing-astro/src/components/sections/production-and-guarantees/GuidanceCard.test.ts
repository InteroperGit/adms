// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./GuidanceCard.astro";
import { productionAndGuarantees } from "@/content/productionAndGuarantees";
import { render } from "../../../../tests/helpers/render";

it("renders a guarantee card with a decorative icon", async () => {
  const item = productionAndGuarantees.guidance[0];
  const body = await render(Component, item);

  expect(body.querySelector("h3")).toHaveTextContent(item.title);
  expect(body.querySelector(".production-card-icon")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});
