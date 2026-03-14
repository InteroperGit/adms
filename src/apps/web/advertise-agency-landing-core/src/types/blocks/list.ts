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
          /** Background color (hex color, e.g., "#f3f4f6", "#fef3c7") */
          background: z.string().optional(),
          /** Text color (hex color, e.g., "#1f2937", "#7c3aed") */
          text: z.string().optional(),
        })
        .optional(),
      /** Colors for odd rows */
      odd: z
        .object({
          /** Background color (hex color, e.g., "#ffffff", "#fef08a") */
          background: z.string().optional(),
          /** Text color (hex color, e.g., "#1f2937", "#7c3aed") */
          text: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type ListBlock = z.infer<typeof ListBlockSchema>;
