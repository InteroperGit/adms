import raw from '@data/config/portfolio.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export const PortfolioConfigSchema = z.object({
  perPage: z.number(),
  allLabel: z.string(),
  prevLabel: z.string(),
  nextLabel: z.string(),
  pageLabel: z.string(), // template: "{current}" and "{total}" replaced at runtime
  emptyLabel: z.string(),
  notFoundCategory: z.string(),
  allProjectsLink: z.string(),
  cta: LabeledLinkSchema,
});

export type PortfolioConfig = z.infer<typeof PortfolioConfigSchema>;

export const portfolioConfig = PortfolioConfigSchema.parse(raw);
