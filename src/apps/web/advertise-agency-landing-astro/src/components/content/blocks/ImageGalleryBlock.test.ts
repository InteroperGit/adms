// @vitest-environment node
// The gallery block provides a stable wrapper around the interactive gallery.
import { expect, it } from "vitest";
import ImageGalleryBlock from "./ImageGalleryBlock.astro";
import { render } from "../../../../tests/helpers/render";

it("renders the gallery surface and its image links", async () => {
  const body = await render(ImageGalleryBlock, {
    block: {
      type: "image-gallery",
      images: [
        {
          src: "/one.webp",
          alt: "Gallery image",
          width: 800,
          height: 600,
        },
      ],
    },
  });
  expect(body.querySelector(".image-gallery-block")).toBeInTheDocument();
  expect(body.querySelector(".gallery-grid")).toBeInTheDocument();
  expect(body.querySelector(".gallery-tile")).toBeInTheDocument();
  expect(body.querySelector("[data-gallery-dialog]")).toBeInTheDocument();
});

it("keeps every tile as a native link in a nine-image gallery", async () => {
  const images = Array.from({ length: 9 }, (_, index) => ({
    src: `/image-${index + 1}.webp`,
    alt: `Gallery image ${index + 1}`,
    width: 800,
    height: 600,
  }));
  const body = await render(ImageGalleryBlock, {
    block: {
      type: "image-gallery",
      images,
    },
  });
  const tiles = body.querySelectorAll<HTMLAnchorElement>(".gallery-tile");

  expect(tiles).toHaveLength(9);
  expect(tiles[0]).toHaveAttribute("data-gallery-open", "0");
  expect(tiles[0]).toHaveAttribute("href", "/image-1.webp");
  expect(tiles[8]).toHaveAttribute("href", "/image-9.webp");
});

it("passes a gallery caption through to the interactive surface", async () => {
  const body = await render(ImageGalleryBlock, {
    block: {
      type: "image-gallery",
      caption: "Project views",
      images: [
        {
          src: "/one.webp",
          alt: "Gallery image",
          width: 800,
          height: 600,
        },
      ],
    },
  });
  expect(body.querySelector(".media-gallery > figcaption")).toHaveTextContent(
    "Project views",
  );
});
