// @vitest-environment node
// Image blocks keep captions adjacent to their responsive media.
import { expect, it } from "vitest";
import ImageBlock from "./ImageBlock.astro";
import { render } from "../../../../../tests/helpers/render";

it("renders image alt text, caption and service crop state", async () => {
  const body = await render(ImageBlock, {
    block: {
      type: "image",
      src: "/fixture.webp",
      alt: "Fixture",
      width: 800,
      height: 600,
      caption: "Fixture caption",
    },
    crop: "cover-4:3",
  });
  expect(body.querySelector("img")).toHaveAttribute("alt", "Fixture");
  expect(body.querySelector(".media-gallery-caption")).toHaveTextContent(
    "Fixture caption",
  );
  expect(body.querySelector(".responsive-image-cover-4-3")).toBeInTheDocument();
  expect(
    body.querySelector("[data-gallery-layout='single']"),
  ).toBeInTheDocument();
});

it("omits an absent caption while preserving lazy media defaults", async () => {
  const body = await render(ImageBlock, {
    block: {
      type: "image",
      src: "/fixture.webp",
      alt: "Fixture",
      width: 640,
      height: 480,
    },
  });
  expect(body.querySelector(".media-gallery-caption")).toBeNull();
  expect(body.querySelector("img")).toHaveAttribute("loading", "lazy");
});
