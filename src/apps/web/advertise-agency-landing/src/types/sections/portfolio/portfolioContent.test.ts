// portfolioSection.test.ts
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { PortfolioSectionContentSchema, portfolioSectionContent } from './portfolioContent';

describe('PortfolioSectionContentSchema', () => {
  it('parses valid data', () => {
    const input = {
      label: 'Portfolio',
      title: 'Selected work',
      description: 'projects',
      allCategory: 'All cases',
      cta: {
        label: 'View portfolio',
        href: '/portfolio',
      },
    };

    const result = PortfolioSectionContentSchema.parse(input);

    expect(result).toEqual(input);
  });

  it('throws when required field is missing', () => {
    const input = {
      label: 'Portfolio',
      title: 'Selected work',
      description: 'projects',
      cta: {
        label: 'View portfolio',
        href: '/portfolio',
      },
    };

    expect(() => PortfolioSectionContentSchema.parse(input)).toThrow(z.ZodError);
  });

  it('throws when field has wrong type', () => {
    const input = {
      label: 'Portfolio',
      title: 'Selected work',
      description: 'projects',
      allCategory: 123,
      cta: {
        label: 'View portfolio',
        href: '/portfolio',
      },
    };

    expect(() => PortfolioSectionContentSchema.parse(input)).toThrow(z.ZodError);
  });
});

describe('portfolioSectionContent', () => {
  it('contains parsed portfolio section content', () => {
    expect(portfolioSectionContent).toMatchObject({
      label: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      allCategory: expect.any(String),
      cta: expect.objectContaining({
        label: expect.any(String),
        href: expect.any(String),
      }),
    });
  });
});
