import { z } from 'astro/zod';
import { projectCategories, type ProjectCategory } from '../types/project';
import type { Project } from '../types/project';
import { contentBlocksSchema } from './content-blocks';
import { text, id, uniqueIds } from './shared';
import type { AssertContract, SameContract } from './shared';
import {
  getPublicationIssues,
  getVisibleBlocks,
} from '../content/block-publication';

const categorySlugs = projectCategories.map(({ slug }) => slug) as [
  ProjectCategory,
  ...ProjectCategory[],
];

/** Public contract: metadata plus one ordered content block stream. */
const approval = z.object({
  source: text,
  approvedBy: text,
  approvedAt: text.regex(/^\d{4}-\d{2}-\d{2}$/),
}).strict();

export const projectMetadataSchema = z.object({
  id,
  category: z.enum(categorySlugs).nullable().optional(),
  status: z.enum(['draft', 'demo', 'published']),
  notice: text.nullable(),
  title: text,
  client: text,
  date: text.regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  attribution: z.enum(['named', 'generic']),
  description: text,
  evidence: z.object({
    copy: approval.nullable(),
    specifications: approval.nullable(),
    timing: approval.nullable(),
    outcome: approval.nullable(),
    attribution: approval.nullable(),
  }).strict().optional(),
}).strict();

export const projectSchema = projectMetadataSchema.extend({
  content: contentBlocksSchema,
}).strict().superRefine((project, context) => {
  getPublicationIssues(project.content, project.status)
    .forEach(({ block, message }) => context.addIssue({
      code: 'custom', path: ['content', block], message,
    }));
  if (project.status !== 'draft' && !getVisibleBlocks(project.content).length) {
    context.addIssue({
      code: 'custom', path: ['content'],
      message: 'Visible projects need article content',
    });
  }
  project.content.forEach((block, index) => {
    if (block.type !== 'order-form') return;
    if (block.context !== 'project'
      || (block.category && block.category !== project.category)) {
      context.addIssue({
        code: 'custom',
        path: ['content', index],
        message: 'Project form context/category must match its article',
      });
    }
  });
});

export const projectsSchema = z.array(projectSchema).superRefine(uniqueIds);

export const projectArticleMetadataSchema = z.object({
  projectId: id,
}).strict();

export const projectArticleSourceSchema = z.discriminatedUnion('format', [
  z.object({ format: z.literal('mdx'), entry: text }).strict(),
  z.object({
    format: z.literal('json'), reason: text, content: contentBlocksSchema,
  }).strict(),
]);

export const projectRecordsSchema = z.array(projectMetadataSchema.extend({
  article: projectArticleSourceSchema,
}).strict()).superRefine(uniqueIds);

export type ProjectContract = AssertContract<
  SameContract<z.output<typeof projectSchema>, Project>
>;
export type ProjectsContract = AssertContract<
  SameContract<z.output<typeof projectsSchema>, Project[]>
>;
