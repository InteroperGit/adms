import raw from '@data/sections/footer/footer.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

/**
 * @module sections/footer/footer
 * @description Footer content with company description, navigation columns, and legal links.
 */

/**
 * @description Footer with company info, navigation links, and copyright
 */
export const FooterContentSchema = z.object({
  /** Brief company description */
  description: z.string(),
  /** "Navigation" column heading */
  navTitle: z.string(),
  /** "Services" column heading */
  servicesTitle: z.string(),
  /** "Contacts" column heading */
  contactsTitle: z.string(),
  /** Copyright text (e.g., "© 2024 Company") */
  copyright: z.string(),
  /** Company tagline/motto */
  tagline: z.string(),
  /** Links to legal pages (privacy, terms, etc.) */
  legalLinks: z.array(LabeledLinkSchema),
});

export type FooterContent = z.infer<typeof FooterContentSchema>;

/**
 * @description Parsed footer content from JSON data
 */
export const footerContent = FooterContentSchema.parse(raw);
