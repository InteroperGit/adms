// Compile-only examples; this file is never executed.
import type * as Domain from '@/types/project';

export const value = {
  id: 1,
  category: 'sample',
  status: 'demo',
  notice: 'Synthetic demo',
  title: 'Sample',
  client: 'Sample',
  attribution: 'generic',
  description: 'Synthetic project',
  content: [
    {
      type: 'paragraph',
      paragraphs: ['Synthetic copy'],
    },
  ],
} satisfies Domain.Project;

export const approval = {
  source: 'Fixture evidence',
  approvedBy: 'Fixture editor',
  approvedAt: '2026-10-18',
} satisfies Domain.ProjectApproval;
export const evidence = {
  copy: approval,
  specifications: null,
  timing: null,
  outcome: null,
  attribution: null,
} satisfies Domain.ProjectEvidence;
export const category = 'sample' satisfies Domain.ProjectCategory;
export const categoryConfig = {
  slug: category,
  label: 'Fixture category',
  color: '#000000',
  textColor: '#ffffff',
} satisfies Domain.ProjectCategoryConfig;

import { getProjectCategory, projectCategories } from '@/types/project';
export const categories =
  projectCategories satisfies Domain.ProjectCategoryConfig[];
export const found = getProjectCategory(category) satisfies
  Domain.ProjectCategoryConfig | undefined;

export const unclassified = {
  ...value,
  category: null,
  evidence,
} satisfies Domain.Project;

export const invalid = {
  ...value,
  // @ts-expect-error status must retain its domain type.
  status: 'archived',
} satisfies Domain.Project;
