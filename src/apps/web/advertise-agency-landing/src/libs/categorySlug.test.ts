import { describe, it, expect } from 'vitest';
import { categorySlug } from './categorySlug';

describe('categorySlug()', () => {
  it('should return the correct slug for a known category', () => {
    expect(categorySlug('Брендинг')).toBe('branding');
    expect(categorySlug('Наружная реклама')).toBe('outdoor');
    expect(categorySlug('Контекстная реклама')).toBe('contextual-ads');
  });

  it('should return "all" for an unknown category', () => {
    expect(categorySlug('Unknown')).toBe('all');
    expect(categorySlug('')).toBe('all');
  });

  it('should be case-sensitive', () => {
    expect(categorySlug('брендинг')).toBe('all');
  });
});
