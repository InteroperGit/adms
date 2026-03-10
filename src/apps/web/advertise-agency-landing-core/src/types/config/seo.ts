import data from '@data/config/seo.json';

export interface SeoConfig {
  siteUrl: string;
  siteName: string;
  locale: string;
  twitterCard: string;
  defaultOgImage: string;
}

export const seoConfig = data satisfies SeoConfig;
