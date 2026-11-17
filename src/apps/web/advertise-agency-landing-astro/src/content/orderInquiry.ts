import data from "@/data/content/site/pages/orderInquiry.json";
import { orderInquirySchema } from "../validation/orderInquiry";
import { parseContent } from "../validation/parseContent";

export const orderInquiry = parseContent(
  orderInquirySchema,
  data,
  "data/content/site/pages/orderInquiry.json",
);
