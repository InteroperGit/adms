import data from '@data/sections/advantages/advantages.json';
import { z } from 'zod';

export const AdvantageSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export type Advantage = z.infer<typeof AdvantageSchema>;

export const AdvantagesSchema = z.array(AdvantageSchema);

export const advantages = AdvantagesSchema.parse(data);
