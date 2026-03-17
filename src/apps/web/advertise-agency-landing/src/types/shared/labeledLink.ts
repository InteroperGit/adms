import { z } from 'zod';

/**
 * @description Zod schema for a link with label and href used across multiple content schemas.
 * Reusable pattern for navigation links, CTAs, and footer links.
 */
export const LabeledLinkSchema = z.object({
  /** Display text for the link */
  label: z.string(),
  /** Destination URL or path */
  href: z.string(),
});

/**
 * @description Link object with display label and destination URL.
 * Inferred from LabeledLinkSchema; used in header navigation, CTAs, footers, and more.
 */
export type LabeledLink = z.infer<typeof LabeledLinkSchema>;
