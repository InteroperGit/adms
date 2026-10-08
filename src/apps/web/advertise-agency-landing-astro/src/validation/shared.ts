import { z } from 'astro/zod';

export const text = z.string().refine(
  (value) => value.trim().length > 0,
  'Must not be blank',
);
export const id = z.number().int().positive();
export const mediaSource = text.refine((value) => {
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}, 'Must be an HTTP(S) URL or a root-relative asset path');

export function uniqueValues<T, V>(
  items: T[],
  valueOf: (item: T) => V,
  context: z.RefinementCtx,
  label = 'value',
) {
  const seen = new Set<V>();
  items.forEach((item, index) => {
    const value = valueOf(item);
    if (seen.has(value)) {
      context.addIssue({
        code: 'custom',
        path: [index, label],
        message: `Duplicate ${label}: ${String(value)}`,
      });
    }
    seen.add(value);
  });
}

export function uniqueIds<T extends { id: number }>(
  items: T[],
  context: z.RefinementCtx,
) {
  uniqueValues(items, item => item.id, context, 'id');
}

/** Check assignability in both directions, including optional keys. */
export type SameContract<Output, Domain> =
  [Output] extends [Domain]
    ? [Domain] extends [Output]
      ? [keyof Output] extends [keyof Domain]
        ? [keyof Domain] extends [keyof Output] ? true : false
        : false
      : false
    : false;

export type AssertContract<Match extends true> = Match;
