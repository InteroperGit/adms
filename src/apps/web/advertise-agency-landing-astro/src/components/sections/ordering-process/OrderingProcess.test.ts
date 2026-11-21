// @vitest-environment node
import { expect, it } from "vitest";
import { getByRole } from "@testing-library/dom";
import Component from "./OrderingProcess.astro";
import { orderingProcess } from "@/content/orderingProcess";
import { render } from "../../../../tests/helpers/render";

it("renders the sequence, responsibilities and inquiry action", async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(getByRole(body, "heading", { level: 2 })).toBeInTheDocument();
  expect(body.querySelector(".card-carousel")).toHaveAttribute(
    "aria-label",
    "Как проходит заказ",
  );
  expect(
    body.querySelector(".card-carousel ol.card-carousel-list"),
  ).toBeTruthy();
  expect(body.querySelectorAll("ol.card-carousel-list > li")).toHaveLength(
    orderingProcess.steps.length,
  );
  expect(
    body.querySelectorAll("ol.card-carousel-list > li .ordering-step-number"),
  ).toHaveLength(orderingProcess.steps.length);
  expect(body.querySelectorAll(".ordering-card h3").length).toBe(
    body.querySelectorAll("ol.card-carousel-list > li").length,
  );
  expect(getByRole(body, "link", { name: /обсудить задачу/i })).toHaveAttribute(
    "href",
    "/#order-inquiry",
  );
});
