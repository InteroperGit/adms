import type { CarouselContent } from './image-carousel';

/** Reusable solution copy and optional evidence for business types. */
export interface BusinessSolutionMedia {
  src: string;
  alt: string;
  width: number;
  height: number;
  source: string;
  rights: string;
}

/** Project attribution is maintained separately from the reusable copy. */
export interface BusinessSolutionAttribution {
  customerName: string | null;
  projectId: string | null;
  href: string | null;
  evidence: string | null;
  media: BusinessSolutionMedia[];
}

export interface BusinessSolutionItem {
  id: string;
  title: string;
  summary: string;
  customerTask: string;
  solution: string;
  example: {
    title: string;
    text: string;
  };
  inquiryLabel: string;
  inquiryHref: '/#order-inquiry';
  carousel: BusinessSolutionCarousel;
  attribution: BusinessSolutionAttribution;
}

/**
 * Carousel media provenance is required for every published solution gallery.
 */
export interface BusinessSolutionCarousel extends CarouselContent {
  itemLabel: string;
  mediaSource: string;
  mediaRights: string;
}

export interface BusinessSolutionsContent {
  heading: string;
  introduction: string;
  items: BusinessSolutionItem[];
}
