import { z } from 'zod';

/**
 * @module blocks/blockColor
 * @description Color styling for content blocks (metrics, cards, charts)
 */

export const BlockColorSchema = z.object({
  /** Color type: solid hex, Tailwind gradient, or semantic (primary/accent) */
  type: z.enum(['solid', 'gradient', 'primary', 'accent']),
  /** Tailwind gradient stops for type 'gradient'; falls back to hero.gradient when omitted. */
  value: z.string().optional(),
});

export type BlockColor = z.infer<typeof BlockColorSchema>;
