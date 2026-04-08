import raw from '@data/config/pagination.json';
import { z } from 'zod';

export const PaginationConfigSchema = z.object({
  prevLabel: z.string(),
  nextLabel: z.string(),
  pageLabel: z.string(),
});

export type PaginationConfig = z.infer<typeof PaginationConfigSchema>;

export const paginationConfig = PaginationConfigSchema.parse(raw);
