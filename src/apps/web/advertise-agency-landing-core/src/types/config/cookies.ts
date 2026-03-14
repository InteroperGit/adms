import raw from '@data/config/cookies.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

/**
 * @module config/cookies
 * @description Cookie consent banner text, buttons, and links.
 */

/**
 * @description Cookie consent banner content and labels
 */
export const CookiesContentSchema = z.object({
  /** ARIA label for the banner container */
  ariaLabel: z.string(),
  /** Label for the close/dismiss button */
  closeLabel: z.string(),
  /** Banner title */
  title: z.string(),
  /** Cookie consent explanation text */
  text: z.string(),
  /** Link to privacy policy */
  privacyLink: LabeledLinkSchema,
  /** Label for "accept all cookies" button */
  acceptAll: z.string(),
  /** Label for "necessary only" button */
  necessaryOnly: z.string(),
});

/**
 * @description Parsed cookie consent banner configuration
 */
export type CookiesContent = z.infer<typeof CookiesContentSchema>;

/**
 * @description Exported cookies content constant parsed from data/config/cookies.json
 */
export const cookiesContent = CookiesContentSchema.parse(raw);
