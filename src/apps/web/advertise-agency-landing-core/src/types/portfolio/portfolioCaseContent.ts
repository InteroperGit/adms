import raw from '@data/sections/portfolioCase.json';
import { z } from 'zod';

export const PortfolioCaseContentSchema = z.object({
  backLabel: z.string(),
  overviewLabels: z.object({
    client: z.string(),
    category: z.string(),
    year: z.string(),
    services: z.string(),
  }),
  challengeTitle: z.string(),
  solutionTitle: z.string(),
  resultsTitle: z.string(),
  galleryTitle: z.string(),
  photoAlt: z.string(),
  cta: z.object({ title: z.string(), subtitle: z.string(), label: z.string() }),
  notFound: z.object({ title: z.string(), back: z.string() }),
});

export type PortfolioCaseContent = z.infer<typeof PortfolioCaseContentSchema>;

export const portfolioCaseContent = PortfolioCaseContentSchema.parse(raw);
