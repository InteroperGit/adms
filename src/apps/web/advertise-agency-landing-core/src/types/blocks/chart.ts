import { z } from 'zod';
import { BlockColorSchema } from './blockColor';

/**
 * @module blocks/chart
 * @description Chart visualization block (bar, line, pie, etc.)
 */

export const ChartBlockSchema = z.object({
  __component: z.literal('chart'),
  /** Chart type to render */
  type: z.enum(['bar', 'horizontal-bar', 'progress', 'line', 'pie']),
  /** Optional chart title */
  title: z.string().optional(),
  /** Data points with labels and values */
  items: z.array(z.object({ label: z.string(), value: z.number(), suffix: z.string().optional() })),
  /** Optional background color styling */
  color: BlockColorSchema.optional(),
});

export type ChartBlock = z.infer<typeof ChartBlockSchema>;
