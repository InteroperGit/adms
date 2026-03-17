import raw from '@data/sections/header/header.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export type { LabeledLink } from '@/types/shared/labeledLink';

/**
 * @module sections/header/header
 * @description Navigation header with logo, navigation links, and CTA button.
 */

/**
 * @description Navigation header with logo, links, and CTA button
 */
export const HeaderContentSchema = z.object({
  /** Language code (e.g., "en", "ru") */
  lang: z.string(),
  /** Logo with href and image src */
  logo: z.object({ href: z.string(), src: z.string() }),
  /** Navigation links array */
  nav: z.array(LabeledLinkSchema),
  /** Main CTA button label */
  navCta: z.string(),
  /** Mobile menu open button label */
  openMenuLabel: z.string(),
  /** Mobile menu close button label */
  closeMenuLabel: z.string(),
});

export type HeaderContent = z.infer<typeof HeaderContentSchema>;

/**
 * @description Parsed header content from JSON data
 */
export const headerContent = HeaderContentSchema.parse(raw);
