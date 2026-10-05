import { z } from 'astro/zod';
import type { Review } from '../types/review';
import { text, id, mediaSource, uniqueIds } from './shared';
import type { AssertContract, SameContract } from './shared';

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

export const reviewsSchema = z.array(reviewSchema).superRefine(uniqueIds);

export type ReviewSchemaContract = AssertContract<SameContract<z.output<typeof reviewSchema>, Review>>;
export type ReviewsSchemaContract = AssertContract<SameContract<z.output<typeof reviewsSchema>, Review[]>>;
