import raw from '@data/sections/hero/hero.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export type { LabeledLink } from '@/types/shared/labeledLink';

/**
 * @module sections/hero/hero
 * @description Hero section with headline, stats, and CTA buttons.
 */

/**
 * @description Hero section heading, stats, and call-to-action buttons
 */
export const HeroContentSchema = z.object({
  /** Badge/label above main title */
  badge: z.string(),
  /** Main headline text */
  title: z.string(),
  /** Text fragment to highlight in primary color */
  titleHighlight: z.string(),
  /** Subheading/description */
  subtitle: z.string(),
  /** Array of CTA buttons */
  cta: z.array(LabeledLinkSchema),
  /** Stats/metrics displayed in hero (value and label pairs) */
  stats: z.array(z.object({ value: z.string(), label: z.string() })),
});

export type HeroContent = z.infer<typeof HeroContentSchema>;

/**
 * @description Parsed hero section content from JSON data
 */
export const heroContent = HeroContentSchema.parse(raw);
