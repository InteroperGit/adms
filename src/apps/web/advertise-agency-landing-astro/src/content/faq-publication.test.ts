// Section approval and each answer approval are independent publication gates.
import { expect, it } from 'vitest';
import { buildContract } from '../../tests/helpers/fixtures';
import { faqSchema } from '../validation/faq';
import { getPublishedFaqItems, getVisibleFaqItems } from './faq-publication';

const approval = {
  state: 'approved' as const, source: 'Evidence', approvedBy: 'Reviewer',
};

it('requires approved section and answers with nonblank evidence', () => {
  const content = faqSchema.parse(buildContract('faq'));
  content.items[0].approval = approval;
  expect(getPublishedFaqItems(content)).toEqual([]);
  content.approval = approval;
  const item = content.items[0];
  content.items = [item, ...[
    { ...approval, state: 'draft' as const },
    { ...approval, source: null }, { ...approval, source: ' ' },
    { ...approval, approvedBy: null }, { ...approval, approvedBy: ' ' },
  ].map(value => ({ ...item, approval: value }))];
  expect(getPublishedFaqItems(content)).toEqual([item]);
  expect(getVisibleFaqItems(content)).toEqual([item]);
  content.demoMode = true;
  expect(getVisibleFaqItems(content)).toBe(content.items);
  expect(content.items[1].approval.state).toBe('draft');
  content.items = [];
  expect(getPublishedFaqItems(content)).toEqual([]);
  expect(getVisibleFaqItems(content)).toEqual([]);
});
