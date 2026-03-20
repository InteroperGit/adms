import { describe, it, expect } from 'vitest';
import { ServicesSectionContentSchema } from '../services/servicesContent';

const mockServicesSectionContent = {
  label: 'What We Do',
  title: 'Our Services',
  description: 'What we offer.',
};


const invalidServicesSectionContent = {
  label: 'What We Do',
  title: 123, // Invalid type
  description: 'What we offer.',
};

describe('ServicesSectionContentSchema', () => {
  it('parses without errors', () => {
    expect(() => ServicesSectionContentSchema.parse(mockServicesSectionContent)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => ServicesSectionContentSchema.parse(invalidServicesSectionContent)).toThrow();
  });
});
