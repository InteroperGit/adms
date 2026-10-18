import { expect } from 'vitest';
import type { z } from 'astro/zod';

/** Keeps the shared root-contract checks consistent across content schemas. */
export function expectContentContract(
  schema: z.ZodType,
  fixture: unknown,
  optionalKeys: string[] = [],
): void {
  expect(schema.safeParse(fixture).success).toBe(true);

  for (const invalid of [null, true, 42, 'text']) {
    expect(schema.safeParse(invalid).success).toBe(false);
  }

  const source = Array.isArray(fixture) ? fixture[0] : fixture;
  const record = source as Record<string, unknown>;

  for (const key of Object.keys(record)) {
    const changed = { ...record };
    delete changed[key];
    const value = Array.isArray(fixture) ? [changed] : changed;
    expect(schema.safeParse(value).success, `missing ${key}`).toBe(
      optionalKeys.includes(key),
    );
  }

  const extra = { ...record, unexpected: true };
  const value = Array.isArray(fixture) ? [extra] : extra;
  expect(schema.safeParse(value).success).toBe(false);
}
