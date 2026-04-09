import { describe, it, expect } from 'vitest';
import { ServicesSchema } from '../services/services';

const mockServices = [
  { slug: 'branding', icon: 'Palette', title: 'Branding', description: 'Brand identity design.' },
];

const invalidServices = [
  { slug: 'branding', icon: 'Palette', title: 123, description: 'Brand identity design.' }, // Invalid type
];

describe('ServicesSchema', () => {
  it('parses without errors', () => {
    expect(() => ServicesSchema.parse(mockServices)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => ServicesSchema.parse(invalidServices)).toThrow();
  });
});
