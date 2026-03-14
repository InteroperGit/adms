import raw from '@data/sections/hero.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export type { LabeledLink } from '@/types/shared/labeledLink';

export const HeroContentSchema = z.object({
  badge: z.string(),
  title: z.string(),
  titleHighlight: z.string(),
  subtitle: z.string(),
  cta: z.array(LabeledLinkSchema),
  stats: z.array(z.object({ value: z.string(), label: z.string() })),
});

export type HeroContent = z.infer<typeof HeroContentSchema>;

export const heroContent = HeroContentSchema.parse(raw);
