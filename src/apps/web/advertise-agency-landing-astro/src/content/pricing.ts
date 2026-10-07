import data from '@/data/content/pricing.json';
import { projects } from './projects';
import { createPricingSchema } from '../validation/pricing';
import { parseContent } from '../validation/parse-content';
import {
  getPublishedPricingExamples,
  getVisiblePricingExamples,
} from './pricing-publication';

// Project records supply the IDs used by the existing dynamic project route.
export const pricing = parseContent(
  createPricingSchema(projects.map((project) => `/projects/${project.id}`)),
  data,
  'data/content/pricing.json',
);

export const publishedPricingExamples = getPublishedPricingExamples(pricing);
export const visiblePricingExamples = getVisiblePricingExamples(pricing);
export { formatPricingPrice } from './pricing-publication';
