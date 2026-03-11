import raw from '@data/sections/footer.json';
import { z } from 'zod';

const CtaLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export type CtaLink = z.infer<typeof CtaLinkSchema>;

export const FooterContentSchema = z.object({
  description: z.string(),
  navTitle: z.string(),
  servicesTitle: z.string(),
  contactsTitle: z.string(),
  copyright: z.string(),
  tagline: z.string(),
  legalLinks: z.array(CtaLinkSchema),
});

export type FooterContent = z.infer<typeof FooterContentSchema>;

export const footerContent = FooterContentSchema.parse(raw);
