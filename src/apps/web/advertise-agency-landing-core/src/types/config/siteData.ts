import data from '@data/config/site.json';
import { z } from 'zod';

const ImageOptimizationSchema = z.object({
  widths: z.array(z.number()),
  quality: z.number(),
  format: z.string(),
});

export type ImageOptimizationConfig = z.infer<typeof ImageOptimizationSchema>;

export const SiteDataSchema = z.object({
  name: z.string(),
  description: z.string(),
  yandexMapsOrgId: z.string().optional(),
  yandexMapUrl: z.string().optional(),
  imageOptimization: ImageOptimizationSchema.optional(),
  yandexMetrikaId: z.string().optional(),
  contact: z.object({
    phone: z.string(),
    email: z.string(),
    address: z.string(),
    telegram: z.string(),
    vk: z.string(),
    workingHours: z.object({
      weekdays: z.string(),
      saturday: z.string(),
      sunday: z.string(),
    }),
  }),
});

export type SiteData = z.infer<typeof SiteDataSchema>;

export const siteData = SiteDataSchema.parse(data);
