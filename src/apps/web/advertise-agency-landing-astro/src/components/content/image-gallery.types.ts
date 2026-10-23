// Share resolved image resources between the gallery's presentation parts.
import type { ImageGalleryBlock } from "@/types/content-blocks";

export interface GalleryImage {
  image: ImageGalleryBlock["images"][number];
  src: string;
}
