// @vitest-environment node
// Gallery tiles keep full-size links available without client enhancement.
import { expect, it } from "vitest";
import ImageGalleryTiles from "./ImageGalleryTiles.astro";
import type { GalleryImage } from "./types";
import { render } from "../../../../tests/helpers/render";

const images: GalleryImage[] = [
  {
    src: "/full-one.webp",
    image: {
      src: "/tile-one.webp",
      alt: "First display",
      width: 800,
      height: 600,
      caption: "First caption",
    },
  },
  {
    src: "/full-two.webp",
    image: {
      src: "/tile-two.webp",
      alt: "Second display",
      width: 640,
      height: 480,
    },
  },
];

it("keeps tile order, full-size links and first-image priority", async () => {
  const body = await render(ImageGalleryTiles, { images, priority: true });
  const tiles = [...body.querySelectorAll<HTMLAnchorElement>(".gallery-tile")];
  const photos = [...body.querySelectorAll<HTMLImageElement>("img")];

  expect(tiles).toHaveLength(2);
  expect(tiles.map((tile) => tile.getAttribute("href"))).toEqual([
    "/full-one.webp",
    "/full-two.webp",
  ]);
  expect(tiles.map((tile) => tile.getAttribute("data-gallery-open"))).toEqual([
    "0",
    "1",
  ]);
  expect(tiles[0]).toHaveAttribute("aria-current", "true");
  expect(tiles[1]).not.toHaveAttribute("aria-current");
  expect(photos.map((photo) => photo.getAttribute("alt"))).toEqual([
    "First display",
    "Second display",
  ]);
  expect(photos[0]).toHaveAttribute("width", "800");
  expect(photos[0]).toHaveAttribute("height", "600");
  expect(photos[0]).toHaveAttribute("loading", "eager");
  expect(photos[1]).toHaveAttribute("loading", "lazy");
  expect(photos[0]).toHaveAttribute("data-caption", "First caption");
});

it("renders an empty grid without interactive tiles", async () => {
  const body = await render(ImageGalleryTiles, { images: [] });

  expect(body.querySelector(".gallery-grid")).toBeInTheDocument();
  expect(body.querySelectorAll(".gallery-tile")).toHaveLength(0);
});
