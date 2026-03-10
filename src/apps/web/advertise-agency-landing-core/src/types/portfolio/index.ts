import raw from '@data/sections/portfolioSection.json';
import type { ContentBlock } from './blocks';

export interface CtaLink {
  label: string;
  href: string;
}

export interface PortfolioSectionContent {
  label: string;
  title: string;
  description: string;
  allCategory: string;
  detailsLabel: string;
  cta: CtaLink;
}

export const portfolioSectionContent = raw satisfies PortfolioSectionContent;

export interface GalleryImage {
  src: string;
  description?: string;
}

export interface PortfolioCase {
  slug: string;
  title: string;
  category: string;
  description: string;
  hero: { image?: string; gradient: string };
  tags: string[];
  meta: { title: string; description: string; ogUrl?: string; ogImage?: string };
  overview: { client: string; year: string; services: string };
  content: ContentBlock[];
  images?: { preview?: string; og?: string };
}
