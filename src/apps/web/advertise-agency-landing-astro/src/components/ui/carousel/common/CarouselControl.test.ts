// Keep a colocated smoke contract for the CarouselControl component.
// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./CarouselControl.astro";
import { render } from "../../../../../tests/helpers/render";

it("renders a previous arrow with its runtime markers", async () => {
  const body = await render(Component, {
    direction: "previous",
    label: "Previous image",
    className: "carousel-arrow",
    dataDirection: "-1",
    dataGallery: "previous",
  });
  const control = body.querySelector("button");

  expect(Component).toBeDefined();
  expect(control).toHaveClass(
    "carousel-control",
    "carousel-control-arrow",
    "carousel-arrow",
  );
  expect(control).toHaveAttribute("type", "button");
  expect(control).toHaveAttribute("aria-label", "Previous image");
  expect(control).toHaveAttribute("data-direction", "-1");
  expect(control).toHaveAttribute("data-gallery-previous");
  expect(control).not.toHaveAttribute("data-gallery-next");
  expect(control?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  expect(control?.querySelector("svg")).toHaveAttribute("focusable", "false");
  expect(control?.querySelector("path")).toHaveAttribute("d", "m15 5-7 7 7 7");
});

it("renders a close control without arrow markers", async () => {
  const body = await render(Component, {
    variant: "close",
    label: "Close gallery",
    className: "gallery-close",
    dataGallery: "close",
  });
  const control = body.querySelector("button");

  expect(control).toHaveClass("carousel-control-close", "gallery-close");
  expect(control).not.toHaveAttribute("data-direction");
  expect(control).toHaveAttribute("data-gallery-close");
  expect(control).not.toHaveAttribute("data-gallery-previous");
  expect(control).not.toHaveAttribute("data-gallery-next");
  expect(control?.querySelector("path")).toHaveAttribute(
    "d",
    "M6 6l12 12M18 6L6 18",
  );
});

it("does not emit a mismatched gallery marker", async () => {
  const body = await render(Component, {
    variant: "close",
    direction: "next",
    label: "Close gallery",
    dataGallery: "next",
  });
  const control = body.querySelector("button");

  expect(control).not.toHaveAttribute("data-direction");
  expect(control).not.toHaveAttribute("data-gallery-close");
  expect(control).not.toHaveAttribute("data-gallery-next");
});
