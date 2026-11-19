// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./OffersCarouselView.astro";
import { render } from "../../../../tests/helpers/render";

const presentation = {
  fontSizeRem: 1.25,
  textColor: "#ffffff",
  overlay: "dark" as const,
  horizontal: "left" as const,
  vertical: "bottom" as const,
  focalPoint: { x: 50, y: 50 },
};
const items = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  image: `/image-${index}.webp`,
  imageAlt: `Slide ${index + 1}`,
  imageWidth: 800,
  imageHeight: 600,
  enabled: true,
  description: `Offer ${index + 1}`,
  href: "/#contacts",
  linkLabel: "Contact us",
  presentation,
}));

it.each([0, 1, 2, 3, 10])("renders %i slides exactly once", async (count) => {
  const body = await render(Component, {
    items: items.slice(0, count),
    options: {},
  });
  expect(body.querySelectorAll("[data-cylinder-slide]")).toHaveLength(count);
  expect(body.querySelectorAll(".offers-track-card")).toHaveLength(count);
});

it("keeps preview controls independently configurable", async () => {
  const body = await render(Component, {
    items,
    options: { autoplay: false, arrows: false, circles: false },
  });
  const carousel = body.querySelector("cylinder-carousel");
  expect(carousel).toHaveAttribute("data-autoplay", "false");
  expect(body.querySelector("[data-cylinder-prev]")).toBeNull();
  expect(body.querySelector("[data-cylinder-next]")).toBeNull();
  expect(body.querySelectorAll("[data-cylinder-index]")).toHaveLength(0);
});
