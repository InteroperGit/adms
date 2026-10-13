import data from '@/data/content/projects.json';
import { projectsSchema } from '../validation/projects';
import { parseContent } from '../validation/parse-content';
import { toUniversalProjectRecord } from './project-content-migration';
import {
  getAvailableProjectCategories,
  getVisibleProjects,
} from './project-publication';

const migratedData = (data as Record<string, unknown>[])
  .map(toUniversalProjectRecord);
export const projectRecords = parseContent(
  projectsSchema, migratedData, 'data/content/projects.json',
);
export const projects = getVisibleProjects(projectRecords);
export const availableProjectCategories = getAvailableProjectCategories(
  projects,
);
