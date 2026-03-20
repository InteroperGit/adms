import { describe, it, expect } from 'vitest';
import { AdvantagesSchema } from '../advantages/advantages';

const mockAdvantages = [{ icon: 'Award', title: 'Quality', description: 'High quality work.' }];

const invalidAdvantages = [
  { icon: 'Award', title: 123, description: 'High quality work.' }, // Invalid type
];

describe('AdvantagesSchema', () => {
  it('parses without errors', () => {
    expect(() => AdvantagesSchema.parse(mockAdvantages)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => AdvantagesSchema.parse(invalidAdvantages)).toThrow();
  });
});
