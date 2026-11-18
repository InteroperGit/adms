// @vitest-environment node
import { expect, it } from "vitest";
import CarouselDot from "./CarouselDot.astro";
import { render } from "../../../../tests/helpers/render";

it("renders a labeled selectable dot for the active item", async () => {
  const body = await render(CarouselDot, {
    index: 1,
    current: true,
    itemName: "Предложение",
    manualNavigation: true,
    slideId: "offers-carousel-active",
  });
  const dot = body.querySelector("button.carousel-dot");

  expect(dot).toHaveAttribute("type", "button");
  expect(dot).toHaveAttribute("data-index", "1");
  expect(dot).toHaveAttribute("aria-label", "Показать: Предложение 2");
  expect(dot).toHaveAttribute("aria-controls", "offers-carousel-active");
  expect(dot).toHaveAttribute("aria-current", "true");
});

it("renders passive dots without button semantics", async () => {
  const body = await render(CarouselDot, {
    index: 0,
    current: false,
    itemName: "Предложение",
    manualNavigation: false,
    slideId: "offers-carousel-active",
  });
  const dot = body.querySelector("span.carousel-dot");

  expect(dot).toHaveAttribute("data-index", "0");
  expect(dot).not.toHaveAttribute("aria-current");
  expect(body.querySelector("button")).toBeNull();
});
