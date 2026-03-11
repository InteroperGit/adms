import raw from '@data/sections/aboutContent.json';
import { z } from 'zod';

export const AboutSectionContentSchema = z.object({
  label: z.string(),
  title: z.string(),
  titleHighlight: z.string(),
  text: z.array(z.string()),
  card: z.object({
    tagline: z.string(),
    stats: z.array(z.object({ label: z.string(), value: z.string() })),
    nps: z.object({ label: z.string(), value: z.string() }),
  }),
});

export type AboutSectionContent = z.infer<typeof AboutSectionContentSchema>;

export const aboutContent = AboutSectionContentSchema.parse(raw);
