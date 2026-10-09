import data from '@/data/content/business-solutions.json';
import { parseContent } from '../validation/parse-content';
import { businessSolutionsSchema } from '../validation/business-solutions';

/** Validated copy; attribution and media remain optional evidence metadata. */
export const businessSolutions = parseContent(
  businessSolutionsSchema,
  data,
  'data/content/business-solutions.json',
);
