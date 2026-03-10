import raw from '@data/sections/portfolioPage.json';

export interface PortfolioPageContent {
  label: string;
  title: string;
  description: string;
}

export const portfolioPageContent = raw satisfies PortfolioPageContent;
