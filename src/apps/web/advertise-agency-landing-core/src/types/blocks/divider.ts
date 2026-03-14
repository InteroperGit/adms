import { z } from 'zod';

/**
 * @module blocks/divider
 * @description Visual divider between content sections
 */

export const DividerBlockSchema = z.object({
  __component: z.literal('divider'),
  /** Visual style (line, decorative dots, or whitespace) */
  style: z.enum(['line', 'dots', 'space']).optional(),
});

export type DividerBlock = z.infer<typeof DividerBlockSchema>;
