// Boundary tests for business solution copy and attribution evidence.
import { expect, it } from 'vitest';
import fixture from '../../tests/fixtures/content/unit-contracts.json';
import { businessSolutionsSchema } from './business-solutions';

it('parses four versioned solution items and normalizes copy', () => {
  const value = businessSolutionsSchema.parse(fixture['business-solutions']);
  expect(value.items).toHaveLength(4);
  expect(value.items[0].summary).toBe('TEST_SUMMARY');
});

it('requires evidence for named attribution and media', () => {
  const source = structuredClone(fixture['business-solutions']) as any;
  source.items[0].attribution.customerName = 'Customer';
  source.items[0].attribution.evidence = null;
  expect(businessSolutionsSchema.safeParse(source).success).toBe(false);
  source.items[0].attribution.evidence = 'Evidence';
  source.items[0].attribution.media = [{
    src: '/image.png', alt: 'Image', width: 1, height: 1,
    source: 'Source', rights: 'Rights',
  }];
  source.items[0].attribution.customerName = null;
  expect(businessSolutionsSchema.safeParse(source).success).toBe(false);
});

it('rejects wrong item counts, IDs and unsafe project links', () => {
  const source = structuredClone(fixture['business-solutions']) as any;
  source.items.pop();
  expect(businessSolutionsSchema.safeParse(source).success).toBe(false);
  const invalid = structuredClone(fixture['business-solutions']) as any;
  invalid.items[0].id = 'Bad ID';
  invalid.items[0].attribution.href = 'https://example.test/project';
  expect(businessSolutionsSchema.safeParse(invalid).success).toBe(false);
});
