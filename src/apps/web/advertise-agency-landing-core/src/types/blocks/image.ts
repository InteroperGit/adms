import { z } from 'zod';

/**
 * @module blocks/image
 * @description Single image block
 */

export const ImageBlockSchema = z.object({
  __component: z.literal('image'),
  /** Image URL */
  src: z.string(),
  /** Alt text for accessibility */
  alt: z.string(),
  /** Optional image caption */
  caption: z.string().optional(),
  /** Display width (small: 50%, medium: 75%, full: 100%) */
  size: z.enum(['small', 'medium', 'full']).optional(),
});

export type ImageBlock = z.infer<typeof ImageBlockSchema>;
