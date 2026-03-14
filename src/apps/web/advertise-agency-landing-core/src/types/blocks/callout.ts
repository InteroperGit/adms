import { z } from 'zod';

/**
 * @module blocks/callout
 * @description Highlighted callout/alert box with contextual styling
 */

export const CalloutBlockSchema = z.object({
  __component: z.literal('callout'),
  /** Semantic type for styling (info: blue, success: green, warning: orange, note: neutral) */
  type: z.enum(['info', 'success', 'warning', 'note']),
  /** Optional callout title */
  title: z.string().optional(),
  /** Callout message text */
  text: z.string(),
});

export type CalloutBlock = z.infer<typeof CalloutBlockSchema>;
