import { z } from 'astro/zod';
import type { Project } from '../types/project';
import { text, id, mediaSource, uniqueIds } from './shared';
import type { AssertContract, SameContract } from './shared';

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

export const projectsSchema = z.array(projectSchema).superRefine(uniqueIds);

export type ProjectSchemaContract = AssertContract<SameContract<z.output<typeof projectSchema>, Project>>;
export type ProjectsSchemaContract = AssertContract<SameContract<z.output<typeof projectsSchema>, Project[]>>;
