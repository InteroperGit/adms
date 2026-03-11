import raw from '@data/sections/header.json';
import { z } from 'zod';

const CtaLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export type CtaLink = z.infer<typeof CtaLinkSchema>;

export const HeaderContentSchema = z.object({
  lang: z.string(),
  logo: z.object({ letter: z.string(), text: z.string() }),
  nav: z.array(CtaLinkSchema),
  navCta: z.string(),
});

export type HeaderContent = z.infer<typeof HeaderContentSchema>;

export const headerContent = HeaderContentSchema.parse(raw);
