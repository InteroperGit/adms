import { z } from 'zod';
import { BlockColorSchema } from './blockColor';

/**
 * @module blocks/orderForm
 * @description Embedded order form block for case page CTAs
 */

export const OrderFormBlockSchema = z.object({
  __component: z.literal('order-form'),
  /** ID of the form to embed (matches orderForms.json) */
  formId: z.string(),
  /** Optional form title/header */
  title: z.string().optional(),
  /** Optional background color styling */
  color: BlockColorSchema.optional(),
});

export type OrderFormBlock = z.infer<typeof OrderFormBlockSchema>;
