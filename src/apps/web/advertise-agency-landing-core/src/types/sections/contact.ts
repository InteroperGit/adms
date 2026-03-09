import raw from '@data/sections/contact.json';

export interface CtaLink {
  label: string;
  href: string;
}

export interface ContactContent {
  label: string;
  title: string;
  description: string;
  form: {
    name: { label: string; placeholder: string };
    contact: { label: string; placeholder: string };
    message: { label: string; placeholder: string };
    consent: string;
    consentLinks: CtaLink[];
    consentJoiner: string;
    submit: string;
    disclaimer: string;
    success: { title: string; text: string; reset: string };
  };
  directTitle: string;
  contactLabels: { phone: string; email: string; address: string };
  socialTitle: string;
  hoursTitle: string;
  dayLabels: { weekdays: string; saturday: string; sunday: string };
}

export const contactContent = raw satisfies ContactContent;
