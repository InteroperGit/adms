import raw from '@data/sections/services/servicesContent.json';
import { z } from 'zod';

/**
 * @module sections/services/servicesContent
 * @description Services section header and intro text.
 */

/**
 * @description Services section header with title and description
 */
export const ServicesSectionContentSchema = z.object({
  /** Section label (e.g., "Services") */
  label: z.string(),
  /** Main section title */
  title: z.string(),
  /** Section description/intro text */
  description: z.string(),
});

export type ServicesSectionContent = z.infer<typeof ServicesSectionContentSchema>;

/**
 * @description Parsed services section content from JSON data
 */
export const servicesSectionContent = ServicesSectionContentSchema.parse(raw);
