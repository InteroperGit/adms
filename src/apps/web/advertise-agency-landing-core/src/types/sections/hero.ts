import raw from '@data/sections/hero.json';
import { z } from 'zod';

const CtaLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export type CtaLink = z.infer<typeof CtaLinkSchema>;

export const HeroContentSchema = z.object({
  badge: z.string(),
  title: z.string(),
  titleHighlight: z.string(),
  subtitle: z.string(),
  cta: z.array(CtaLinkSchema),
  stats: z.array(z.object({ value: z.string(), label: z.string() })),
});

export type HeroContent = z.infer<typeof HeroContentSchema>;

export const heroContent = HeroContentSchema.parse(raw);
