// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./OffersCarousel.astro";
import { render } from "../../../../tests/helpers/render";

it("renders enabled offers through the feature carousel", async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(body.querySelector("section#offers")).toBeInTheDocument();
  expect(
    body.querySelector('cylinder-carousel[role="region"]'),
  ).toBeInTheDocument();
  expect(body.querySelectorAll("[data-cylinder-slide]")).toHaveLength(3);
  expect(body.querySelectorAll(".offers-track-card")).toHaveLength(3);
  expect(body.querySelectorAll(".cylinder-arrow")).toHaveLength(2);
});
