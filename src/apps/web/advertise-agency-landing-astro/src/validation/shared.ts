import { z } from 'astro/zod';

export const text = z.string().refine((value) => value.trim().length > 0, 'Must not be blank');
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

export function uniqueIds<T extends { id: number }>(items: T[], context: z.RefinementCtx) {
  const seen = new Set<number>();
  items.forEach((item, index) => {
    if (seen.has(item.id)) {
      context.addIssue({ code: 'custom', path: [index, 'id'], message: `Duplicate id: ${item.id}` });
    }
    seen.add(item.id);
  });
}

/** Check both assignability directions and keys (including extra optional fields). */
export type SameContract<Output, Domain> =
  [Output] extends [Domain]
    ? [Domain] extends [Output]
      ? [keyof Output] extends [keyof Domain]
        ? [keyof Domain] extends [keyof Output] ? true : false
        : false
      : false
    : false;

export type AssertContract<Match extends true> = Match;
