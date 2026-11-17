import data from "@/data/content/site/sections/faq.json";
import { faqSchema } from "../validation/faq";
import { parseContent } from "../validation/parseContent";

/** Draft copy is reusable; consumers must apply the publication helper. */
export const faq = parseContent(
  faqSchema,
  data,
  "data/content/site/sections/faq.json",
);
