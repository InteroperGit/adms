import raw from '@data/sections/portfolio-page.json';

export interface PortfolioPageContent {
  label: string;
  title: string;
  description: string;
}

export const portfolioPageContent = raw satisfies PortfolioPageContent;
