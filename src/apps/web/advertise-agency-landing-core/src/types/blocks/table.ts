import { z } from 'zod';

/**
 * @module blocks/table
 * @description Data table with optional footer row and cell highlighting
 */

export const TableBlockSchema = z.object({
  __component: z.literal('table'),
  /** Optional table title */
  title: z.string().optional(),
  /** Optional table caption */
  caption: z.string().optional(),
  /** Column headers */
  head: z.array(z.string()),
  /** Table rows (each row is array of cells) */
  rows: z.array(z.array(z.string())),
  /** Optional row indices to highlight (e.g., [0, 3]) */
  highlight: z.array(z.number()).optional(),
  /** Optional total/summary row (bottom) */
  total: z.array(z.string()).optional(),
});

export type TableBlock = z.infer<typeof TableBlockSchema>;
