import raw from '@data/config/portfolio.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

/**
 * @module config/portfolioConfig
 * @description Portfolio listing page configuration: pagination, labels, CTA, empty state.
 */

/**
 * @description Portfolio page configuration including pagination, labels, and category settings
 */
export const PortfolioConfigSchema = z.object({
  /** Description shown under the section heading on the portfolio grid page */
  gridDescription: z.string(),
  /** Number of cases to display per page */
  perPage: z.number(),
  /** Label for "all cases" category (e.g., "Все") */
  allLabel: z.string(),
  /** Label for "view details" link on article cards */
  detailsLabel: z.string(),
  /** Label for previous page button */
  prevLabel: z.string(),
  /** Label for next page button */
  nextLabel: z.string(),
  /** Page info template; placeholders "{current}" and "{total}" replaced at runtime (e.g., "{current} из {total}") */
  pageLabel: z.string(),
  /** Label shown when no portfolio cases exist */
  emptyLabel: z.string(),
  /** Category name displayed when unknown category is accessed */
  notFoundCategory: z.string(),
  /** Navigation link text for "all projects" */
  allProjectsLink: z.string(),
  /** Call-to-action button after portfolio grid */
  cta: LabeledLinkSchema,
  /** Localised column headings for the PortfolioOverview metadata grid on case detail pages. */
  overviewLabels: z.object({
    client: z.string(),
    category: z.string(),
    year: z.string(),
    services: z.string(),
  }),
});

/**
 * @description Parsed and validated portfolio configuration
 */
export type PortfolioConfig = z.infer<typeof PortfolioConfigSchema>;

/**
 * @description Exported portfolio config constant parsed from data/config/portfolio.json
 */
export const portfolioConfig = PortfolioConfigSchema.parse(raw);
