// Boundary tests for the introduction content contract.
import { expect, it } from 'vitest';
import fixture from '../../tests/fixtures/content/unit-contracts.json';
import { introductionSchema } from './introduction';

it('parses the versioned introduction fixture', () => {
  expect(introductionSchema.parse(fixture.introduction).heading)
    .toBe('TEST_HEADING');
});

it('defaults demoMode and accepts a missing photo', () => {
  const value = { ...fixture.introduction, demoMode: undefined, photo: null };
  expect(introductionSchema.parse(value).demoMode).toBe(false);
});

it('rejects invalid action, geometry, media and unknown keys', () => {
  expect(introductionSchema.safeParse({
    ...fixture.introduction, action: { label: 'Go', href: '/bad' },
  }).success).toBe(false);
  expect(introductionSchema.safeParse({
    ...fixture.introduction,
    photo: { ...fixture.introduction.photo, width: 0 },
  }).success).toBe(false);
  expect(introductionSchema.safeParse({
    ...fixture.introduction, extra: true,
  }).success).toBe(false);
});
