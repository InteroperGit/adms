import { z } from 'zod';
import notFoundJson from '@data/config/notFound.json';

export const NotFoundContentSchema = z.object({
  title: z.string(),
  code: z.string(),
  description: z.string(),
  backLabel: z.string(),
  backHref: z.string(),
});

export type NotFoundContent = z.infer<typeof NotFoundContentSchema>;

export const notFoundContent = NotFoundContentSchema.parse(notFoundJson);
