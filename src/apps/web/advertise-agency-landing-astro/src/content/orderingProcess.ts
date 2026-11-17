import data from "@/data/content/site/sections/orderingProcess.json";
import { orderingProcessSchema } from "../validation/orderingProcess";
import { parseContent } from "../validation/parseContent";

/** Draft copy is available to implementation but is not approved. */
export const orderingProcess = parseContent(
  orderingProcessSchema,
  data,
  "data/content/site/sections/orderingProcess.json",
);
