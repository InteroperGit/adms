import data from "@/data/content/site/sections/introduction.json";
import { introductionSchema } from "../validation/introduction";
import { parseContent } from "../validation/parse-content";

export const introduction = parseContent(
  introductionSchema,
  data,
  "data/content/site/sections/introduction.json",
);
