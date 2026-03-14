import { z } from 'zod';

/**
 * @module blocks/heading
 * @description Heading block for case content sections
 */

export const HeadingBlockSchema = z.object({
  __component: z.literal('heading'),
  /** HTML heading level (h2, h3, or h4) */
  level: z.union([z.literal(2), z.literal(3), z.literal(4)]),
  /** Heading text */
  text: z.string(),
});

export type HeadingBlock = z.infer<typeof HeadingBlockSchema>;
