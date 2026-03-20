import { describe, it, expect } from 'vitest';
import { PortfolioPageContentSchema } from '../portfolio/portfolioPage';

const mockPortfolioPageContent = {
  label: 'Our Work',
  title: 'Portfolio',
  description: 'Our latest projects.',
};


const invalidPortfolioPageContent = {
  label: 'Our Work',
  title: 123, // Invalid type
  description: 'Our latest projects.',
};

describe('PortfolioPageContentSchema', () => {
  it('parses without errors', () => {
    expect(() => PortfolioPageContentSchema.parse(mockPortfolioPageContent)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => PortfolioPageContentSchema.parse(invalidPortfolioPageContent)).toThrow();
  });
});
