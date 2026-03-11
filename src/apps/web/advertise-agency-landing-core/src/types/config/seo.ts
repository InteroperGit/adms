import data from '@data/config/seo.json';
import { z } from 'zod';

export const SeoConfigSchema = z.object({
  siteUrl: z.string(),
  siteName: z.string(),
  locale: z.string(),
  twitterCard: z.string(),
  defaultOgImage: z.string(),
});

export type SeoConfig = z.infer<typeof SeoConfigSchema>;

export const seoConfig = SeoConfigSchema.parse(data);
