import raw from '@data/config/categories.json';

export interface Category {
  name: string; // display name, matches PortfolioCase.category
  slug: string; // URL segment, e.g. "branding"
}

export const categories = raw satisfies Category[];
