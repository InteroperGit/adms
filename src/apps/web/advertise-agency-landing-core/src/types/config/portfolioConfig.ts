import raw from '@data/config/portfolio.json';

interface CtaLink {
  label: string;
  href: string;
}

export interface PortfolioConfig {
  perPage: number;
  allLabel: string;
  prevLabel: string;
  nextLabel: string;
  pageLabel: string; // template: "{current}" and "{total}" replaced at runtime
  emptyLabel: string;
  cta: CtaLink;
}

export const portfolioConfig = raw satisfies PortfolioConfig;
