import data from '@data/sections/about/aboutValues.json';
import { z } from 'zod';

/**
 * @module sections/about/aboutValues
 * @description Company core values (integrity, innovation, etc.) with descriptions.
 */

/**
 * @description Company value statement with title and description
 */
export const AboutValueSchema = z.object({
  /** Value title (e.g., "Integrity", "Innovation") */
  title: z.string(),
  /** Value description/explanation */
  description: z.string(),
});

export type AboutValue = z.infer<typeof AboutValueSchema>;

/**
 * @description Array of company values
 */
export const AboutValuesSchema = z.array(AboutValueSchema);

/**
 * @description Parsed company values from JSON data
 */
export const aboutValues = AboutValuesSchema.parse(data);
