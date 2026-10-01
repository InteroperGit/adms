import data from '@/data/content/projects.json';
import { parseContent, projectsSchema } from './schemas';

export const projects = parseContent(projectsSchema, data, 'data/content/projects.json');
