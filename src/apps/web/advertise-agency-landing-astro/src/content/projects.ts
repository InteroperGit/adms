import data from '@/data/content/projects.json';
import { projectsSchema } from '../validation/projects';
import { parseContent } from '../validation/parse-content';
import { getVisibleProjects } from './project-publication';

// Validate drafts too; one catalog supplies cards, routes and pricing links.
export const projectRecords = parseContent(
  projectsSchema, data, 'data/content/projects.json',
);
export const projects = getVisibleProjects(projectRecords);
