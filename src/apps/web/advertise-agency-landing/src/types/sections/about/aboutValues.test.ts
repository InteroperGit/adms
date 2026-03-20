import { describe, it, expect } from 'vitest';
import { AboutValuesSchema } from '../about/aboutValues';

const mockAboutValues = [{ title: 'Innovation', description: 'Always new ideas.' }];

const invalidAboutValues = [
  { title: 'Innovation', description: 123 }, // Invalid type
];

describe('AboutValuesSchema', () => {
  it('parses without errors', () => {
    expect(() => AboutValuesSchema.parse(mockAboutValues)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => AboutValuesSchema.parse(invalidAboutValues)).toThrow();
  });
});
