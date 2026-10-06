import data from '@/data/content/introduction.json';
import { introductionSchema } from '../validation/introduction';
import { parseContent } from '../validation/parse-content';

export const introduction = parseContent(
  introductionSchema,
  data,
  'data/content/introduction.json',
);
