import data from '@/data/content/reviews.json';
import { reviewsSchema } from '../validation/reviews';
import { parseContent } from '../validation/parse-content';

export const reviews = parseContent(reviewsSchema, data, 'data/content/reviews.json');
