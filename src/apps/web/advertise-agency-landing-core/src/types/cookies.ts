import raw from '@data/config/cookies.json';

export interface CtaLink {
  label: string;
  href: string;
}

export interface CookiesContent {
  ariaLabel: string;
  closeLabel: string;
  title: string;
  text: string;
  privacyLink: CtaLink;
  acceptAll: string;
  necessaryOnly: string;
}

export const cookiesContent = raw satisfies CookiesContent;
