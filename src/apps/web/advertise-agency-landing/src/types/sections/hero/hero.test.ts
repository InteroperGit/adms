import { describe, it, expect } from 'vitest';
import { HeroContentSchema } from '../hero/hero';

const mockHeroContent = {
  badge: 'Welcome',
  title: 'Hero Title',
  titleHighlight: 'Title',
  subtitle: 'Hero Description',
  cta: [{ label: 'Learn More', href: '/about' }],
  stats: [{ value: '100+', label: 'Clients' }],
};

const invalidHeroContent = {
  badge: 'Welcome',
  title: 123, // Invalid type
  titleHighlight: 'Title',
  subtitle: 'Hero Description',
  cta: [{ label: 'Learn More', href: '/about' }],
  stats: [{ value: '100+', label: 'Clients' }],
};

describe('HeroContentSchema', () => {
  it('parses without errors', () => {
    expect(() => HeroContentSchema.parse(mockHeroContent)).not.toThrow();
  });

  it('rejects invalid data', () => {
    expect(() => HeroContentSchema.parse(invalidHeroContent)).toThrow();
  });
});
