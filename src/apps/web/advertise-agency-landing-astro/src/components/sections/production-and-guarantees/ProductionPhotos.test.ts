// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./ProductionPhotos.astro";
import { render } from "../../../../tests/helpers/render";

it("keeps photo alternatives, dimensions and captions together", async () => {
  const body = await render(Component, {
    photos: [
      {
        src: "/images/sample.webp",
        alt: "Synthetic workshop image",
        caption: "Synthetic caption",
        width: 640,
        height: 480,
        source: "fixture",
        rights: "fixture",
        approval: "approved",
      },
    ],
  });
  const image = body.querySelector("img")!;

  expect(image).toHaveAttribute("alt", "Synthetic workshop image");
  expect(image).toHaveAttribute("width", "640");
  expect(body.querySelector("figcaption")).toHaveTextContent(
    "Synthetic caption",
  );
});
