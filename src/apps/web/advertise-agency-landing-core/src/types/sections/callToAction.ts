import raw from '@data/sections/callToAction.json';

export interface CtaLink {
  label: string;
  href: string;
}

export interface CallToActionContent {
  title: string;
  subtitle: string;
  cta: CtaLink[];
}

export const callToActionContent = raw satisfies CallToActionContent;
