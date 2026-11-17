import data from "@/data/content/site/pages/projects.json";
import { parseContent } from "@/validation/parse-content";
import { projectCatalogSchema } from "@/validation/project-catalog";

/** Validated settings shared by the server-rendered and client catalog. */
export const projectCatalogSettings = parseContent(
  projectCatalogSchema,
  data,
  "data/content/site/pages/projects.json",
);
