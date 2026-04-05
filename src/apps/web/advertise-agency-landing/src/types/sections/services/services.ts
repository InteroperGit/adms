import data from '@data/sections/services/services.json';
import { z } from 'zod';

/**
 * @module sections/services/services
 * @description Services offered by the agency with icons and descriptions.
 */

/**
 * @description Single service offering with icon and description
 */
export const ServiceSchema = z.object({
  /** URL-friendly slug for the service article */
  slug: z.string(),
  /** Lucide icon key (resolved via ICON_MAP) */
  icon: z.string(),
  /** Service name/title */
  title: z.string(),
  /** Service description */
  description: z.string(),
});

export type Service = z.infer<typeof ServiceSchema>;

/**
 * @description Array of services
 */
export const ServicesSchema = z.array(ServiceSchema);

/**
 * @description Parsed services from JSON data
 */
export const services = ServicesSchema.parse(data);
