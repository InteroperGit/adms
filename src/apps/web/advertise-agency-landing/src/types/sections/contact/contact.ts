import raw from '@data/sections/contact/contact.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export type { LabeledLink } from '@/types/shared/labeledLink';

/**
 * @module sections/contact/contact
 * @description Contact section with contact form fields, direct contact info, and business hours.
 */

/**
 * @description Contact section with form, direct contact info, and business hours
 */
export const ContactContentSchema = z.object({
  /** Section label (e.g., "Contact") */
  label: z.string(),
  /** Main section title */
  title: z.string(),
  /** Section description/intro */
  description: z.string(),
  /** Form labels and placeholders */
  form: z.object({
    /** Name field (label and placeholder) */
    name: z.object({ label: z.string(), placeholder: z.string() }),
    /** Email/phone field (label and placeholder) */
    contact: z.object({ label: z.string(), placeholder: z.string() }),
    /** Message field (label and placeholder) */
    message: z.object({ label: z.string(), placeholder: z.string() }),
    /** Consent checkbox label text */
    consent: z.string(),
    /** Links in consent text (privacy, terms, etc.) */
    consentLinks: z.array(LabeledLinkSchema),
    /** Joiner text between consent links (e.g., "and") */
    consentJoiner: z.string(),
    /** Submit button label */
    submit: z.string(),
    /** Form footer disclaimer text */
    disclaimer: z.string(),
    /** Success message after form submission */
    success: z.object({ title: z.string(), text: z.string(), reset: z.string() }),
  }),
  /** "Direct contact" section heading */
  directTitle: z.string(),
  /** Labels for contact methods (phone, email, address) */
  contactLabels: z.object({ phone: z.string(), email: z.string(), address: z.string() }),
  /** "Follow us" or social links section heading */
  socialTitle: z.string(),
  /** "Business hours" section heading */
  hoursTitle: z.string(),
  /** Labels for weekdays, Saturday, Sunday */
  dayLabels: z.object({ weekdays: z.string(), saturday: z.string(), sunday: z.string() }),
  /** Iframe title attribute for embedded map (accessibility) */
  mapTitle: z.string(),
});

export type ContactContent = z.infer<typeof ContactContentSchema>;

/**
 * @description Parsed contact section content from JSON data
 */
export const contactContent = ContactContentSchema.parse(raw);
