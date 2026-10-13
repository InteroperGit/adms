import {
  getProjectCategory,
  projectCategories,
} from '../content/project-categories';
import type {
  ProjectCategory,
  ProjectCategoryConfig,
} from '../content/project-categories';
import type { ContentBlock } from './content-blocks';

export { getProjectCategory, projectCategories };
export type { ProjectCategory, ProjectCategoryConfig };

/**
 * Catalog and SEO metadata for a project article.
 * Article material belongs in content blocks.
 */
export interface Project {
  id: number;
  category?: ProjectCategory | null;
  status: 'draft' | 'demo' | 'published';
  notice: string | null;
  title: string;
  client: string;
  /** ISO calendar date for the project milestone, when known. */
  date?: string;
  attribution: 'named' | 'generic';
  description: string;
  content: ContentBlock[];
}
