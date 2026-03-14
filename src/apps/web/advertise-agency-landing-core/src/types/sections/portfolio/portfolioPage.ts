import raw from '@data/sections/portfolio/portfolioPage.json';
import { z } from 'zod';

export const PortfolioPageContentSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
});

export type PortfolioPageContent = z.infer<typeof PortfolioPageContentSchema>;

export const portfolioPageContent = PortfolioPageContentSchema.parse(raw);
