import data from '@/data/content/offers.json';
import { offersSchema, parseContent } from './schemas';

export const offers = parseContent(offersSchema, data, 'data/content/offers.json');

/** Preserve editorial order; consumers use this list and respect offers.enabled separately. */
export const enabledOffers = offers.items.filter((item) => item.enabled);
