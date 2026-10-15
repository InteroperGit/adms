// @vitest-environment node
// Contract fixtures exercise build-time validation independently of content.
import { describe, expect, it } from 'vitest';
import type { z } from 'astro/zod';
import fixtures from '../fixtures/content/unit-contracts.json';
import { introductionSchema } from '../../src/validation/introduction';
import { offersSchema } from '../../src/validation/offers';
import { orderInquirySchema } from '../../src/validation/order-inquiry';
import { orderingProcessSchema } from '../../src/validation/ordering-process';
import { pricingSchema } from '../../src/validation/pricing';
import { productionAndGuaranteesSchema } from
  '../../src/validation/production-and-guarantees';
import { businessSolutionsSchema } from
  '../../src/validation/business-solutions';
import { createServicesSchema, createServiceRecordsSchema } from
  '../../src/validation/services';
import { reviewsSchema } from '../../src/validation/reviews';
import { faqSchema } from '../../src/validation/faq';
import { carouselContentSchema } from '../../src/validation/image-carousel';
import { projectCatalogSchema } from '../../src/validation/project-catalog';
import { projectsSchema, projectRecordsSchema } from
  '../../src/validation/projects';
import { parseContent } from '../../src/validation/parse-content';

const cases: Array<[string, z.ZodType, unknown]> = [
  ['intro', introductionSchema, fixtures.introduction],
  ['offers', offersSchema, fixtures.offers],
  ['inquiry', orderInquirySchema, fixtures['order-inquiry']],
  ['ordering', orderingProcessSchema, fixtures['ordering-process']],
  ['pricing', pricingSchema, fixtures.pricing],
  ['production', productionAndGuaranteesSchema,
    fixtures['production-and-guarantees']],
  ['solutions', businessSolutionsSchema, fixtures['business-solutions']],
  ['services', createServicesSchema(['/services/sample/']), fixtures.services],
  ['reviews', reviewsSchema, fixtures.reviews],
  ['faq', faqSchema, fixtures.faq],
  ['carousel', carouselContentSchema, fixtures['about-carousel']],
  ['catalog', projectCatalogSchema, fixtures['project-catalog']],
  ['projects', projectsSchema, [fixtures.project]],
];

describe.each(cases)('%s contract', (_name, schema, fixture) => {
  it('accepts the synthetic contract and rejects malformed types', () => {
    expect(schema.safeParse(fixture).success).toBe(true);
    for (const invalid of [null, true, 42, 'text']) {
      expect(schema.safeParse(invalid).success).toBe(false);
    }
  });

  it('rejects missing required keys and unknown fields', () => {
    const source = Array.isArray(fixture) ? fixture[0] : fixture;
    const record = source as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      const changed = { ...record };
      delete changed[key];
      // Defaults and explicitly optional metadata are part of the contract.
      const result = schema.safeParse(
        Array.isArray(fixture) ? [changed] : changed,
      );
      const optional = (_name === 'intro' && key === 'demoMode')
        || (_name === 'offers' && key === 'intervalMs')
        || (_name === 'projects' && key === 'category');
      expect(result.success, `missing ${key}`).toBe(optional);
    }
    const extra = { ...record, unexpected: true };
    expect(schema.safeParse(Array.isArray(fixture) ? [extra] : extra)
      .success).toBe(false);
  });
});

it('reports source and nested field paths in validation failures', () => {
  expect(parseContent(projectCatalogSchema, { pageSize: 1 }, 'fixture'))
    .toEqual({ pageSize: 1 });
  expect(() => parseContent(projectCatalogSchema, { pageSize: 0 }, 'fixture'))
    .toThrow(/fixture:[\s\S]*pageSize/);
});

it('validates deliberate MDX and JSON article references', () => {
  const project = { ...fixtures.project,
    article: { format: 'mdx', entry: 'a' } };
  const { content: _content, ...record } = project;
  expect(projectRecordsSchema.safeParse([record]).success).toBe(true);
  const service = structuredClone(fixtures.services);
  Object.assign(service.items[0], {
    article: { format: 'mdx', entry: 'sample' },
  });
  const schema = createServiceRecordsSchema(['/services/sample/']);
  expect(schema.safeParse(service).success).toBe(true);
  service.items[0].href = '/services/missing/';
  expect(schema.safeParse(service).success).toBe(false);
});

it('allows empty catalogs but rejects duplicate identifiers', () => {
  expect(projectsSchema.parse([])).toEqual([]);
  expect(reviewsSchema.parse([])).toEqual([]);
  expect(projectsSchema.safeParse([fixtures.project, fixtures.project])
    .success).toBe(false);
});
