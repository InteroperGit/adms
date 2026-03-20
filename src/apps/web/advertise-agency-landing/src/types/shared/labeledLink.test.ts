import { z } from 'zod';
import { LabeledLinkSchema } from './labeledLink';

describe('LabeledLinkSchema', () => {
  it('should validate a correct LabeledLink object', () => {
    const validLink = {
      label: 'Home',
      href: '/',
    };
    expect(() => LabeledLinkSchema.parse(validLink)).not.toThrow();
  });

  it('should throw an error for a missing label', () => {
    const invalidLink = {
      href: '/',
    };
    expect(() => LabeledLinkSchema.parse(invalidLink)).toThrow(z.ZodError);
  });

  it('should throw an error for a missing href', () => {
    const invalidLink = {
      label: 'About',
    };
    expect(() => LabeledLinkSchema.parse(invalidLink)).toThrow(z.ZodError);
  });

  it('should throw an error for an invalid label type', () => {
    const invalidLink = {
      label: 123,
      href: '/contact',
    };
    expect(() => LabeledLinkSchema.parse(invalidLink)).toThrow(z.ZodError);
  });

  it('should throw an error for an invalid href type', () => {
    const invalidLink = {
      label: 'Services',
      href: null,
    };
    expect(() => LabeledLinkSchema.parse(invalidLink)).toThrow(z.ZodError);
  });
});
