import raw from '@data/sections/services/servicesContent.json';
import { z } from 'zod';

export const ServicesSectionContentSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
});

export type ServicesSectionContent = z.infer<typeof ServicesSectionContentSchema>;

export const servicesSectionContent = ServicesSectionContentSchema.parse(raw);
