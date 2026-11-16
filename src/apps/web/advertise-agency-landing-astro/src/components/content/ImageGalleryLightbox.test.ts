// @vitest-environment node
// The gallery modal renders an accessible shell before browser enhancement.
import { expect, it } from "vitest";
import ImageGalleryLightbox from "./ImageGalleryLightbox.astro";
import type { GalleryImage } from "./image-gallery.types";
import { render } from "../../../tests/helpers/render";

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

it("renders labeled controls and thumbnail choices", async () => {
  const body = await render(ImageGalleryLightbox, { images });
  const dialog = body.querySelector("[data-gallery-dialog]");
  const image = body.querySelector(".gallery-image");
  const thumbnails = [
    ...body.querySelectorAll<HTMLButtonElement>(
      ".gallery-lightbox-thumbnail",
    ),
  ];

  expect(dialog).toHaveAttribute("aria-label", "Галерея изображений");
  expect(dialog).not.toHaveAttribute("open");
  expect(body.querySelector("[data-gallery-close]")).toHaveAttribute(
    "aria-label",
    "Закрыть галерею",
  );
  expect(body.querySelector("[data-gallery-previous]")).toHaveAttribute(
    "aria-label",
    "Предыдущее изображение",
  );
  expect(body.querySelector("[data-gallery-next]")).toHaveAttribute(
    "aria-label",
    "Следующее изображение",
  );
  expect(image).toHaveAttribute("alt", "First display");
  expect(image).toHaveAttribute("width", "800");
  expect(image).toHaveAttribute("height", "600");
  expect(body.querySelector("[data-gallery-caption]")).toBeInTheDocument();
  expect(body.querySelector("[aria-live='polite']")).toBeInTheDocument();
  expect(thumbnails).toHaveLength(2);
  expect(thumbnails[0]).toHaveAttribute(
    "aria-label",
    "Показать изображение 1",
  );
  expect(thumbnails[0]).toHaveAttribute("aria-current", "true");
  expect(thumbnails[1]).not.toHaveAttribute("aria-current");
  expect(thumbnails[0].querySelector("img")).toHaveAttribute(
    "src",
    "/full-one.webp",
  );
  expect(thumbnails[0].querySelector("img")).toHaveAttribute("alt", "");
  expect(thumbnails[0].querySelector("img")).toHaveAttribute("width", "800");
});

it("renders the empty lightbox shell without thumbnail choices", async () => {
  const body = await render(ImageGalleryLightbox, { images: [] });
  const image = body.querySelector(".gallery-image");

  expect(body.querySelector("[data-gallery-dialog]")).toBeInTheDocument();
  expect(image).toHaveAttribute("alt", "");
  expect(image).not.toHaveAttribute("width");
  expect(image).not.toHaveAttribute("height");
  expect(body.querySelectorAll(".gallery-lightbox-thumbnail")).toHaveLength(0);
  expect(body.querySelector("[aria-live='polite']")).toBeInTheDocument();
});
