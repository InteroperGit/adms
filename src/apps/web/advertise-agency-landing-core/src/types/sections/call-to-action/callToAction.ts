import raw from '@data/sections/call-to-action/callToAction.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export type { LabeledLink } from '@/types/shared/labeledLink';

/**
 * @module sections/call-to-action/callToAction
 * @description Call-to-action section with title, subtitle, and CTA buttons.
 */

/**
 * @description Call-to-action section with heading and button links
 */
export const CallToActionContentSchema = z.object({
  /** Section headline */
  title: z.string(),
  /** Section subheading/description */
  subtitle: z.string(),
  /** Array of CTA button links */
  cta: z.array(LabeledLinkSchema),
});

export type CallToActionContent = z.infer<typeof CallToActionContentSchema>;

/**
 * @description Parsed call-to-action content from JSON data
 */
export const callToActionContent = CallToActionContentSchema.parse(raw);
