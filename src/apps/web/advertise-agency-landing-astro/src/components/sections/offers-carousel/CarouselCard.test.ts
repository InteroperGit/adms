// @vitest-environment node
import { expect, it } from "vitest";
import type { CarouselItem } from "@/types/imageCarousel";
import { carouselOptionsSchema } from "@/validation/imageCarousel";
import CarouselCard from "./CarouselCard.astro";
import { render } from "../../../../tests/helpers/render";

const item: CarouselItem = {
  id: 1,
  image: "/images/offer.webp",
  imageAlt: "Offer image",
  imageWidth: 800,
  imageHeight: 600,
  enabled: true,
  description: "Offer caption",
  href: "/#contacts",
  linkLabel: "Discuss the offer",
  presentation: {
    fontSizeRem: 1.25,
    textColor: "#ffffff",
    overlay: "dark",
    horizontal: "left",
    vertical: "bottom",
    focalPoint: { x: 50, y: 50 },
  },
};
const options = carouselOptionsSchema.parse({});

it("renders the image, caption, and link as one card", async () => {
  const body = await render(CarouselCard, {
    item,
    index: 0,
    options,
  });
  const card = body.querySelector(".offers-track-card");

  expect(card).not.toHaveAttribute("hidden");
  expect(card?.querySelector("img")).toHaveAttribute("alt", "Offer image");
  expect(card?.querySelector(".offers-track-copy p")).toHaveTextContent(
    "Offer caption",
  );
  expect(card?.querySelector("a.offers-track-link")).toHaveAttribute(
    "href",
    "/#contacts",
  );
});

it("omits disabled copy and action options", async () => {
  const body = await render(CarouselCard, {
    item,
    index: 0,
    options: carouselOptionsSchema.parse({
      descriptions: false,
      buttons: false,
    }),
  });

  expect(body.querySelector(".offers-track-copy")).toBeNull();
});
