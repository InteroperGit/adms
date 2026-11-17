import data from "@/data/content/site/pages/projects.json";
import { parseContent } from "@/validation/parseContent";
import { projectCatalogSchema } from "@/validation/projectCatalog";

/** Validated settings shared by the server-rendered and client catalog. */
export const projectCatalogSettings = parseContent(
  projectCatalogSchema,
  data,
  "data/content/site/pages/projects.json",
);
