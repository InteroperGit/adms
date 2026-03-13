import raw from '@data/config/cookies.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export const CookiesContentSchema = z.object({
  ariaLabel: z.string(),
  closeLabel: z.string(),
  title: z.string(),
  text: z.string(),
  privacyLink: LabeledLinkSchema,
  acceptAll: z.string(),
  necessaryOnly: z.string(),
});

export type CookiesContent = z.infer<typeof CookiesContentSchema>;

export const cookiesContent = CookiesContentSchema.parse(raw);
