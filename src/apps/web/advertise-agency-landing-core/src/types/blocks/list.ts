import { z } from 'zod';

/**
 * @module blocks/list
 * @description Bulleted, numbered, or checklist block with optional striped row backgrounds
 */

export const ListBlockSchema = z.object({
  __component: z.literal('list'),
  /** List style: ul, ol, or checkmarks */
  style: z.enum(['ordered', 'unordered', 'checklist']),
  /** Array of list items */
  items: z.array(z.string()),
  /** Optional striped row colors with background and text for even/odd rows */
  colors: z
    .object({
      /** Colors for even rows */
      even: z
        .object({
          /** Background color: hex (#f3f4f6, #fef3c7), semantic token (primary, accent, background), or token/opacity (primary/50) */
          background: z.string().optional(),
          /** Text color: hex (#1f2937, #7c3aed), semantic token (foreground, primary-foreground), or token/opacity (accent/80) */
          text: z.string().optional(),
        })
        .optional(),
      /** Colors for odd rows */
      odd: z
        .object({
          /** Background color: hex (#ffffff, #fef08a), semantic token (card, muted), or token/opacity (background/30) */
          background: z.string().optional(),
          /** Text color: hex (#1f2937, #7c3aed), semantic token (muted-foreground, accent-foreground), or token/opacity (foreground/70) */
          text: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type ListBlock = z.infer<typeof ListBlockSchema>;
