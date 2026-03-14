import { z } from 'zod';

/**
 * @module blocks/list
 * @description Bulleted, numbered, or checklist block
 */

export const ListBlockSchema = z.object({
  __component: z.literal('list'),
  /** List style: ul, ol, or checkmarks */
  style: z.enum(['ordered', 'unordered', 'checklist']),
  /** Array of list items */
  items: z.array(z.string()),
});

export type ListBlock = z.infer<typeof ListBlockSchema>;
