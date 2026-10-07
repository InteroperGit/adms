import data from '@/data/content/pricing.json';
import { projects } from './projects';
import { createPricingSchema } from '../validation/pricing';
import { parseContent } from '../validation/parse-content';
import {
  getPublishedPricingExamples,
  getVisiblePricingExamples,
} from './pricing-publication';

// Genuine prices may link only to generated, approved agency case routes.
// Demo destinations exist for previews but cannot substantiate real prices.
export const pricing = parseContent(
  createPricingSchema(projects
    .filter((project) => project.status === 'published')
    .map((project) => `/projects/${project.id}`)),
  data,
  'data/content/pricing.json',
);

export const publishedPricingExamples = getPublishedPricingExamples(pricing);
export const visiblePricingExamples = getVisiblePricingExamples(pricing);
export { formatPricingPrice } from './pricing-publication';
