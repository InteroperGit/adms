import { z } from 'astro/zod';
import { projectTypes } from '../types/project';
import type {
  Project, ProjectDetails, ProjectEvidence, ProjectPhoto,
} from '../types/project';
import { text, id, mediaSource, uniqueIds } from './shared';
import type { AssertContract, SameContract } from './shared';

const date = text.regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime())
    && parsed.toISOString().slice(0, 10) === value;
}, 'Must be a real YYYY-MM-DD date');

const evidence = z.object({
  source: text,
  approvedBy: text,
  approvedAt: date,
}).strict();

const photo = z.object({
  src: mediaSource,
  alt: text,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  kind: z.enum(['demo', 'installation']),
  source: text,
  rights: text.nullable(),
  approval: evidence.nullable(),
  caption: text,
  cropGuidance: text,
  focalPoint: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
  }).strict(),
}).strict().superRefine((value, context) => {
  if (value.kind === 'demo' && value.approval) {
    context.addIssue({ code: 'custom', path: ['approval'],
      message: 'Demo media cannot carry installation approval' });
  }
  if (value.approval && !value.rights) {
    context.addIssue({ code: 'custom', path: ['rights'],
      message: 'Approved media requires recorded usage rights' });
  }
});

// Empty process objects are valid and omitted by the static page.
const process = z.object({
  paragraphs: z.array(text).optional(),
  photos: z.array(photo).optional(),
}).strict();

const details = z.object({
  customerTask: text.nullable(),
  installationContext: text.nullable(),
  constraints: z.array(text).nullable(),
  materials: z.array(text).nullable(),
  dimensions: z.array(z.object({
    label: text,
    value: z.number().positive(),
    unit: z.enum(['mm', 'cm', 'm']),
  }).strict()).nullable(),
  includedWork: z.array(text).nullable(),
  timing: z.object({
    production: z.object({
      value: z.number().positive(),
      unit: z.enum(['hours', 'days']),
      basis: text,
    }).strict(),
    design: text.nullable(),
    installation: text.nullable(),
    totalDelivery: text.nullable(),
  }).strict().partial().nullable(),
}).strict().partial();

export const projectSchema = z.object({
  id,
  projectType: z.enum(projectTypes).nullable().optional(),
  status: z.enum(['draft', 'demo', 'published']),
  notice: text.nullable(),
  title: text,
  client: text,
  year: z.number().int().min(1900).max(2100).optional(),
  attribution: z.enum(['named', 'generic']),
  shortDescription: text,
  fullDescription: text.nullable().optional(),
  story: z.array(text).nullable().optional(),
  expectedBenefits: z.array(text).nullable().optional(),
  manufacturing: process.nullable().optional(),
  installation: process.nullable().optional(),
  result: text.nullable().optional(),
  resultPhotos: z.array(photo).nullable().optional(),
  details: details.nullable().optional(),
  photos: z.array(photo),
  evidence: z.object({
    copy: evidence.nullable(),
    specifications: evidence.nullable(),
    timing: evidence.nullable(),
    outcome: evidence.nullable(),
    attribution: evidence.nullable(),
  }).strict(),
}).strict().superRefine((value, context) => {
  const report = (path: (string | number)[], message: string) => {
    context.addIssue({ code: 'custom', path, message });
  };
  // Apply the same provenance gates to every photo, including process media.
  const media = [
    ...(value.resultPhotos ?? []).map((image, index) => ({
      image, path: ['resultPhotos', index] as (string | number)[],
    })),
    ...value.photos.map((image, index) => ({
      image, path: ['photos', index] as (string | number)[],
    })),
    ...(['manufacturing', 'installation'] as const).flatMap((section) =>
      (value[section]?.photos ?? []).map((image, index) => ({
        image, path: [section, 'photos', index] as (string | number)[],
      }))),
  ];
  if (value.status === 'demo') {
    if (!value.notice) report(['notice'], 'Visible demos require a notice');
    if (value.result) {
      report(['result'], 'Demo cases cannot claim verified outcomes');
    }
    if (value.attribution !== 'generic') {
      report(['attribution'], 'Demo clients must use generic descriptions');
    }
    for (const [key, approval] of Object.entries(value.evidence)) {
      if (approval) report(['evidence', key], 'Demos are not agency approval');
    }
    media.forEach(({ image, path }) => {
      if (image.kind !== 'demo') {
        report([...path, 'kind'], 'Demo cases require demo media');
      }
    });
  }
  if (value.status !== 'published') return;
  for (const [key, approval] of Object.entries(value.evidence)) {
    if (!approval) report(['evidence', key], 'Published cases need evidence');
  }
  if (!value.photos.length) {
    report(['photos'], 'Published cases need completed-installation photos');
  }
  media.forEach(({ image, path }) => {
    if (image.kind !== 'installation' || !image.approval || !image.rights) {
      report(path, 'Requires approved installation media');
    }
  });
});

export const projectsSchema = z.array(projectSchema).superRefine(uniqueIds);

export type ProjectContract = AssertContract<
  SameContract<z.output<typeof projectSchema>, Project>
>;
export type ProjectsContract = AssertContract<
  SameContract<z.output<typeof projectsSchema>, Project[]>
>;
export type PhotoContract = AssertContract<
  SameContract<z.output<typeof photo>, ProjectPhoto>
>;
export type DetailsContract = AssertContract<
  SameContract<z.output<typeof details>, ProjectDetails>
>;
export type EvidenceContract = AssertContract<
  SameContract<z.output<typeof evidence>, ProjectEvidence>
>;
