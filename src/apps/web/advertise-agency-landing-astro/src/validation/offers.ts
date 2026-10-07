import { z } from 'astro/zod';
import type {
  Offer,
  Offers,
  OfferPresentation,
  OfferFocalPoint,
} from '../types/offer';
import { text, id, uniqueIds } from './shared';
import type { AssertContract, SameContract } from './shared';

import {
  safeCarouselUrl as safeOfferUrl,
  carouselFocalPointSchema as offerFocalPointSchema,
  carouselPresentationSchema as offerPresentationSchema,
} from './image-carousel';
export {
  carouselFocalPointSchema as offerFocalPointSchema,
  carouselPresentationSchema as offerPresentationSchema,
  carouselTextContrast as offerTextContrast,
} from './image-carousel';

export const offerSchema = z.object({
  id,
  enabled: z.boolean(),
  // Empty or whitespace-only text permits image/CTA-only slides.
  description: z.string(),
  presentation: offerPresentationSchema.default(() =>
    offerPresentationSchema.parse({}),
  ),
  image: text.refine(
    (value) => safeOfferUrl(value, false),
    'Must be a root-relative asset path or an HTTP(S) URL without ' +
      'credentials, spaces or backslashes',
  ),
  // Empty alternative text is decorative; whitespace-only text is invalid.
  imageAlt: z.string().refine(
    (value) => value === '' || value.trim().length > 0,
    'Use meaningful alternative text or an empty string for decorative artwork',
  ),
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),
  linkLabel: text,
  href: text.refine(
    (value) => safeOfferUrl(value, true),
    'Must be a root-relative path, a nonempty #fragment or an HTTP(S) URL ' +
      'without credentials, spaces or backslashes',
  ),
}).strict();

export const offersSchema = z.object({
  enabled: z.boolean(),
  autoplay: z.boolean(),
  intervalMs: z.number().int()
    .min(5000, 'Must be at least 5000 milliseconds').default(7000),
  items: z.array(offerSchema).superRefine(uniqueIds),
}).strict();

export type OfferPresentationSchemaContract = AssertContract<
  SameContract<z.output<typeof offerPresentationSchema>, OfferPresentation>
>;
export type OfferFocalPointSchemaContract = AssertContract<
  SameContract<z.output<typeof offerFocalPointSchema>, OfferFocalPoint>
>;
export type OfferSchemaContract = AssertContract<
  SameContract<z.output<typeof offerSchema>, Offer>
>;
export type OffersSchemaContract = AssertContract<
  SameContract<z.output<typeof offersSchema>, Offers>
>;
