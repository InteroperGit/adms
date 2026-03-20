import { describe, it, expect } from 'vitest';
import { AdvantagesSectionContentSchema } from '../advantages/advantagesContent';

const mockAdvantagesContent = {
  label: 'Why Us',
  title: 'Our Advantages',
  titleHighlight: 'Advantages',
  description: 'Why choose us?',
};


const invalidAdvantagesContent = {
  label: 'Why Us',
  title: 'Our Advantages',
  titleHighlight: 123, // Invalid type
  description: 'Why choose us?',
};

describe('AdvantagesSectionContentSchema', () => {
  it('parses without errors', () => {
    expect(() => AdvantagesSectionContentSchema.parse(mockAdvantagesContent)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => AdvantagesSectionContentSchema.parse(invalidAdvantagesContent)).toThrow();
  });
});
