import { z } from 'astro/zod';

const text = z.string().refine((value) => value.trim().length > 0, 'Must not be blank');
const id = z.number().int().positive();
const mediaSource = text.refine((value) => {
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}, 'Must be an HTTP(S) URL or a root-relative asset path');

export const projectSchema = z.object({
  id,
  title: text,
  client: text,
  shortDescription: text,
  fullDescription: text,
  image: mediaSource,
  imageAlt: text,
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),
  result: text,
}).strict();

export const reviewSchema = z.object({
  id,
  name: text,
  position: text,
  company: text,
  text,
  avatar: mediaSource,
  avatarAlt: text,
  avatarWidth: z.number().int().positive(),
  avatarHeight: z.number().int().positive(),
}).strict();

function uniqueIds<T extends { id: number }>(items: T[], context: z.RefinementCtx) {
  const seen = new Set<number>();
  items.forEach((item, index) => {
    if (seen.has(item.id)) {
      context.addIssue({ code: 'custom', path: [index, 'id'], message: `Duplicate id: ${item.id}` });
    }
    seen.add(item.id);
  });
}

export const projectsSchema = z.array(projectSchema).superRefine(uniqueIds);
export const reviewsSchema = z.array(reviewSchema).superRefine(uniqueIds);

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

/** Include the editable source file and field paths in build errors. */
export function parseContent<T extends z.ZodType>(schema: T, data: unknown, source: string): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new Error(`Invalid content in ${source}:\n${issues.join('\n')}`);
  }
  return result.data;
}
