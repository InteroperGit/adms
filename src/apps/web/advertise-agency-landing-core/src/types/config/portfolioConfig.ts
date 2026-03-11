import raw from '@data/config/portfolio.json';
import { z } from 'zod';

const CtaLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const PortfolioConfigSchema = z.object({
  perPage: z.number(),
  allLabel: z.string(),
  prevLabel: z.string(),
  nextLabel: z.string(),
  pageLabel: z.string(), // template: "{current}" and "{total}" replaced at runtime
  emptyLabel: z.string(),
  cta: CtaLinkSchema,
});

export type PortfolioConfig = z.infer<typeof PortfolioConfigSchema>;

export const portfolioConfig = PortfolioConfigSchema.parse(raw);
