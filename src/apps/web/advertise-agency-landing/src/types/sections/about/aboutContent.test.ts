import { describe, it, expect } from 'vitest';
import { AboutSectionContentSchema } from '../about/aboutContent';

const mockAboutContent = {
  label: 'About',
  title: 'About Us',
  titleHighlight: 'Us',
  text: ['Paragraph 1', 'Paragraph 2'],
  card: {
    tagline: 'Our Impact',
    stats: [{ label: 'Clients', value: '100+' }],
    nps: { label: 'NPS', value: '8.5' },
  },
};


const invalidAboutContent = {
  label: 'About',
  title: 123, // Invalid type
  titleHighlight: 'Us',
  text: ['Paragraph 1', 'Paragraph 2'],
  card: {
    tagline: 'Our Impact',
    stats: [{ label: 'Clients', value: '100+' }],
    nps: { label: 'NPS', value: '8.5' },
  },
};

describe('AboutSectionContentSchema', () => {
  it('parses without errors', () => {
    expect(() => AboutSectionContentSchema.parse(mockAboutContent)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => AboutSectionContentSchema.parse(invalidAboutContent)).toThrow();
  });
});
