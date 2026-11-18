// @vitest-environment node
import { expect, it } from "vitest";
import Component from "./PhotoGrid.astro";
import { render } from "../../../tests/helpers/render";

it("keeps photo alternatives, dimensions and captions together", async () => {
  const body = await render(Component, {
    photos: [
      {
        src: "/images/sample.webp",
        alt: "Synthetic workshop image",
        caption: "Synthetic caption",
        width: 640,
        height: 480,
      },
      {
        src: "/images/second.webp",
        alt: "Second photo",
        width: 400,
        height: 300,
      },
    ],
  });
  const image = body.querySelector("img")!;

  expect(image).toHaveAttribute("alt", "Synthetic workshop image");
  expect(image).toHaveAttribute("width", "640");
  expect(image).toHaveAttribute("height", "480");
  expect(image).toHaveAttribute("loading", "lazy");
  expect(image).toHaveAttribute("decoding", "async");
  expect(body.querySelectorAll("img")[1]).toHaveAttribute(
    "alt",
    "Second photo",
  );
  expect(body.querySelectorAll("figcaption")).toHaveLength(1);
  expect(body.querySelector("figcaption")).toHaveTextContent(
    "Synthetic caption",
  );
});

it("omits the grid when there are no photos", async () => {
  const body = await render(Component, { photos: [] });
  expect(body.firstElementChild).toBeNull();
});
