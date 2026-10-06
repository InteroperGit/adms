import data from '@/data/content/order-inquiry.json';
import { orderInquirySchema } from '../validation/order-inquiry';
import { parseContent } from '../validation/parse-content';

export const orderInquiry = parseContent(
  orderInquirySchema,
  data,
  'data/content/order-inquiry.json',
);
