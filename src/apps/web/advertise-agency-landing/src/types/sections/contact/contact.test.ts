import { describe, it, expect } from 'vitest';
import { ContactContentSchema } from '../contact/contact';

const mockContactContent = {
  label: 'Contact',
  title: 'Get in Touch',
  description: 'We\'d love to hear from you.',
  form: {
    name: { label: 'Your Name', placeholder: 'John Doe' },
    contact: { label: 'Your Email or Phone', placeholder: 'email@example.com' },
    message: { label: 'Your Message', placeholder: 'Tell us about your project...' },
    consent: 'I agree to the privacy policy',
    consentLinks: [{ label: 'Privacy Policy', href: '/legal/privacy-policy' }],
    consentJoiner: '',
    submit: 'Send Message',
    disclaimer: 'We will not share your information with third parties.',
    success: {
      title: 'Message Sent!',
      text: 'Thank you for contacting us. We will get back to you shortly.',
      reset: 'Send Another Message',
    },
  },
  directTitle: 'Direct Contact',
  contactLabels: { phone: 'Phone', email: 'Email', address: 'Address' },
  socialTitle: 'Follow Us',
  hoursTitle: 'Business Hours',
  dayLabels: { weekdays: 'Weekdays', saturday: 'Saturday', sunday: 'Sunday' },
  mapTitle: 'Our Location on Map',
};


const invalidContactContent = {
  label: 'Contact',
  title: 123, // Invalid type
  description: 'We\'d love to hear from you.',
  form: {
    name: { label: 'Your Name', placeholder: 'John Doe' },
    contact: { label: 'Your Email or Phone', placeholder: 'email@example.com' },
    message: { label: 'Your Message', placeholder: 'Tell us about your project...' },
    consent: 'I agree to the privacy policy',
    consentLinks: [{ label: 'Privacy Policy', href: '/legal/privacy-policy' }],
    consentJoiner: '',
    submit: 'Send Message',
    disclaimer: 'We will not share your information with third parties.',
    success: {
      title: 'Message Sent!',
      text: 'Thank you for contacting us. We will get back to you shortly.',
      reset: 'Send Another Message',
    },
  },
  directTitle: 'Direct Contact',
  contactLabels: { phone: 'Phone', email: 'Email', address: 'Address' },
  socialTitle: 'Follow Us',
  hoursTitle: 'Business Hours',
  dayLabels: { weekdays: 'Weekdays', saturday: 'Saturday', sunday: 'Sunday' },
  mapTitle: 'Our Location on Map',
};

describe('ContactContentSchema', () => {
  it('parses without errors', () => {
    expect(() => ContactContentSchema.parse(mockContactContent)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => ContactContentSchema.parse(invalidContactContent)).toThrow();
  });
});
