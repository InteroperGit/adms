import raw from '@data/sections/portfolio/portfolioCase.json';
import { z } from 'zod';

/**
 * @module portfolio/portfolioCaseContent
 * @description UI labels and copy for portfolio case detail pages (overview, sections, CTA, errors).
 */

/**
 * @description UI labels and copy for portfolio case detail pages
 */
export const PortfolioCaseContentSchema = z.object({
  /** Back navigation link label */
  backLabel: z.string(),
  /** Labels for case overview fields (client, category, year, services) */
  overviewLabels: z.object({
    client: z.string(),
    category: z.string(),
    year: z.string(),
    services: z.string(),
  }),
  /** Heading for challenge section */
  challengeTitle: z.string(),
  /** Heading for solution section */
  solutionTitle: z.string(),
  /** Heading for results section */
  resultsTitle: z.string(),
  /** Heading for image gallery section */
  galleryTitle: z.string(),
  /** Alt text for case photos */
  photoAlt: z.string(),
  /** CTA section copy (title, subtitle, button label) */
  cta: z.object({ title: z.string(), subtitle: z.string(), label: z.string() }),
  /** Not found page copy */
  notFound: z.object({ title: z.string(), back: z.string() }),
});

export type PortfolioCaseContent = z.infer<typeof PortfolioCaseContentSchema>;

/**
 * @description Parsed portfolio case page UI content
 */
export const portfolioCaseContent = PortfolioCaseContentSchema.parse(raw);
