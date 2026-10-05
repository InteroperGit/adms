import data from '@/data/content/offers.json';
import { offersSchema } from '../validation/offers';
import { parseContent } from '../validation/parse-content';

export const offers = parseContent(offersSchema, data, 'data/content/offers.json');

/** Preserve editorial order; consumers use this list and respect offers.enabled separately. */
export const enabledOffers = offers.items.filter((item) => item.enabled);
