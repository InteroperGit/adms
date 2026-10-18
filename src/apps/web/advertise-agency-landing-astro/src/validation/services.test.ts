// @vitest-environment node
// Service catalogs validate static destinations and article ownership.
import { expect, it } from 'vitest';
import fixtures from '../../tests/fixtures/content/unit-contracts.json';
import { expectContentContract } from '../../tests/helpers/content-contract';
import {
  createServiceRecordsSchema,
  createServicesSchema,
  servicesSchema,
} from './services';

const source = fixtures.services;
const item = source.items[0];
const schema = createServicesSchema(['/services/sample/']);
const withItem = (change: object) => ({
  ...source,
  items: [{ ...item, ...change }],
});
const approval = {
  source: 'Evidence',
  approvedBy: 'Reviewer',
  approvedAt: '2026-10-16',
};

it('enforces the service root contract', () => {
  expectContentContract(schema, source);
});

it('parses resolved and source catalogs with MDX or JSON articles', () => {
  expect(schema.parse(source)).toEqual(source);
  expect(servicesSchema.safeParse(withItem({ href: undefined })).success).toBe(
    true,
  );
  const records = createServiceRecordsSchema(['/services/sample/']);
  for (const article of [
    { format: 'mdx', entry: 'sample' },
    { format: 'json', reason: 'Fallback', ...item.article },
  ]) {
    expect(records.safeParse(withItem({ article })).success).toBe(true);
  }
});

it('rejects missing, unknown and malformed published destinations', () => {
  for (const href of [
    '/services/unknown/',
    '/services/sample',
    '/services/sample/?query=1',
    'https://example.test',
  ]) {
    expect(schema.safeParse(withItem({ href })).success).toBe(false);
  }
  expect(servicesSchema.safeParse(source).success).toBe(false);
  expect(schema.safeParse({ ...source, items: [item, item] }).success).toBe(
    false,
  );
  expect(schema.safeParse({ ...source, extra: true }).success).toBe(false);
});

it('requires demo images and detail links but permits text-only drafts', () => {
  expect(schema.safeParse({ ...source, demoMode: true }).success).toBe(true);
  for (const change of [{ image: null }, { href: undefined }]) {
    expect(
      schema.safeParse({ ...withItem(change), demoMode: true }).success,
    ).toBe(false);
    expect(schema.safeParse(withItem(change)).success).toBe(true);
  }
});

it('checks image focal boundaries, dimensions, media and unknown keys', () => {
  expect(
    schema.safeParse(
      withItem({
        image: { ...item.image, desktopFocalPoint: { x: 0, y: 100 } },
      }),
    ).success,
  ).toBe(true);
  for (const change of [
    { width: 0 },
    { height: 1.5 },
    { src: 'javascript:alert(1)' },
    { mobileFocalPoint: { x: -1, y: 101 } },
    { extra: true },
  ]) {
    expect(
      schema.safeParse(withItem({ image: { ...item.image, ...change } }))
        .success,
    ).toBe(false);
  }
});

it('requires approved blocks for approved service articles', () => {
  const approved = {
    ...source,
    copyApproved: true,
    items: [
      {
        ...item,
        confirmed: true,
        copyApproved: true,
        image: { ...item.image, approved: true },
        article: { ...item.article, approved: true },
      },
    ],
  };
  expect(schema.safeParse(approved).success).toBe(false);
  const service = approved.items[0];
  expect(
    schema.safeParse({
      ...approved,
      items: [
        {
          ...service,
          article: {
            ...service.article,
            content: [
              {
                type: 'paragraph',
                paragraphs: ['Approved'],
                provenance: approval,
              },
            ],
          },
        },
      ],
    }).success,
  ).toBe(true);
});

it('matches embedded forms to service context and category', () => {
  const form = {
    type: 'order-form',
    formId: 'general-inquiry',
    context: 'service',
    category: 'sample',
  };
  const article = (change: object) =>
    withItem({
      article: {
        ...item.article,
        content: [{ ...form, ...change }],
      },
    });
  expect(schema.safeParse(article({})).success).toBe(true);
  for (const change of [{ context: 'project' }, { category: 'other' }]) {
    expect(schema.safeParse(article(change)).success).toBe(false);
  }
});
