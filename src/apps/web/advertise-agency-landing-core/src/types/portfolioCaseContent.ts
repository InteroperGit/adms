import raw from '@data/portfolio-case.json';

export interface PortfolioCaseContent {
  backLabel: string;
  overviewLabels: { client: string; category: string; year: string; services: string };
  challengeTitle: string;
  solutionTitle: string;
  resultsTitle: string;
  galleryTitle: string;
  photoAlt: string;
  cta: { title: string; subtitle: string; label: string };
  notFound: { title: string; back: string };
}

export const portfolioCaseContent = raw satisfies PortfolioCaseContent;
