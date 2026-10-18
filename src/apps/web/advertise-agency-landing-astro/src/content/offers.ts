import data from '@/data/content/config/offers.json';
import { offersSchema } from '../validation/offers';
import { parseContent } from '../validation/parse-content';

export const offers = parseContent(
  offersSchema, data, 'data/content/config/offers.json',
);

/** Preserve editorial order; consumers filter enabled items separately. */
export const enabledOffers = offers.items.filter((item) => item.enabled);
