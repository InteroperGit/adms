// Project source records and resolved articles share metadata constraints.
import { expect, it } from 'vitest';
import fixtures from '../../tests/fixtures/content/unit-contracts.json';
import {
  projectArticleMetadataSchema, projectArticleSourceSchema,
  projectMetadataSchema, projectRecordsSchema, projectSchema, projectsSchema,
} from './projects';

const { content, ...metadata } = fixtures.project;
const form = { type: 'order-form', formId: 'general-inquiry',
  context: 'project' };
const approval = { source: 'Evidence', approvedBy: 'Reviewer',
  approvedAt: '2026-10-16' };

it('parses metadata, resolved projects and article source exports', () => {
  expect(projectMetadataSchema.parse(metadata)).toEqual(metadata);
  expect(projectSchema.parse(fixtures.project)).toEqual(fixtures.project);
  expect(projectsSchema.parse([])).toEqual([]);
  expect(projectArticleMetadataSchema.parse({ projectId: 1 }))
    .toEqual({ projectId: 1 });
  for (const article of [
    { format: 'mdx', entry: 'sample' },
    { format: 'json', reason: 'Fallback', content },
  ]) {
    expect(projectArticleSourceSchema.parse(article)).toEqual(article);
    expect(projectRecordsSchema.parse([{ ...metadata, article }]))
      .toHaveLength(1);
  }
});

it('accepts optional category/date/evidence and approved published blocks',
  () => {
    expect(projectMetadataSchema.safeParse({
      ...metadata, category: null, date: '2026-10-16', evidence: {
        copy: approval, specifications: null, timing: null,
        outcome: null, attribution: null,
      },
    }).success).toBe(true);
    expect(projectSchema.safeParse({ ...metadata, status: 'published',
      content: [{ type: 'paragraph', paragraphs: ['Approved'],
        provenance: approval }],
    }).success).toBe(true);
  },
);

it('rejects unknown categories, dates, metadata and malformed sources', () => {
  for (const change of [
    { category: 'not-registered' }, { date: 'yesterday' },
    { id: 0 }, { extra: true }, { title: undefined },
  ]) {
    expect(projectMetadataSchema.safeParse({ ...metadata, ...change })
      .success).toBe(false);
  }
  for (const article of [
    { format: 'mdx', entry: '' }, { format: 'html', entry: 'sample' },
    { format: 'json', reason: '', content },
    { format: 'json', reason: 'Fallback', content, extra: true },
  ]) {
    expect(projectArticleSourceSchema.safeParse(article).success).toBe(false);
  }
  expect(projectArticleMetadataSchema.safeParse({ projectId: -1 }).success)
    .toBe(false);
});

it('rejects duplicate record IDs and duplicate resolved IDs', () => {
  expect(projectsSchema.safeParse([fixtures.project, fixtures.project])
    .success).toBe(false);
  const record = { ...metadata, article: { format: 'mdx', entry: 'sample' } };
  expect(projectRecordsSchema.safeParse([record, record]).success)
    .toBe(false);
});

it('requires visible content and publication evidence outside drafts', () => {
  expect(projectSchema.safeParse({ ...metadata, status: 'draft',
    content: [],
  }).success).toBe(true);
  expect(projectSchema.safeParse({ ...metadata, content: [] }).success)
    .toBe(false);
  expect(projectSchema.safeParse({ ...fixtures.project, status: 'published' })
    .success).toBe(false);
});

it('matches embedded form context and category to its owning article', () => {
  expect(projectSchema.safeParse({ ...metadata, content: [form] }).success)
    .toBe(true);
  for (const change of [{ context: 'service' }, { category: 'other' }]) {
    const result = projectSchema.safeParse({ ...metadata,
      content: [{ ...form, ...change }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['content', 0]);
    }
  }
});
