import raw from '@data/sections/advantages/advantagesContent.json';
import { z } from 'zod';

export const AdvantagesSectionContentSchema = z.object({
  label: z.string(),
  title: z.string(),
  titleHighlight: z.string(),
  description: z.string(),
});

export type AdvantagesSectionContent = z.infer<typeof AdvantagesSectionContentSchema>;

export const advantagesContent = AdvantagesSectionContentSchema.parse(raw);
