// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./CarouselControl.astro";
import { render } from "../../../../../tests/helpers/render";

it("renders a labeled circular arrow for card navigation", async () => {
  const body = await render(Component, {
    direction: "next",
    label: "Next card",
    dataDirection: "1",
    appearance: "circle",
  });
  const control = body.querySelector("button");

  expect(control).toHaveClass(
    "carousel-control-arrow",
    "carousel-control-circle",
  );
  expect(control).toHaveAttribute("type", "button");
  expect(control).toHaveAttribute("aria-label", "Next card");
  expect(control).toHaveAttribute("data-direction", "1");
});
