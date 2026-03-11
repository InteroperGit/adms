import data from '@data/sections/services.json';
import { z } from 'zod';

export const ServiceSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export type Service = z.infer<typeof ServiceSchema>;

export const ServicesSchema = z.array(ServiceSchema);

export const services = ServicesSchema.parse(data);
