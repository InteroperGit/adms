// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./OffersCarousel.astro";
import { render } from "../../../../tests/helpers/render";

it("renders enabled offers through the feature carousel", async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(body.querySelector("section#offers")).toBeInTheDocument();
  expect(
    body.querySelector('offers-image-carousel[role="region"]'),
  ).toBeInTheDocument();
  expect(body.querySelectorAll(".offers-track-slot")).toHaveLength(5);
  expect(body.querySelectorAll(".offers-track-card")).not.toHaveLength(0);
  expect(body.querySelectorAll(".carousel-arrow")).toHaveLength(2);
});
