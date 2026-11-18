// @vitest-environment node
import { expect, it } from "vitest";
import type { CarouselItem } from "@/types/imageCarousel";
import { carouselOptionsSchema } from "@/validation/imageCarousel";
import CarouselTrack from "./CarouselTrack.astro";
import { render } from "../../../../tests/helpers/render";

const item = (id: number): CarouselItem => ({
  id,
  image: `/images/offer-${id}.webp`,
  imageAlt: `Offer ${id}`,
  imageWidth: 800,
  imageHeight: 600,
  enabled: true,
  presentation: {
    fontSizeRem: 1.25,
    textColor: "#ffffff",
    overlay: "dark",
    horizontal: "left",
    vertical: "bottom",
    focalPoint: { x: 50, y: 50 },
  },
});
const options = carouselOptionsSchema.parse({});

it("renders five cyclic slots with one active slot", async () => {
  const body = await render(CarouselTrack, {
    items: [item(1), item(2), item(3)],
    options,
  });
  const slots = body.querySelectorAll(".offers-track-slot");

  expect(slots).toHaveLength(5);
  expect(slots[0]).toHaveAttribute("data-track-offset", "-2");
  expect(slots[2]).toHaveAttribute("data-track-offset", "0");
  expect(slots[2]).not.toHaveAttribute("aria-hidden");
  expect(slots[2]).not.toHaveAttribute("inert");
  expect(slots[0]).toHaveAttribute("aria-hidden", "true");
  expect(slots[0]).toHaveAttribute("inert");
});

it("shows the same two-item neighbor on both sides", async () => {
  const body = await render(CarouselTrack, {
    items: [item(1), item(2)],
    options,
  });
  const neighborCards = body.querySelectorAll(
    '.offers-track-slot[data-track-offset="-1"] [data-track-index="1"], ' +
      '.offers-track-slot[data-track-offset="1"] [data-track-index="1"]',
  );

  expect(neighborCards).toHaveLength(2);
  expect(neighborCards[0]).not.toHaveAttribute("hidden");
  expect(neighborCards[1]).not.toHaveAttribute("hidden");
});

it("renders one slot for a single item", async () => {
  const body = await render(CarouselTrack, {
    items: [item(1)],
    options,
  });

  expect(body.querySelectorAll(".offers-track-slot")).toHaveLength(1);
});
