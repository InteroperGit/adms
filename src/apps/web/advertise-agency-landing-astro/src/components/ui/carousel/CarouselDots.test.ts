// @vitest-environment node
import { expect, it } from "vitest";
import CarouselDots from "./CarouselDots.astro";
import { render } from "../../../../tests/helpers/render";

const items = [{ id: 4 }, { id: 7 }];

it("groups manual dots in item order with matching slide targets", async () => {
  const body = await render(CarouselDots, {
    items,
    itemName: "photo",
    slideIdPrefix: "work",
    manualNavigation: true,
  });
  const group = body.querySelector(".carousel-dots");
  const dots = body.querySelectorAll("button.carousel-dot");

  expect(group).toHaveAttribute("role", "group");
  expect(group).toHaveAttribute("aria-label", "Выбор изображения");
  expect(group).not.toHaveAttribute("aria-hidden");
  expect(dots).toHaveLength(2);
  expect(dots[0]).toHaveAttribute("data-index", "0");
  expect(dots[0]).toHaveAttribute("aria-controls", "work-4");
  expect(dots[1]).toHaveAttribute("data-index", "1");
  expect(dots[1]).toHaveAttribute("aria-controls", "work-7");
});

it("hides passive dots from the accessibility tree", async () => {
  const body = await render(CarouselDots, {
    items,
    itemName: "photo",
    slideIdPrefix: "work",
    manualNavigation: false,
  });
  const group = body.querySelector(".carousel-dots");

  expect(group).not.toHaveAttribute("role");
  expect(group).not.toHaveAttribute("aria-label");
  expect(group).toHaveAttribute("aria-hidden", "true");
  expect(body.querySelectorAll("span.carousel-dot")).toHaveLength(2);
  expect(body.querySelector("button")).toBeNull();
});

it("renders an empty group when there are no items", async () => {
  const body = await render(CarouselDots, {
    items: [],
    itemName: "photo",
    slideIdPrefix: "work",
    manualNavigation: true,
  });
  const group = body.querySelector(".carousel-dots");

  expect(group).toHaveAttribute("role", "group");
  expect(group?.children).toHaveLength(0);
});
