import { z } from 'zod';
import { MetricsColorSchema } from './metricsColor';

/**
 * @module blocks/metrics
 * @description Key metrics display block (e.g., impressions, conversions, growth)
 */

export const MetricsBlockSchema = z.object({
  __component: z.literal('metrics'),
  /** Optional block title */
  title: z.string().optional(),
  /** Array of metrics with values and descriptions */
  items: z.array(z.object({ metric: z.string(), label: z.string(), description: z.string() })),
  /** Optional granular color styling (background, metric, label, description) */
  color: MetricsColorSchema.optional(),
});

export type MetricsBlock = z.infer<typeof MetricsBlockSchema>;
