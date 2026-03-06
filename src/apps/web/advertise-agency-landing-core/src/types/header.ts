import raw from '@data/header.json';

export interface CtaLink {
  label: string;
  href: string;
}

export interface HeaderContent {
  lang: string;
  logo: { letter: string; text: string };
  nav: CtaLink[];
  navCta: string;
}

export const headerContent = raw satisfies HeaderContent;
