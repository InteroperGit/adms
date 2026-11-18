// @vitest-environment node
import { expect, it } from "vitest";
import CarouselDot from "./CarouselDot.astro";
import { render } from "../../../../tests/helpers/render";

it("renders a labeled button linked to its slide", async () => {
  const body = await render(CarouselDot, {
    index: 2,
    itemName: "slide",
    manualNavigation: true,
    slideId: "gallery-slide-3",
  });
  const button = body.querySelector("button.carousel-dot");

  expect(button).toHaveAttribute("type", "button");
  expect(button).toHaveAttribute("data-index", "2");
  expect(button).toHaveAttribute("aria-label", "Показать: slide 3");
  expect(button).toHaveAttribute("aria-controls", "gallery-slide-3");
  expect(button?.querySelector("span")).toHaveAttribute("aria-hidden", "true");
});

it("renders passive markers without interactive semantics", async () => {
  const body = await render(CarouselDot, {
    index: 0,
    itemName: "slide",
    manualNavigation: false,
    slideId: "gallery-slide-1",
  });
  const marker = body.querySelector("span.carousel-dot");

  expect(marker).toHaveAttribute("data-index", "0");
  expect(marker).not.toHaveAttribute("role");
  expect(marker).not.toHaveAttribute("aria-label");
  expect(marker).not.toHaveAttribute("aria-controls");
  expect(body.querySelector("button")).toBeNull();
});
