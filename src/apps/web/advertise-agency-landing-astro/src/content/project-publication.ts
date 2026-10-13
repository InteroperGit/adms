import {
  projectCategories,
  type Project,
  type ProjectCategory,
} from '../types/project';
import { hasDemoBlocks } from './block-publication';

/** Page status alone cannot promote a visible demo block into a real case. */
export function isProjectPublished(project: Project): boolean {
  return project.status === 'published' && !hasDemoBlocks(project.content);
}

/** Validated published cases and labelled demos share public destinations. */
export function getVisibleProjects(records: Project[]): Project[] {
  return records.filter((project) => project.status !== 'draft');
}

/** Demos remain directly accessible but never enter the indexable route map. */
export function getPublishedProjectPaths(records: Project[]): string[] {
  return records.filter(isProjectPublished)
    .map((project) => `/projects/${project.id}/`);
}

/**
 * Return only registry categories represented by classified public projects.
 * Unclassified projects remain in the all-projects collection and are not
 * silently assigned to the fallback category.
 */
export function getAvailableProjectCategories(
  records: Project[],
) {
  const used = new Set<ProjectCategory>(
    records.flatMap((project) => (
      project.category ? [project.category] : []
    )),
  );
  return projectCategories.filter(({ slug }) => used.has(slug));
}
