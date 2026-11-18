// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./MaintenanceDetails.astro";
import { productionAndGuarantees } from "@/content/productionAndGuarantees";
import { render } from "../../../../tests/helpers/render";

it("renders scope, customer duties and service route", async () => {
  const body = await render(Component, {
    maintenance: productionAndGuarantees.maintenance,
  });

  expect(body.querySelector("h3")).toHaveTextContent("Обслуживание");
  expect(body).toHaveTextContent(productionAndGuarantees.maintenance.scope[0]);
  expect(body).toHaveTextContent(
    productionAndGuarantees.maintenance.customerResponsibilities[0],
  );
  expect(body).toHaveTextContent(
    productionAndGuarantees.maintenance.requestRoute,
  );
});
