import data from "@/data/content/site/pages/projects.json";
import { z } from "astro/zod";

const projectCatalogSchema = z
  .object({
    pageSize: z.number().int().positive(),
  })
  .strict();

/** Validated settings shared by the server-rendered and client catalog. */
export const projectCatalogSettings = projectCatalogSchema.parse(data);
