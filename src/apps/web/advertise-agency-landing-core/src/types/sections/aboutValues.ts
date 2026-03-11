import data from '@data/sections/aboutValues.json';
import { z } from 'zod';

export const AboutValueSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export type AboutValue = z.infer<typeof AboutValueSchema>;

export const AboutValuesSchema = z.array(AboutValueSchema);

export const aboutValues = AboutValuesSchema.parse(data);
