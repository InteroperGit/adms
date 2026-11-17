import data from "@/data/content/site/sections/businessSolutions.json";
import { parseContent } from "../validation/parseContent";
import { businessSolutionsSchema } from "../validation/businessSolutions";

/** Validated copy; attribution and media remain optional evidence metadata. */
export const businessSolutions = parseContent(
  businessSolutionsSchema,
  data,
  "data/content/site/sections/businessSolutions.json",
);
