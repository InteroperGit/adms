// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./CarouselControl.astro";
import { render } from "../../../../../tests/helpers/render";

it("renders a transparent-background cylinder arrow", async () => {
  const body = await render(Component, {
    direction: "next",
    label: "Next image",
    dataCylinder: "next",
  });
  const control = body.querySelector("button");

  expect(control).toHaveClass("carousel-control", "cylinder-arrow");
  expect(control).toHaveAttribute("type", "button");
  expect(control).toHaveAttribute("aria-label", "Next image");
  expect(control).toHaveAttribute("data-cylinder-next");
  expect(control).not.toHaveAttribute("data-cylinder-prev");
});
