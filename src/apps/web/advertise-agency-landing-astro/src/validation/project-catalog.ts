import { z } from 'astro/zod';

export const projectCatalogSchema = z.object({
  pageSize: z.number().int().positive(),
}).strict();
