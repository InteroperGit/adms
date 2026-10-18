import data from '@/data/content/config/order-inquiry.json';
import { orderInquirySchema } from '../validation/order-inquiry';
import { parseContent } from '../validation/parse-content';

export const orderInquiry = parseContent(
  orderInquirySchema,
  data,
  'data/content/config/order-inquiry.json',
);
