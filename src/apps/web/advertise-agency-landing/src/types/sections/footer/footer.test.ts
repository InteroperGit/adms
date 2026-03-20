import { describe, it, expect } from 'vitest';
import { FooterContentSchema } from '../footer/footer';

const mockFooterContent = {
  description: 'A creative agency dedicated to your success.',
  navTitle: 'Navigation',
  servicesTitle: 'Services',
  contactsTitle: 'Contacts',
  copyright: '© 2023 Advertize Agency. All rights reserved.',
  tagline: 'Your Vision, Our Expertise.',
  legalLinks: [
    { label: 'Privacy Policy', href: '/legal/privacy-policy' },
    { label: 'Terms of Service', href: '/legal/terms-of-service' },
  ],
};


const invalidFooterContent = {
  description: 123, // Invalid type
  navTitle: 'Navigation',
  servicesTitle: 'Services',
  contactsTitle: 'Contacts',
  copyright: '© 2023 Advertize Agency. All rights reserved.',
  tagline: 'Your Vision, Our Expertise.',
  legalLinks: [
    { label: 'Privacy Policy', href: '/legal/privacy-policy' },
    { label: 'Terms of Service', href: '/legal/terms-of-service' },
  ],
};

describe('FooterContentSchema', () => {
  it('parses without errors', () => {
    expect(() => FooterContentSchema.parse(mockFooterContent)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => FooterContentSchema.parse(invalidFooterContent)).toThrow();
  });
});
