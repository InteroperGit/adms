// Boundary tests for reusable validation primitives.
import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';
import {
  id,
  mediaSource,
  text,
  uniqueIds,
  uniqueValues,
} from './shared';

describe('text and id schemas', () => {
  it('accepts meaningful text and positive integer IDs', () => {
    expect(text.parse('  copy  ')).toBe('  copy  ');
    expect(id.parse(7)).toBe(7);
  });

  it.each(['', '   ', '\n\t'])('rejects blank text: %j', value => {
    expect(text.safeParse(value).success).toBe(false);
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid ID: %s',
    value => expect(id.safeParse(value).success).toBe(false),
  );
});

describe('mediaSource', () => {
  it.each(['/asset.webp', 'https://example.test/a.png',
    'http://example.test/a.png'])('accepts safe source: %s', value => {
    expect(mediaSource.safeParse(value).success).toBe(true);
  });

  it.each(['//example.test/a.png', 'javascript:alert(1)',
    'data:image/png;base64,abc', 'asset.webp', ''])(
    'rejects unsafe source: %s',
    value => expect(mediaSource.safeParse(value).success).toBe(false),
  );
});

describe('uniqueness refinements', () => {
  const schema = z.array(z.object({ key: z.string(), id: z.number() }))
    .superRefine((items, context) => {
      uniqueValues(items, item => item.key, context, 'key');
      uniqueIds(items, context);
    });

  it('accepts unique values and IDs', () => {
    expect(schema.safeParse([
      { key: 'one', id: 1 },
      { key: 'two', id: 2 },
    ]).success).toBe(true);
  });

  it('reports duplicate values at the repeated item path', () => {
    const result = schema.safeParse([
      { key: 'one', id: 1 },
      { key: 'one', id: 1 },
    ]);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(expect.arrayContaining([
        expect.objectContaining({ path: [1, 'key'] }),
        expect.objectContaining({ path: [1, 'id'] }),
      ]));
    }
  });

  it('does not treat an empty list as a duplicate case', () => {
    expect(schema.safeParse([]).success).toBe(true);
  });
});
