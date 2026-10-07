// Shared carousel validation runs at build time, never in browser scripts.
import { z } from 'astro/zod';
import { text, id, uniqueIds } from './shared';
import type {
  CarouselItem, CarouselOptions, CarouselPresentation,
} from '../types/image-carousel';
import type { AssertContract, SameContract } from './shared';
/** Reject URL normalization that could turn paths into external URLs. */
export function safeCarouselUrl(
  value: string, allowFragment: boolean,
): boolean {
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

export const carouselFocalPointSchema = z.object({
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
export function carouselTextContrast(
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

export const carouselPresentationSchema = z.object({
  fontSizeRem: z.number().min(1).max(3).default(1.125),
  textColor: z.string().regex(
    /^#[0-9a-fA-F]{6}$/,
    'Use an opaque six-digit hex color, such as #ffffff',
  ).default('#ffffff'),
  overlay: z.enum(['dark', 'light']).default('dark'),
  horizontal: z.enum(['left', 'center', 'right']).default('left'),
  vertical: z.enum(['top', 'center', 'bottom']).default('bottom'),
  focalPoint: carouselFocalPointSchema.default(() =>
    carouselFocalPointSchema.parse({}),
  ),
  mobileFocalPoint: carouselFocalPointSchema.optional(),
}).strict().superRefine((value, context) => {
  if (
    /^#[0-9a-fA-F]{6}$/.test(value.textColor) &&
    carouselTextContrast(value.textColor, value.overlay) < 4.5
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


// Each optional capability is independent; manual=false overrides arrows
// and makes circles passive. Accessibility holds are always mandatory.
export const carouselOptionsSchema = z.object({
  enabled: z.boolean().default(true),
  autoplay: z.boolean().default(true),
  intervalMs: z.number().int().min(5000).default(7000),
  manualNavigation: z.boolean().default(true),
  arrows: z.boolean().default(true),
  circles: z.boolean().default(true),
  descriptions: z.boolean().default(true),
  buttons: z.boolean().default(true),
  animation: z.boolean().default(true),
  layout: z.enum(['full', 'panel']).default('full'),
  imageFit: z.enum(['cover', 'contain']).default('cover'),
  aspectRatio: z.number().positive().default(4 / 3),
  eagerFirst: z.boolean().default(true),
}).strict();

export const carouselItemSchema = z.object({
  id,
  enabled: z.boolean().default(true),
  image: text.refine(value => safeCarouselUrl(value, false),
    'Use a safe root-relative asset path or HTTP(S) URL'),
  imageAlt: z.string().refine(value =>
    value === '' || value.trim().length > 0),
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),
  description: z.string().optional(),
  href: text.refine(value => safeCarouselUrl(value, true)).optional(),
  linkLabel: text.optional(),
  presentation: carouselPresentationSchema.default(() =>
    carouselPresentationSchema.parse({})),
}).strict().superRefine((item, context) => {
  if (Boolean(item.href) !== Boolean(item.linkLabel)) {
    context.addIssue({ code: 'custom', path: ['href'],
      message: 'Supply both href and linkLabel, or omit both' });
  }
});

export const carouselItemsSchema =
  z.array(carouselItemSchema).superRefine(uniqueIds);

export const carouselContentSchema = z.object({
  options: carouselOptionsSchema,
  items: carouselItemsSchema,
}).strict();

export type CarouselOptionsContract = AssertContract<
  SameContract<z.output<typeof carouselOptionsSchema>, CarouselOptions>
>;
export type CarouselItemContract = AssertContract<
  SameContract<z.output<typeof carouselItemSchema>, CarouselItem>
>;
export type CarouselPresentationContract = AssertContract<
  SameContract<z.output<typeof carouselPresentationSchema>,
    CarouselPresentation>
>;
