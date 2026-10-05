import { z } from 'astro/zod';
import type { Offer, Offers } from '../types/offer';
import { text, id, uniqueIds } from './shared';
import type { AssertContract, SameContract } from './shared';

/** Reject browser URL normalization that could turn an internal path into an external URL. */
function safeOfferUrl(value: string, allowFragment: boolean): boolean {
  if (value !== value.trim() || /[\u0000-\u0020\u007f\\]/.test(value)) return false;
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  if (allowFragment && value.startsWith('#') && value.length > 1) return true;
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password;
  } catch {
    return false;
  }
}

export const offerSchema = z.object({
  id,
  enabled: z.boolean(),
  title: text,
  description: text,
  image: text.refine((value) => safeOfferUrl(value, false), 'Must be a root-relative asset path or an HTTP(S) URL without credentials, spaces or backslashes'),
  // Empty alternative text is intentional for decorative artwork; whitespace-only text is not.
  imageAlt: z.string().refine((value) => value === '' || value.trim().length > 0, 'Use meaningful alternative text or an empty string for decorative artwork'),
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),
  linkLabel: text,
  href: text.refine((value) => safeOfferUrl(value, true), 'Must be a root-relative path, a nonempty #fragment or an HTTP(S) URL without credentials, spaces or backslashes'),
}).strict();

export const offersSchema = z.object({
  enabled: z.boolean(),
  autoplay: z.boolean(),
  intervalMs: z.number().int().min(5000, 'Must be at least 5000 milliseconds').default(7000),
  title: text,
  items: z.array(offerSchema).superRefine(uniqueIds),
}).strict();

export type OfferSchemaContract = AssertContract<SameContract<z.output<typeof offerSchema>, Offer>>;
export type OffersSchemaContract = AssertContract<SameContract<z.output<typeof offersSchema>, Offers>>;
