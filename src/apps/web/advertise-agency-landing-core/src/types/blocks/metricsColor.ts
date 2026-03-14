import { z } from 'zod';

/**
 * @module blocks/metricsColor
 * @description Color styling for metrics blocks (background, metric values, labels, descriptions)
 */

export const MetricsBackgroundColorSchema = z.object({
  /** Color type: solid hex, Tailwind gradient, or semantic (primary/accent) */
  type: z.enum(['solid', 'gradient', 'primary', 'accent']),
  /** Tailwind gradient stops for type 'gradient'; falls back to hero.gradient when omitted. */
  value: z.string().optional(),
});

export type MetricsBackgroundColor = z.infer<typeof MetricsBackgroundColorSchema>;

/**
 * @description Granular color styling for metrics block (background, metric, label, description)
 */
export const MetricsColorSchema = z.object({
  /** Optional background color styling */
  background: MetricsBackgroundColorSchema.optional(),
  /** Optional color for metric value (big number); defaults to white if colored, primary if not */
  metric: z.string().optional(),
  /** Optional color for label (uppercase text); defaults to white/70 if colored, muted-foreground if not */
  label: z.string().optional(),
  /** Optional color for description text; defaults to white/80 if colored, muted-foreground if not */
  description: z.string().optional(),
});

export type MetricsColor = z.infer<typeof MetricsColorSchema>;
