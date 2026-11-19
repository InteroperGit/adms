// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./CylinderCarousel.astro";
import { render } from "../../../../tests/helpers/render";

it("renders caller slides once and exposes optional controls", async () => {
  const body = await render(
    Component,
    {
      label: "Gallery",
      previousLabel: "Previous image",
      nextLabel: "Next image",
      dotsLabel: "Choose image",
      slideLabel: "Show image",
      autoplay: false,
      controls: false,
      dots: false,
    },
    {
      default:
        "<div data-cylinder-slide>One</div><div data-cylinder-slide>Two</div>",
    },
  );

  expect(body.querySelector("cylinder-carousel")).toHaveAttribute(
    "aria-label",
    "Gallery",
  );
  expect(body.querySelectorAll("[data-cylinder-slide]")).toHaveLength(2);
  expect(body.querySelector("[data-cylinder-prev]")).toBeNull();
  expect(body.querySelector("[data-cylinder-next]")).toBeNull();
  expect(body.querySelector(".cylinder-dots")).toBeNull();
});
