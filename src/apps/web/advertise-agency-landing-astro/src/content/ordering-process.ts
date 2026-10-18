import data from '@/data/content/config/ordering-process.json';
import { orderingProcessSchema } from '../validation/ordering-process';
import { parseContent } from '../validation/parse-content';

/** Draft copy is available to implementation but is not approved. */
export const orderingProcess = parseContent(
  orderingProcessSchema,
  data,
  'data/content/config/ordering-process.json',
);
