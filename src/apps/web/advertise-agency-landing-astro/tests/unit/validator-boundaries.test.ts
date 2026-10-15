// @vitest-environment node
// Mutations target cross-field editorial constraints, not schema syntax.
import { expect, it } from 'vitest';
import fixtures from '../fixtures/content/unit-contracts.json';
import { businessSolutionsSchema } from
  '../../src/validation/business-solutions';
import { faqSchema } from '../../src/validation/faq';
import { orderingProcessSchema } from '../../src/validation/ordering-process';
import { productionAndGuaranteesSchema } from
  '../../src/validation/production-and-guarantees';
import { createPricingSchema } from '../../src/validation/pricing';
import { orderInquirySchema } from '../../src/validation/order-inquiry';
import { createServicesSchema } from '../../src/validation/services';
import { projectsSchema } from '../../src/validation/projects';
import { offersSchema } from '../../src/validation/offers';
import { mediaSource } from '../../src/validation/shared';
import {
  carouselItemSchema, carouselOptionsSchema, carouselPresentationSchema,
  carouselTextContrast, safeCarouselUrl,
} from '../../src/validation/image-carousel';

it('requires evidence for named customers and attribution for media', () => {
  const data = structuredClone(fixtures['business-solutions']);
  data.items[0].attribution = {
    customerName: 'Named' as never, evidence: null, projectId: null,
    href: null, media: [],
  };
  expect(businessSolutionsSchema.safeParse(data).success).toBe(false);
  Object.assign(data.items[0].attribution, { customerName: null,
    media: [{ src: '/a.png', alt: 'A', width: 1, height: 1,
      source: 'Fixture', rights: 'Fixture' }] });
  expect(businessSolutionsSchema.safeParse(data).success).toBe(false);
});

it('requires sources and approvers for approved FAQ and process copy', () => {
  const faq = structuredClone(fixtures.faq);
  faq.approval.state = 'approved';
  expect(faqSchema.safeParse(faq).success).toBe(false);
  Object.assign(faq.approval, { source: 'Fixture', approvedBy: 'Reviewer' });
  expect(faqSchema.safeParse(faq).success).toBe(true);
  const process = { ...fixtures['ordering-process'], copyApproved: true };
  expect(orderingProcessSchema.safeParse(process).success).toBe(false);
});

it('rejects contradictory production approvals and pending warranties', () => {
  const source = fixtures['production-and-guarantees'];
  for (const change of [
    { copyApproved: true }, { pendingInputs: [] },
    { copyApproved: true, approvalSource: 'Evidence', demoMode: true },
    { warrantyTerms: [{ ...source.warrantyTerms[0], approval: 'approved' }] },
  ]) expect(productionAndGuaranteesSchema.safeParse({ ...source, ...change })
    .success).toBe(false);
});

it('validates dates, ranges, approvals, demo assets and project links', () => {
  const source = fixtures.pricing;
  const schema = createPricingSchema(['/projects/1']);
  const item = source.items[0];
  const mutations = [
    { price: { ...item.price, context: 'historical' } },
    { price: { ...item.price, asOf: '2026-02-30' } },
    { price: { ...item.price, asOf: 'bad-date' } },
    { price: { type: 'range', min: 2, max: 1, currency: 'RUB',
      context: 'demo', asOf: null, conditions: 'Fixture' } },
    { approval: { ...item.approval, copy: true } },
    { href: '/projects/1' },
    { price: { ...item.price, context: 'current', asOf: '2026-10-15' },
      href: '/projects/999' },
  ];
  for (const change of mutations) {
    expect(schema.safeParse({ ...source, items: [{ ...item, ...change }] })
      .success).toBe(false);
  }
  for (const image of [null, item.image]) {
    expect(schema.safeParse({ ...source, demoMode: true,
      items: [{ ...item, image }] }).success).toBe(false);
  }
  expect(schema.safeParse({ ...source, copyApproved: true }).success)
    .toBe(false);
  expect(schema.safeParse({ ...source, items: [item, item] }).success)
    .toBe(false);
});

it.each(['/', '//host', '/bad#hash', '/bad path', '/bad\\path',
  'http://example.test', 'https://u:p@example.test', 'invalid'])
('rejects unsafe inquiry endpoint %s', endpoint => {
  expect(orderInquirySchema.safeParse({ ...fixtures['order-inquiry'],
    submission: { enabled: false, endpoint, timeoutMs: 1000 } }).success)
    .toBe(false);
});

