import raw from '@data/sections/footer.json';

export interface CtaLink {
  label: string;
  href: string;
}

export interface FooterContent {
  description: string;
  navTitle: string;
  servicesTitle: string;
  contactsTitle: string;
  copyright: string;
  tagline: string;
  legalLinks: CtaLink[];
}

export const footerContent = raw satisfies FooterContent;
