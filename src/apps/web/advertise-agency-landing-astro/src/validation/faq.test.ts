// Boundary tests for FAQ copy and approval rules.
import { expect, it } from 'vitest';
import fixture from '../../tests/fixtures/content/unit-contracts.json';
import { faqSchema } from './faq';

it('parses and joins the versioned FAQ fixture', () => {
  const value = faqSchema.parse(fixture.faq);
  expect(value.items[0].answer).toBe('TEST_ANSWER');
});

it('requires evidence for approved FAQ content', () => {
  const source = structuredClone(fixture.faq) as any;
  source.approval = { state: 'approved', source: null, approvedBy: null };
  expect(faqSchema.safeParse(source).success).toBe(false);
});

it('accepts approved FAQ content with complete evidence', () => {
  const source = structuredClone(fixture.faq) as any;
  const approval = { state: 'approved', source: 'Source', approvedBy: 'Name' };
  source.approval = approval;
  source.items[0].approval = approval;
  expect(faqSchema.safeParse(source).success).toBe(true);
});

it('rejects duplicate IDs, empty lists and unknown keys', () => {
  const source = structuredClone(fixture.faq);
  source.items.push({ ...source.items[0] });
  expect(faqSchema.safeParse(source).success).toBe(false);
  expect(faqSchema.safeParse({ ...fixture.faq, items: [] }).success)
    .toBe(false);
  expect(faqSchema.safeParse({ ...fixture.faq, extra: true }).success)
    .toBe(false);
});
