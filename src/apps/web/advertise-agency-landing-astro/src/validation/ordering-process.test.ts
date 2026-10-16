// Boundary tests for the five-step ordering process contract.
import { expect, it } from 'vitest';
import fixture from '../../tests/fixtures/content/unit-contracts.json';
import { orderingProcessSchema } from './ordering-process';

it('parses the versioned five-step fixture', () => {
  expect(orderingProcessSchema.parse(fixture['ordering-process']).steps)
    .toHaveLength(5);
});

it('requires approval evidence when copy is approved', () => {
  const source = structuredClone(fixture['ordering-process']);
  source.copyApproved = true;
  source.approvalSource = null;
  expect(orderingProcessSchema.safeParse(source).success).toBe(false);
});

it('rejects wrong step counts, duplicates and malformed media', () => {
  const source = structuredClone(fixture['ordering-process']);
  source.steps.pop();
  expect(orderingProcessSchema.safeParse(source).success).toBe(false);
  const duplicate = structuredClone(fixture['ordering-process']);
  duplicate.steps[1].id = duplicate.steps[0].id;
  expect(orderingProcessSchema.safeParse(duplicate).success).toBe(false);
  const invalid = structuredClone(fixture['ordering-process']);
  invalid.steps[0].icon = 'javascript:alert(1)';
  expect(orderingProcessSchema.safeParse(invalid).success).toBe(false);
});
