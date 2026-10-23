// @vitest-environment node
// Gallery links remain usable when the client enhancement is unavailable.
import { expect, it } from "vitest";
import ImageGallery from "./ImageGallery.astro";
import { render } from "../../../tests/helpers/render";

it("renders every image as a native link in the tile gallery", async () => {
  const image = (src: string) => ({
    src,
    alt: "Gallery image",
    width: 800,
    height: 600,
  });
  const body = await render(ImageGallery, {
    block: {
      type: "image-gallery",
      images: [image("/one.webp"), image("/two.webp")],
    },
  });
  expect(body.querySelector(".gallery-grid")).toBeInTheDocument();
  expect(body.querySelectorAll(".gallery-tile")).toHaveLength(2);
  expect(body.querySelector(".gallery-tile")).toHaveAttribute(
    "aria-current",
    "true",
  );
  expect(body.querySelector("[data-gallery-dialog]")).toBeInTheDocument();
});

it("renders no interactive surface for an empty gallery", async () => {
  const body = await render(ImageGallery, {
    block: {
      type: "image-gallery",
      images: [],
      caption: "Empty gallery",
    },
  });
  expect(body.querySelector(".content-gallery")).toBeNull();
  expect(body.querySelector("[data-gallery-dialog]")).toBeNull();
});
