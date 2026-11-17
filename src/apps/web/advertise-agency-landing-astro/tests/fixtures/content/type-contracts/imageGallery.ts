// Compile-only examples for the private gallery renderer and public block.
import type { GalleryImage } from "@/components/content/imageGallery.types";
import type { ImageGalleryBlock } from "@/types";

export const galleryImage = {
  src: "/full-size.webp",
  image: {
    src: "/thumbnail.webp",
    alt: "Gallery fixture",
    width: 800,
    height: 600,
    caption: "Optional caption",
  },
} satisfies GalleryImage;

export const galleryBlock = {
  type: "image-gallery",
  images: [galleryImage.image],
} satisfies ImageGalleryBlock;

export const imageWithoutCaption = {
  src: "/full-size.webp",
  image: {
    src: "/thumbnail.webp",
    alt: "Gallery fixture",
    width: 800,
    height: 600,
  },
} satisfies GalleryImage;

// @ts-expect-error Gallery image metadata requires alternative text.
export const missingAlt: GalleryImage["image"] = {
  src: "/thumbnail.webp",
  width: 800,
  height: 600,
};

// @ts-expect-error Gallery image metadata requires a width.
export const missingWidth: GalleryImage["image"] = {
  src: "/thumbnail.webp",
  alt: "Gallery fixture",
  height: 600,
};

// @ts-expect-error Gallery image metadata requires a height.
export const missingHeight: GalleryImage["image"] = {
  src: "/thumbnail.webp",
  alt: "Gallery fixture",
  width: 800,
};
