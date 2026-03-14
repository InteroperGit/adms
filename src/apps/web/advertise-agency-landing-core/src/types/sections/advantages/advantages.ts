import data from '@data/sections/advantages/advantages.json';
import { z } from 'zod';

/**
 * @module sections/advantages/advantages
 * @description Competitive advantages (why choose us) with icons and descriptions.
 */

/**
 * @description Single competitive advantage with icon and description
 */
export const AdvantageSchema = z.object({
  /** Lucide icon key (resolved via ICON_MAP) */
  icon: z.string(),
  /** Advantage title */
  title: z.string(),
  /** Advantage description */
  description: z.string(),
});

export type Advantage = z.infer<typeof AdvantageSchema>;

/**
 * @description Array of competitive advantages
 */
export const AdvantagesSchema = z.array(AdvantageSchema);

/**
 * @description Parsed advantages from JSON data
 */
export const advantages = AdvantagesSchema.parse(data);
