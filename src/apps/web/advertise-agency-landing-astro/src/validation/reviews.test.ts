// @vitest-environment node
// Boundary tests for review identity, copy and avatar media.
import { expect, it } from 'vitest';
import fixture from '../../tests/fixtures/content/unit-contracts.json';
import { expectContentContract } from '../../tests/helpers/content-contract';
import { reviewsSchema } from './reviews';

it('enforces the reviews root contract', () => {
  expectContentContract(reviewsSchema, fixture.reviews);
});

it('parses the versioned review fixture', () => {
  expect(reviewsSchema.parse(fixture.reviews)[0].name).toBe('TEST_NAME');
});

it('rejects duplicate IDs and invalid dimensions or media', () => {
  const duplicate = [fixture.reviews[0], fixture.reviews[0]];
  expect(reviewsSchema.safeParse(duplicate).success).toBe(false);
  expect(
    reviewsSchema.safeParse([
      {
        ...fixture.reviews[0],
        avatar: 'javascript:alert(1)',
        avatarWidth: 0,
      },
    ]).success,
  ).toBe(false);
});

it('rejects blank required copy and unknown keys', () => {
  expect(
    reviewsSchema.safeParse([
      {
        ...fixture.reviews[0],
        text: ' ',
        extra: true,
      },
    ]).success,
  ).toBe(false);
});
