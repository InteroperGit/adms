import { z } from 'astro/zod';
import type {
  Offer,
  Offers,
  OfferPresentation,
  OfferFocalPoint,
} from '../types/offer';
import { text, id, uniqueIds } from './shared';
import type { AssertContract, SameContract } from './shared';

/** Reject URL normalization that could turn paths into external URLs. */
function safeOfferUrl(value: string, allowFragment: boolean): boolean {
  if (
    value !== value.trim() || /[\u0000-\u0020\u007f\\]/.test(value)
  ) return false;
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  if (allowFragment && value.startsWith('#') && value.length > 1) return true;
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export const offerFocalPointSchema = z.object({
  x: z.number().min(0).max(100).default(50),
  y: z.number().min(0).max(100).default(50),
}).strict();

// Validate palette contrast against a solid black/white reference.
// The translucent rendered backing still needs image-specific review.
function linear(channel: number): number {
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}
export function offerTextContrast(
  color: string,
  overlay: 'dark' | 'light',
): number {
  const channels = [1, 3, 5].map(offset =>
    linear(parseInt(color.slice(offset, offset + 2), 16) / 255),
  );
  const luminance = (
    channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
  );
  const background = overlay === 'dark' ? 0 : 1;
  return (
    (Math.max(luminance, background) + 0.05) /
    (Math.min(luminance, background) + 0.05)
  );
}

export const offerPresentationSchema = z.object({
  fontSizeRem: z.number().min(1).max(3).default(1.125),
  textColor: z.string().regex(
    /^#[0-9a-fA-F]{6}$/,
    'Use an opaque six-digit hex color, such as #ffffff',
  ).default('#ffffff'),
  overlay: z.enum(['dark', 'light']).default('dark'),
  horizontal: z.enum(['left', 'center', 'right']).default('left'),
  vertical: z.enum(['top', 'center', 'bottom']).default('bottom'),
  focalPoint: offerFocalPointSchema.default(() =>
    offerFocalPointSchema.parse({}),
  ),
  mobileFocalPoint: offerFocalPointSchema.optional(),
}).strict().superRefine((value, context) => {
  if (
    /^#[0-9a-fA-F]{6}$/.test(value.textColor) &&
    offerTextContrast(value.textColor, value.overlay) < 4.5
  ) {
    context.addIssue({
      code: 'custom',
      path: ['textColor'],
      message: 'Text color must meet 4.5:1 contrast with the solid ' +
        `${value.overlay} ` +
        'palette reference; choose a lighter color for dark or darker ' +
        'color for light. Review contrast over the actual image separately',
    });
  }
});

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
