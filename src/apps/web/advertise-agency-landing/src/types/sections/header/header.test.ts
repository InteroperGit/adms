import { describe, it, expect } from 'vitest';
import { HeaderContentSchema } from '../header/header';

const mockHeaderContent = {
  lang: 'en',
  logo: {
    href: '/',
    src: '/images/logo.svg',
  },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
  ],
  navCta: 'Get a Quote',
  openMenuLabel: 'Open Menu',
  closeMenuLabel: 'Close Menu',
};

const invalidHeaderContent = {
  lang: 'en',
  logo: {
    href: '/',
    src: 123, // Invalid type
  },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
  ],
  navCta: 'Get a Quote',
  openMenuLabel: 'Open Menu',
  closeMenuLabel: 'Close Menu',
};

describe('HeaderContentSchema', () => {
  it('parses without errors', () => {
    expect(() => HeaderContentSchema.parse(mockHeaderContent)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => HeaderContentSchema.parse(invalidHeaderContent)).toThrow();
  });
});
