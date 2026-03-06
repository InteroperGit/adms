import raw from '@data/sections/hero.json';

export interface CtaLink {
  label: string;
  href: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  cta: CtaLink[];
  stats: Array<{ value: string; label: string }>;
}

export const heroContent = raw satisfies HeroContent;
