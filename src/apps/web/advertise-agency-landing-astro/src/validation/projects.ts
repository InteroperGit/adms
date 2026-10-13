import { z } from 'astro/zod';
import { projectCategories, type ProjectCategory } from '../types/project';
import type { Project } from '../types/project';
import { contentBlocksSchema } from './content-blocks';
import { text, id, uniqueIds } from './shared';
import type { AssertContract, SameContract } from './shared';

const categorySlugs = projectCategories.map(({ slug }) => slug) as [
  ProjectCategory,
  ...ProjectCategory[],
];

/** Public contract: metadata plus one ordered content block stream. */
export const projectSchema = z.object({
  id,
  category: z.enum(categorySlugs).nullable().optional(),
  status: z.enum(['draft', 'demo', 'published']),
  notice: text.nullable(),
  title: text,
  client: text,
  date: text.regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  attribution: z.enum(['named', 'generic']),
  description: text,
  content: contentBlocksSchema,
}).strict();

export const projectsSchema = z.array(projectSchema).superRefine(uniqueIds);

export type ProjectContract = AssertContract<
  SameContract<z.output<typeof projectSchema>, Project>
>;
export type ProjectsContract = AssertContract<
  SameContract<z.output<typeof projectsSchema>, Project[]>
>;
