import data from '@data/config/site.json';
import { z } from 'zod';

/**
 * @module config/siteData
 * @description Site metadata: name, description, contact info, working hours, integrations (Yandex Maps, Metrika).
 */

/**
 * @description Image optimization configuration for responsive images
 */
const ImageOptimizationSchema = z.object({
  widths: z.array(z.number()),
  quality: z.number(),
  format: z.string(),
});

/**
 * @description Image optimization settings including width breakpoints, quality level, and format
 */
export type ImageOptimizationConfig = z.infer<typeof ImageOptimizationSchema>;

/**
 * @description Root site configuration including company name, contact details, working hours, and integration IDs
 */
export const SiteDataSchema = z.object({
  /** Display name of the agency */
  name: z.string(),
  /** Short description of the site/agency */
  description: z.string(),
  /** Navigation label for home page link */
  homeLabel: z.string(),
  /** Yandex Maps organization ID for embedded maps */
  yandexMapsOrgId: z.string().optional(),
  /** URL to Yandex Maps location page */
  yandexMapUrl: z.string().optional(),
  /** Image optimization settings for responsive images */
  imageOptimization: ImageOptimizationSchema.optional(),
  /** Yandex Metrika counter ID for analytics */
  yandexMetrikaId: z.string().optional(),
  /** Contact information including phone, email, social links, and business hours */
  contact: z.object({
    /** Primary phone number */
    phone: z.string(),
    /** Primary email address */
    email: z.string(),
    /** Physical business address */
    address: z.string(),
    /** Telegram username or URL */
    telegram: z.string(),
    /** VK (VKontakte) profile URL */
    vk: z.string(),
    /** Operating hours */
    workingHours: z.object({
      /** Hours for weekdays (e.g., "9:00-18:00") */
      weekdays: z.string(),
      /** Hours for Saturday */
      saturday: z.string(),
      /** Hours for Sunday */
      sunday: z.string(),
    }),
  }),
});

/**
 * @description Parsed and validated site configuration
 */
export type SiteData = z.infer<typeof SiteDataSchema>;

/**
 * @description Exported site data constant parsed from data/config/site.json
 */
export const siteData = SiteDataSchema.parse(data);
