import {
  projectCategories,
  type Project,
  type ProjectCategory,
} from '../types/project';

/** Validated published cases and labelled demos share public destinations. */
export function getVisibleProjects(records: Project[]): Project[] {
  return records.filter((project) => project.status !== 'draft');
}

/** Demos remain directly accessible but never enter the indexable route map. */
export function getPublishedProjectPaths(records: Project[]): string[] {
  return records.filter((project) => project.status === 'published')
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
