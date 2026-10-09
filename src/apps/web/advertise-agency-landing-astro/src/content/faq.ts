import data from '@/data/content/faq.json';
import { faqSchema } from '../validation/faq';
import { parseContent } from '../validation/parse-content';

/** Draft copy is reusable; consumers must apply the publication helper. */
export const faq = parseContent(faqSchema, data, 'data/content/faq.json');
