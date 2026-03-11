import raw from '@data/sections/callToAction.json';
import { z } from 'zod';

const CtaLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export type CtaLink = z.infer<typeof CtaLinkSchema>;

export const CallToActionContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  cta: z.array(CtaLinkSchema),
});

export type CallToActionContent = z.infer<typeof CallToActionContentSchema>;

export const callToActionContent = CallToActionContentSchema.parse(raw);
