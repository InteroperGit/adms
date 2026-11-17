import data from "@/data/content/site/sections/businessSolutions.json";
import { parseContent } from "../validation/parse-content";
import { businessSolutionsSchema } from "../validation/business-solutions";

/** Validated copy; attribution and media remain optional evidence metadata. */
export const businessSolutions = parseContent(
  businessSolutionsSchema,
  data,
  "data/content/site/sections/businessSolutions.json",
);
