import raw from '@data/sections/contact.json';
import { z } from 'zod';
import { LabeledLinkSchema } from '@/types/shared/labeledLink';

export type { LabeledLink } from '@/types/shared/labeledLink';

export const ContactContentSchema = z.object({
  label: z.string(),
  title: z.string(),
  description: z.string(),
  form: z.object({
    name: z.object({ label: z.string(), placeholder: z.string() }),
    contact: z.object({ label: z.string(), placeholder: z.string() }),
    message: z.object({ label: z.string(), placeholder: z.string() }),
    consent: z.string(),
    consentLinks: z.array(LabeledLinkSchema),
    consentJoiner: z.string(),
    submit: z.string(),
    disclaimer: z.string(),
    success: z.object({ title: z.string(), text: z.string(), reset: z.string() }),
  }),
  directTitle: z.string(),
  contactLabels: z.object({ phone: z.string(), email: z.string(), address: z.string() }),
  socialTitle: z.string(),
  hoursTitle: z.string(),
  dayLabels: z.object({ weekdays: z.string(), saturday: z.string(), sunday: z.string() }),
});

export type ContactContent = z.infer<typeof ContactContentSchema>;

export const contactContent = ContactContentSchema.parse(raw);
