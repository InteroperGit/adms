// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./OrderingResponsibilities.astro";
import { orderingProcess } from "@/content/orderingProcess";
import { render } from "../../../../tests/helpers/render";

it("renders the customer and agency responsibilities in order", async () => {
  const step = orderingProcess.steps[0];
  const body = await render(Component, {
    customerProvides: step.customerProvides,
    agencyHandles: step.agencyHandles,
  });
  const lists = body.querySelectorAll("ul");

  expect(body.querySelectorAll("h4").item(0)).toHaveTextContent("клиента");
  expect(body.querySelectorAll("h4").item(1)).toHaveTextContent("агентство");
  expect(lists.item(0)).toHaveTextContent(step.customerProvides.join(" "));
  expect(lists.item(1)).toHaveTextContent(step.agencyHandles.join(" "));
});
