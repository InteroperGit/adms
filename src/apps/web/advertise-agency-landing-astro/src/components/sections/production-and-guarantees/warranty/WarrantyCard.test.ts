// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./WarrantyCard.astro";
import { productionAndGuarantees } from "@/content/productionAndGuarantees";
import { render } from "../../../../../tests/helpers/render";

it("renders warranty periods, conditions and claim route", async () => {
  const term = productionAndGuarantees.warrantyTerms[0];
  const body = await render(Component, { term });

  expect(body.querySelector("dl")).toHaveTextContent(term.duration);
  expect(body.querySelectorAll("h5")).toHaveLength(2);
  expect(body.querySelector(".warranty-claim")).toHaveTextContent(
    term.claimRoute,
  );
});
