import { z } from 'astro/zod';
import type {
  IntroductionContent,
  IntroductionFocalPoint,
  IntroductionPhoto,
} from '../types/introduction';
import { mediaSource, text } from './shared';
import type { AssertContract, SameContract } from './shared';

const focalPoint = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
}).strict();

const photo = z.object({
  src: mediaSource,
  alt: text,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  source: text,
  projectContext: text,
  publicationPermission: text,
  approved: z.boolean(),
  desktopFocalPoint: focalPoint,
  mobileFocalPoint: focalPoint,
}).strict();

export const introductionSchema = z.object({
  heading: text,
  summary: text,
  location: text,
  copyApproved: z.boolean(),
  demoMode: z.boolean().default(false),
  action: z.object({
    label: text,
    href: z.literal('/#order-inquiry'),
  }).strict(),
  photo: photo.nullable(),
}).strict();

export type IntroductionSchemaContract = AssertContract<
  SameContract<z.output<typeof introductionSchema>, IntroductionContent>
>;

export type IntroductionPhotoSchemaContract = AssertContract<
  SameContract<z.output<typeof photo>, IntroductionPhoto>
>;

export type IntroductionFocalPointSchemaContract = AssertContract<
  SameContract<z.output<typeof focalPoint>, IntroductionFocalPoint>
>;
