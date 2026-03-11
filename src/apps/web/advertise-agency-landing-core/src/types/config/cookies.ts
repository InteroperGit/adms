import raw from '@data/config/cookies.json';
import { z } from 'zod';

const CtaLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const CookiesContentSchema = z.object({
  ariaLabel: z.string(),
  closeLabel: z.string(),
  title: z.string(),
  text: z.string(),
  privacyLink: CtaLinkSchema,
  acceptAll: z.string(),
  necessaryOnly: z.string(),
});

export type CookiesContent = z.infer<typeof CookiesContentSchema>;

export const cookiesContent = CookiesContentSchema.parse(raw);
