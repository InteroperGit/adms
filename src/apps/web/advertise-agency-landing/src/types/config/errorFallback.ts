import { z } from 'zod';
import errorFallbackJson from '@data/config/errorFallback.json';

export const ErrorFallbackContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  resetLabel: z.string(),
});

export type ErrorFallbackContent = z.infer<typeof ErrorFallbackContentSchema>;

export const errorFallbackContent = ErrorFallbackContentSchema.parse(errorFallbackJson);
