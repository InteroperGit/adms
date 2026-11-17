import data from "@/data/content/site/pages/orderInquiry.json";
import { orderInquirySchema } from "../validation/order-inquiry";
import { parseContent } from "../validation/parse-content";

export const orderInquiry = parseContent(
  orderInquirySchema,
  data,
  "data/content/site/pages/orderInquiry.json",
);
