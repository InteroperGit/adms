import data from '@/data/content/reviews.json';
import { parseContent, reviewsSchema } from './schemas';

export const reviews = parseContent(reviewsSchema, data, 'data/content/reviews.json');
