import type { z } from 'astro/zod';
import type { offerSchema, offersSchema } from '@/content/schemas';

export type Offer = z.infer<typeof offerSchema>;
export type Offers = z.infer<typeof offersSchema>;
