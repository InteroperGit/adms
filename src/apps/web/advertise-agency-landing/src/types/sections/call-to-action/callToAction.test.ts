import { describe, it, expect } from 'vitest';
import { CallToActionContentSchema } from '../call-to-action/callToAction';

const mockCallToAction = {
  title: 'Ready to Start?',
  subtitle: 'Let\'s work together.',
  cta: [{ label: 'Contact Us', href: '/contact' }],
};


const invalidCallToAction = {
  title: 'Ready to Start?',
  subtitle: 123, // Invalid type
  cta: [{ label: 'Contact Us', href: '/contact' }],
};

describe('CallToActionContentSchema', () => {
  it('parses without errors', () => {
    expect(() => CallToActionContentSchema.parse(mockCallToAction)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => CallToActionContentSchema.parse(invalidCallToAction)).toThrow();
  });
});
