import data from '@/data/content/config/projects.json';
import { getCollection, render } from 'astro:content';
import { projectsSchema, projectRecordsSchema } from '../validation/projects';
import { parseContent } from '../validation/parse-content';
import {
  getAvailableProjectCategories,
  getVisibleProjects,
} from './project-publication';
import { assertPublicationPolicy } from './block-publication';

const records = parseContent(
  projectRecordsSchema, data, 'data/content/config/projects.json',
);
const entries = await getCollection('projectArticles');
const articleById = new Map(entries.map((entry) => [entry.id, entry]));
// Resolve authored articles; errors never silently select a JSON fallback.
const resolved = await Promise.all(records.map(async (record) => {
  const { article, ...metadata } = record;
  if (article.format === 'json') {
    return { ...metadata, content: article.content };
  }
  const entry = articleById.get(article.entry);
  if (!entry || entry.data.projectId !== record.id
    || article.entry !== String(record.id)) {
    throw new Error(`Missing/mismatched project article: ${record.id}`);
  }
  const { remarkPluginFrontmatter } = await render(entry);
  return { ...metadata, content: remarkPluginFrontmatter.content };
}));
export const projectRecords = parseContent(
  projectsSchema, resolved, 'data/content/config/projects.json',
);
projectRecords.forEach((project) => assertPublicationPolicy(
  project.content, project.status, `project ${project.id}`,
));
export const projects = getVisibleProjects(projectRecords);
export const availableProjectCategories = getAvailableProjectCategories(
  projects,
);
