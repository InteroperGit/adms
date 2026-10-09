import data from '@/data/content/production-and-guarantees.json';
import { parseContent } from '../validation/parse-content';
import {
  productionAndGuaranteesSchema,
} from '../validation/production-and-guarantees';

/** Validate guidance and keep agency claims subject to publication checks. */
export const productionAndGuarantees = parseContent(
  productionAndGuaranteesSchema,
  data,
  'data/content/production-and-guarantees.json',
);
