import data from '@/data/content/config/project-categories.json';
import { z } from 'astro/zod';

const cssColor = z.string().regex(
  /^#[0-9A-Fa-f]{6}$/,
  'Category colors must be six-digit hexadecimal values',
);

const categorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  label: z.string().min(1),
  color: cssColor,
  textColor: cssColor,
}).strict();

const categoriesSchema = z.array(categorySchema).min(1).superRefine(
  (categories, context) => {
    const seen = new Set<string>();
    categories.forEach((category, index) => {
      if (seen.has(category.slug)) {
        context.addIssue({
          code: 'custom',
          path: [index, 'slug'],
          message: 'Category slugs must be unique',
        });
      }
      seen.add(category.slug);
    });
  },
);

export type ProjectCategory = typeof data[number]['slug'];

export interface ProjectCategoryConfig {
  slug: ProjectCategory;
  label: string;
  color: string;
  textColor: string;
}

/** One validated source for category labels and badge colors. */
export const projectCategories = categoriesSchema.parse(
  data,
) as ProjectCategoryConfig[];

const categoryBySlug = new Map(
  projectCategories.map((category) => [category.slug, category]),
);

/** Return a configured category, safely ignoring missing or unknown slugs. */
export function getProjectCategory(
  slug: string | null | undefined,
): ProjectCategoryConfig | undefined {
  return slug ? categoryBySlug.get(slug as ProjectCategory) : undefined;
}
