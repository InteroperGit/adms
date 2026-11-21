// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./CarouselControl.astro";
import { render } from "../../../../../tests/helpers/render";

it("renders gallery arrows with their local markers", async () => {
  const body = await render(Component, {
    direction: "previous",
    label: "Previous image",
    dataDirection: "-1",
    dataGallery: "previous",
  });
  const control = body.querySelector("button");

  expect(control).toHaveClass("carousel-control-arrow");
  expect(control).toHaveAttribute("data-direction", "-1");
  expect(control).toHaveAttribute("data-gallery-previous");
});

it("renders the lightbox close action without arrow markers", async () => {
  const body = await render(Component, {
    variant: "close",
    label: "Close gallery",
    dataGallery: "close",
  });
  const control = body.querySelector("button");

  expect(control).toHaveClass("carousel-control-close");
  expect(control).toHaveAttribute("data-gallery-close");
  expect(control).not.toHaveAttribute("data-direction");
});
