import { describe, it, expect } from 'vitest';
import { normalizeOrderPayload } from '@src/senders/payloadNormalizer';

describe('normalizeOrderPayload', () => {
  it('extracts productType from the raw payload', () => {
    const result = normalizeOrderPayload({ productType: 'SEO', name: 'Alice' });
    expect(result.productType).toBe('SEO');
    expect(result.fields).toEqual({ name: 'Alice' });
  });

  it('formats true boolean fields as Yes', () => {
    const result = normalizeOrderPayload({ productType: 'SMM', isUrgent: true });
    expect(result.fields['isUrgent']).toBe('Yes');
  });

  it('formats false boolean fields as No', () => {
    const result = normalizeOrderPayload({ productType: 'SMM', hasContract: false });
    expect(result.fields['hasContract']).toBe('No');
  });

  it('coerces non-string non-boolean values to strings', () => {
    const result = normalizeOrderPayload({ productType: 'ADS', budget: 50000 });
    expect(result.fields['budget']).toBe('50000');
  });

  it('returns empty string for missing productType', () => {
    const result = normalizeOrderPayload({ name: 'Bob' });
    expect(result.productType).toBe('');
    expect(result.fields).toEqual({ name: 'Bob' });
  });

  it('returns empty fields when only productType is present', () => {
    const result = normalizeOrderPayload({ productType: 'SEO' });
    expect(result.productType).toBe('SEO');
    expect(result.fields).toEqual({});
  });

  it('handles an empty object', () => {
    const result = normalizeOrderPayload({});
    expect(result.productType).toBe('');
    expect(result.fields).toEqual({});
  });
});
