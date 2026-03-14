import { z } from 'zod';

/**
 * @module blocks/paragraph
 * @description Text paragraph block
 */

export const ParagraphBlockSchema = z.object({
  __component: z.literal('paragraph'),
  /** Paragraph content */
  text: z.string(),
  /** Text alignment (defaults to left) */
  align: z.enum(['left', 'center']).optional(),
});

export type ParagraphBlock = z.infer<typeof ParagraphBlockSchema>;
