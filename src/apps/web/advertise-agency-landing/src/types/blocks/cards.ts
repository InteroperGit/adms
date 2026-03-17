import { z } from 'zod';
import { BlockColorSchema } from './blockColor';

/**
 * @module blocks/cards
 * @description Grid of content cards
 */

export const CardsBlockSchema = z.object({
  __component: z.literal('cards'),
  /** Optional block title */
  title: z.string().optional(),
  /** Number of columns (defaults to 3) */
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  /** Array of cards with title and description */
  items: z.array(z.object({ title: z.string(), description: z.string() })),
  /** Optional background color styling */
  color: BlockColorSchema.optional(),
});

export type CardsBlock = z.infer<typeof CardsBlockSchema>;
