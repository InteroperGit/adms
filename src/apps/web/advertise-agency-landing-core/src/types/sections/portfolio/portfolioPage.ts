import raw from '@data/sections/portfolio/portfolioPage.json';
import { z } from 'zod';

/**
 * @module sections/portfolio/portfolioPage
 * @description Portfolio listing page header and intro text.
 */

/**
 * @description Portfolio page header with title and description
 */
export const PortfolioPageContentSchema = z.object({
  /** Page label (e.g., "Portfolio") */
  label: z.string(),
  /** Main page title */
  title: z.string(),
  /** Page description/intro */
  description: z.string(),
});

export type PortfolioPageContent = z.infer<typeof PortfolioPageContentSchema>;

/**
 * @description Parsed portfolio page content from JSON data
 */
export const portfolioPageContent = PortfolioPageContentSchema.parse(raw);
