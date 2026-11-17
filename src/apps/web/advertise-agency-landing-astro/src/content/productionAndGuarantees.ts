import data from "@/data/content/site/sections/productionAndGuarantees.json";
import { parseContent } from "../validation/parseContent";
// prettier-ignore
import { productionAndGuaranteesSchema } from
  '../validation/productionAndGuarantees';

/** Validate guidance and keep agency claims subject to publication checks. */
export const productionAndGuarantees = parseContent(
  productionAndGuaranteesSchema,
  data,
  "data/content/site/sections/productionAndGuarantees.json",
);
