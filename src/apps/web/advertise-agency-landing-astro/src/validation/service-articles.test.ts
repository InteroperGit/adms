// Boundary tests for MDX and JSON service article sources.
import { expect, it } from 'vitest';
import fixture from '../../tests/fixtures/content/unit-contracts.json';
import { serviceArticleSourceSchema, serviceArticleSchema } from
  './service-articles';

it('parses valid article metadata and JSON fallback content', () => {
  const service = fixture.services.items[0];
  expect(serviceArticleSchema.parse(service.article).title).toBe('Sample');
  expect(serviceArticleSourceSchema.parse({
    format: 'json', ...service.article, reason: 'Fallback',
  }).format).toBe('json');
});

it('parses stable MDX entries and rejects malformed entry names', () => {
  expect(serviceArticleSourceSchema.parse({
    format: 'mdx', entry: 'sample-article',
  }).format).toBe('mdx');
  expect(serviceArticleSourceSchema.safeParse({
    format: 'mdx', entry: 'Bad Entry',
  }).success).toBe(false);
});

it('rejects empty content, unapproved copy and unknown metadata', () => {
  const service = fixture.services.items[0];
  expect(serviceArticleSchema.safeParse({
    ...service.article, content: [],
  }).success).toBe(false);
  expect(serviceArticleSchema.safeParse({
    ...service.article, approved: 'yes',
  }).success).toBe(false);
  expect(serviceArticleSourceSchema.safeParse({
    format: 'json', ...service.article, reason: 'Fallback', extra: true,
  }).success).toBe(false);
});
