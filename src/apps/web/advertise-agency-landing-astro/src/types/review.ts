import type { z } from 'astro/zod';
import type { reviewSchema } from '@/content/schemas';

export type Review = z.infer<typeof reviewSchema>;