it('requires consent and endpoint for enabled local/HTTPS delivery', () => {
  const source = fixtures['order-inquiry'];
  for (const endpoint of ['', '/api/inquiry', 'https://example.test/inquiry']) {
    const value = { ...source,
      submission: { enabled: true, endpoint, timeoutMs: 30000 },
      consent: { approved: true, label: 'Synthetic consent' } };
    expect(orderInquirySchema.safeParse(value).success).toBe(Boolean(endpoint));
    value.consent.approved = false;
    expect(orderInquirySchema.safeParse(value).success).toBe(false);
  }
});

it('checks demo services, article forms and public project content', () => {
  const source = fixtures.services;
  const schema = createServicesSchema(['/services/sample/']);
  for (const change of [{ href: undefined }, { image: null }]) {
    expect(schema.safeParse({ ...source, demoMode: true,
      items: [{ ...source.items[0], ...change }] }).success).toBe(false);
  }
  expect(schema.safeParse({ ...source,
    items: [source.items[0], source.items[0]] })
    .success).toBe(false);
  expect(projectsSchema.safeParse([{ ...fixtures.project, content: [] }])
    .success).toBe(false);
  expect(projectsSchema.safeParse([{ ...fixtures.project, status: 'draft',
    content: [] }]).success).toBe(true);
  const form = { type: 'order-form', formId: 'general-inquiry',
    context: 'project' };
  expect(projectsSchema.safeParse([{ ...fixtures.project,
    content: [form] }]).success).toBe(true);
  expect(projectsSchema.safeParse([{ ...fixtures.project,
    content: [{ ...form, context: 'service' }] }]).success).toBe(false);
  expect(projectsSchema.safeParse([{ ...fixtures.project,
    content: [{ ...form, category: 'other' }] }]).success).toBe(false);
  expect(projectsSchema.safeParse([
    { ...fixtures.project, status: 'published' },
  ])
    .success).toBe(false);
  const item = source.items[0];
  const invalidForms = [form,
    { ...form, context: 'service', category: 'other' }];
  for (const block of invalidForms) {
    expect(schema.safeParse({ ...source, items: [{ ...item,
      article: { ...item.article, content: [block] } }] }).success).toBe(false);
  }
  expect(schema.safeParse({ ...source, items: [{ ...item,
    article: { ...item.article, content: [
      { ...form, context: 'service' },
    ] } }] }).success).toBe(true);
  const approved = { ...source, copyApproved: true, items: [{ ...item,
    confirmed: true, copyApproved: true,
    image: { ...item.image, approved: true },
    article: { ...item.article, approved: true },
  }] };
  expect(schema.safeParse(approved).success).toBe(false);
});

it('defaults offer presentation and validates remote media protocols', () => {
  const offer = { ...fixtures.offers.items[0], presentation: undefined };
  expect(offersSchema.parse({ ...fixtures.offers, items: [offer] })
    .items[0].presentation.textColor).toBe('#ffffff');
  expect(mediaSource.safeParse('not-a-url').success).toBe(false);
  expect(mediaSource.safeParse('ftp://example.test/a').success).toBe(false);
});

it('applies carousel defaults, contrast and URL safety rules', () => {
  expect(carouselOptionsSchema.parse({}).intervalMs).toBe(7000);
  expect(carouselOptionsSchema.safeParse({ intervalMs: 4999 }).success)
    .toBe(false);
  expect(carouselTextContrast('#ffffff', 'dark')).toBe(21);
  expect(carouselTextContrast('#000000', 'light')).toBe(21);
  expect(carouselPresentationSchema.safeParse({ textColor: '#000000' })
    .success).toBe(false);
  expect(carouselPresentationSchema.safeParse({ textColor: '#zzzzzz' })
    .success).toBe(false);
  for (const value of ['//host', '/bad path', '/bad\\path', ' #a', '#',
    'javascript:alert(1)', 'https://u:p@example.test', 'https://[bad']) {
    expect(safeCarouselUrl(value, true)).toBe(false);
  }
  for (const value of ['/asset', '#a', 'https://example.test/a']) {
    expect(safeCarouselUrl(value, true)).toBe(true);
  }
  const item = { id: 1, image: '/a.png', imageAlt: '',
    imageWidth: 1, imageHeight: 1 };
  expect(carouselItemSchema.safeParse(item).success).toBe(true);
  expect(carouselItemSchema.safeParse({ ...item, href: '/a' }).success)
    .toBe(false);
});
