// @vitest-environment node
import { expect, it } from "vitest";
import photo from "../../../assets/offers/storefront.webp";
import type { IntroductionPhoto as PhotoData } from "@/types/introduction";
import Component from "./IntroductionPhoto.astro";
import { render } from "../../../../tests/helpers/render";

const photoData: PhotoData = {
  src: "/images/introduction.webp",
  alt: "Storefront sign",
  width: 1200,
  height: 900,
  source: "Test source",
  projectContext: "Test context",
  publicationPermission: "Test permission",
  approved: true,
  desktopFocalPoint: { x: 45, y: 40 },
  mobileFocalPoint: { x: 62, y: 36 },
};

it("renders a public photo URL and both focal points", async () => {
  const body = await render(Component, {
    photo: photoData,
  });
  const frame = body.querySelector(".introduction-photo");
  const image = frame?.querySelector("img");

  expect(image).toHaveAttribute("src", photoData.src);
  expect(image).toHaveAttribute("alt", photoData.alt);
  expect(image).toHaveAttribute("width", String(photoData.width));
  expect(image).toHaveAttribute("height", String(photoData.height));
  expect(frame).toHaveStyle({
    "--desktop-focal-point": "45% 40%",
    "--mobile-focal-point": "62% 36%",
  });
});

it("renders bundled media through Astro Image", async () => {
  const body = await render(Component, {
    photo: photoData,
    original: photo,
  });
  const image = body.querySelector(".introduction-photo img");

  expect(image).toHaveAttribute("alt", photoData.alt);
  expect(image).toHaveAttribute("srcset");
  expect(image).toHaveAttribute("sizes", "(min-width: 64rem) 46vw, 100vw");
});
