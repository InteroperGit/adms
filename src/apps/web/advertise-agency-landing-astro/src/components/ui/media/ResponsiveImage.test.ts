// @vitest-environment node
// Content media exposes intrinsic dimensions and authored focal points.
import { expect, it } from "vitest";
import ResponsiveImage from "./ResponsiveImage.astro";
import { render } from "../../../../tests/helpers/render";

it("renders public media with reserved geometry and metadata", async () => {
  const body = await render(ResponsiveImage, {
    src: "/fixture.webp",
    alt: "Fixture",
    width: 800,
    height: 600,
    focalPoint: { x: 20, y: 30 },
    caption: "Caption",
    crop: "cover-3:2",
    priority: true,
  });
  const frame = body.querySelector(".responsive-image-frame");
  expect(frame).toHaveAttribute("data-image-state", "loading");
  expect(frame).toHaveStyle("--media-position: 20% 30%");
  expect(frame).toHaveClass("responsive-image-cover-3-2");
  expect(body.querySelector("img")).toHaveAttribute("alt", "Fixture");
  expect(body.querySelector("img")).toHaveAttribute("loading", "eager");
});

it("shows a readable error for missing media", async () => {
  const body = await render(ResponsiveImage, {
    src: "/missing.webp",
    alt: "<b>Missing</b>",
    width: 320,
    height: 180,
  });
  expect(body.querySelector("img")).toHaveAttribute("src", "/missing.webp");
  expect(body.querySelector(".responsive-image-error")).toHaveAttribute(
    "role",
    "status",
  );
  expect(body.querySelector("b")).toBeNull();
});
