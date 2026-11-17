import data from "@/data/content/site/lists/projects.json";
import { getCollection, render } from "astro:content";
import { createProjectSchemas } from "../validation/projects";
import { projectCategories } from "./projectCategories";
import { parseContent } from "../validation/parseContent";
import {
  getAvailableProjectCategories,
  getVisibleProjects,
} from "../validation/policies/projectPublication";
// prettier-ignore
import {
  assertPublicationPolicy,
} from "../validation/policies/blockPublication";

const projectSchemas = createProjectSchemas(
  projectCategories.map(({ slug }) => slug),
);

const records = parseContent(
  projectSchemas.projectRecordsSchema,
  data,
  "data/content/site/lists/projects.json",
);
const entries = await getCollection("projectArticles");
const articleById = new Map(entries.map((entry) => [entry.id, entry]));
// Resolve authored articles; errors never silently select a JSON fallback.
const resolved = await Promise.all(
  records.map(async (record) => {
    const { article, ...metadata } = record;
    if (article.format === "json") {
      return { ...metadata, content: article.content };
    }
    const entry = articleById.get(article.entry);
    if (
      !entry ||
      entry.data.projectId !== record.id ||
      article.entry !== String(record.id)
    ) {
      throw new Error(`Missing/mismatched project article: ${record.id}`);
    }
    const { remarkPluginFrontmatter } = await render(entry);
    return { ...metadata, content: remarkPluginFrontmatter.content };
  }),
);
export const projectRecords = parseContent(
  projectSchemas.projectsSchema,
  resolved,
  "data/content/site/lists/projects.json",
);
projectRecords.forEach((project) =>
  assertPublicationPolicy(
    project.content,
    project.status,
    `project ${project.id}`,
  ),
);
export const projects = getVisibleProjects(projectRecords);
export const availableProjectCategories = getAvailableProjectCategories(
  projects,
  projectCategories,
);
