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

/** Include the editable source file and field paths in build errors. */
export function parseContent<T extends z.ZodType>(schema: T, data: unknown, source: string): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new Error(`Invalid content in ${source}:\n${issues.join('\n')}`);
  }
  return result.data;
}
