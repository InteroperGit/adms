// @vitest-environment node
// Pagination settings must remain positive integral counts.
import { expect, it } from 'vitest';
import fixtures from '../../tests/fixtures/content/unit-contracts.json';
import { expectContentContract } from '../../tests/helpers/content-contract';
import { projectCatalogSchema } from './project-catalog';

it('enforces the project-catalog root contract', () => {
  expectContentContract(projectCatalogSchema, fixtures['project-catalog']);
});

it('parses the smallest valid page size', () => {
  expect(projectCatalogSchema.parse(fixtures['project-catalog'])).toEqual({
    pageSize: 1,
  });
});

it.each([0, -1, 1.5, '1', null, Infinity, NaN])(
  'rejects invalid page size %s',
  (pageSize) => {
    expect(projectCatalogSchema.safeParse({ pageSize }).success).toBe(false);
  },
);

it('rejects missing settings and unknown keys', () => {
  expect(projectCatalogSchema.safeParse({}).success).toBe(false);
  expect(
    projectCatalogSchema.safeParse({ pageSize: 1, extra: true }).success,
  ).toBe(false);
});
