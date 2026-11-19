// Display data accepted by domain-neutral media components.
export interface MediaImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  focalPoint?: { x: number; y: number };
  mobileFocalPoint?: { x: number; y: number };
}

export interface GalleryImage {
  image: MediaImage;
  src: string;
}

export type ImageCrop = "contain" | "cover-3:2" | "cover-4:3";
