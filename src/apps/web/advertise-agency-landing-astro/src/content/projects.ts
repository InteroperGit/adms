import data from '@/data/content/projects.json';
import { projectsSchema } from '../validation/projects';
import { parseContent } from '../validation/parse-content';

export const projects = parseContent(projectsSchema, data, 'data/content/projects.json');
