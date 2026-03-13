import raw from '@data/sections/footer.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export const FooterContentSchema = z.object({
  description: z.string(),
  navTitle: z.string(),
  servicesTitle: z.string(),
  contactsTitle: z.string(),
  copyright: z.string(),
  tagline: z.string(),
  legalLinks: z.array(LabeledLinkSchema),
});

export type FooterContent = z.infer<typeof FooterContentSchema>;

export const footerContent = FooterContentSchema.parse(raw);
