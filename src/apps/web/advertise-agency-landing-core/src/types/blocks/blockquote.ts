import { z } from 'zod';

/**
 * @module blocks/blockquote
 * @description Blockquote blocks: referenced testimonials and inline quotes
 */

/**
 * @description Blockquote referencing a testimonial by ID
 */
export const BlockquoteRefSchema = z.object({
  __component: z.literal('blockquote'),
  /** ID of testimonial to embed */
  testimonialId: z.number(),
});

export type BlockquoteRefBlock = z.infer<typeof BlockquoteRefSchema>;

/**
 * @description Inline blockquote with direct text and attribution
 */
export const BlockquoteInlineSchema = z.object({
  __component: z.literal('blockquote'),
  /** Quote text */
  text: z.string(),
  /** Author name */
  author: z.string(),
  /** Optional author role/title */
  role: z.string().optional(),
  /** Optional author company */
  company: z.string().optional(),
});

export type BlockquoteInlineBlock = z.infer<typeof BlockquoteInlineSchema>;

/**
 * @description Blockquote union: either referenced testimonial or inline quote
 */
export const BlockquoteBlockSchema = z.union([BlockquoteRefSchema, BlockquoteInlineSchema]);

export type BlockquoteBlock = z.infer<typeof BlockquoteBlockSchema>;
