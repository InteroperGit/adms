import type { Project } from '../types/project';

/** Validated published cases and labelled demos share public destinations. */
export function getVisibleProjects(records: Project[]): Project[] {
  return records.filter((project) => project.status !== 'draft');
}
