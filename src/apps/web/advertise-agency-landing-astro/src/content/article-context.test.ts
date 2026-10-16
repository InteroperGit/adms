// Authored form references cannot override page-owned publication or category.
import { expect, it } from 'vitest';
import type { OrderFormBlock } from '../types/content-blocks';
import {
  type ArticleContext, getArticleFormRegistration,
} from './article-context';

const block: OrderFormBlock = {
  type: 'order-form', context: 'project', category: 'led-letters',
  formId: 'led-letters',
};
const owner: ArticleContext = {
  kind: 'project', projectId: 1, category: 'led-letters', published: true,
};

it('resolves approved project and service ownership', () => {
  expect(getArticleFormRegistration(block, owner)?.context).toBe('project');
  expect(getArticleFormRegistration({
    ...block, context: 'service', category: 'svetovye-bukvy',
    status: 'published',
  }, {
    kind: 'service', serviceId: 'svetovye-bukvy',
    category: 'svetovye-bukvy', published: true,
  })?.context).toBe('service');
});

it('rejects absent owners, unpublished pages and mismatched references', () => {
  expect(getArticleFormRegistration(block)).toBeUndefined();
  expect(getArticleFormRegistration(block, { ...owner, published: false }))
    .toBeUndefined();
  for (const change of [
    { status: 'draft' as const }, { status: 'demo' as const },
    { context: 'service' as const }, { category: 'unknown' },
    { formId: 'unknown' }, { formId: 'general-inquiry' },
  ]) {
    expect(getArticleFormRegistration({ ...block, ...change }, owner))
      .toBeUndefined();
  }
  expect(getArticleFormRegistration(block, { ...owner, category: null }))
    .toBeUndefined();
});
