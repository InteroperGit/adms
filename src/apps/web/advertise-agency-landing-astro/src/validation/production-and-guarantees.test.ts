// @vitest-environment node
// Production claims and warranties retain independent evidence constraints.
import { expect, it } from 'vitest';
import fixtures from '../../tests/fixtures/content/unit-contracts.json';
import { expectContentContract } from '../../tests/helpers/content-contract';
import { productionAndGuaranteesSchema } from './production-and-guarantees';

const source = fixtures['production-and-guarantees'];
const schema = productionAndGuaranteesSchema;

it('enforces the production root contract', () => {
  expectContentContract(schema, source);
});

it('accepts draft and fully approved section settings', () => {
  expect(schema.parse(source)).toEqual(source);
  expect(
    schema.safeParse({
      ...source,
      copyApproved: true,
      approvalSource: 'Evidence',
      pendingInputs: [],
    }).success,
  ).toBe(true);
});

it.each([
  { copyApproved: true },
  { pendingInputs: [] },
  { copyApproved: true, approvalSource: 'Evidence', demoMode: true },
])('rejects inconsistent section state %j', (change) => {
  expect(schema.safeParse({ ...source, ...change }).success).toBe(false);
});

it('requires identified warranty sources for approvals', () => {
  const warranty = source.warrantyTerms[0];
  expect(
    schema.safeParse({
      ...source,
      warrantyTerms: [{ ...warranty, approval: 'approved' }],
    }).success,
  ).toBe(false);
  for (const sourceType of ['agency-workmanship', 'manufacturer-component']) {
    expect(
      schema.safeParse({
        ...source,
        warrantyTerms: [{ ...warranty, approval: 'approved', sourceType }],
      }).success,
    ).toBe(true);
  }
});

it.each([
  'productionOperations',
  'materials',
  'qualityChecks',
  'warrantyTerms',
] as const)('rejects empty and duplicate %s entries', (field) => {
  expect(schema.safeParse({ ...source, [field]: [] }).success).toBe(false);
  const entry = source[field][0];
  expect(schema.safeParse({ ...source, [field]: [entry, entry] }).success).toBe(
    false,
  );
});

it('validates photo evidence, safe media, dimensions and strict keys', () => {
  const photo = {
    src: '/photo.png',
    alt: 'Photo',
    caption: 'Workshop',
    width: 1,
    height: 1,
    source: 'Agency',
    rights: 'Permission',
    approval: 'approved',
  };
  expect(schema.safeParse({ ...source, photos: [photo] }).success).toBe(true);
  for (const change of [
    { src: 'javascript:alert(1)' },
    { width: 0 },
    { rights: '' },
    { approval: 'unknown' },
    { extra: true },
  ]) {
    expect(
      schema.safeParse({
        ...source,
        photos: [{ ...photo, ...change }],
      }).success,
    ).toBe(false);
  }
  expect(schema.safeParse({ ...source, extra: true }).success).toBe(false);
});
