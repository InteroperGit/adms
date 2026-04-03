import type { BaseArticle, ArticleType } from './article';
import {
  PortfolioArticleSchema,
  ServiceArticleSchema,
  NewsArticleSchema,
  BlogArticleSchema,
} from '.';

/**
 * @module articles/allArticles
 * @description Unified article loader — glob-loads all article JSON across types,
 * validates against the matching extended schema (selected by `type` field in data),
 * and exports type-filtered arrays for listing pages.
 */

const ARTICLE_SCHEMAS = {
  portfolio: PortfolioArticleSchema,
  service: ServiceArticleSchema,
  news: NewsArticleSchema,
  blog: BlogArticleSchema,
} as const;

interface ArticleModule {
  type?: ArticleType;
  publishedAt?: string;
  slug?: string;
  [key: string]: unknown;
}

const modules = import.meta.glob<ArticleModule>(
  ['@data/articles/**/*.json', '@data/content/portfolio/**/*.json'],
  { eager: true, import: 'default' }
);

const normalizeArticle = (rawData: ArticleModule): [string, BaseArticle] | null => {
  if (!rawData.type || !ARTICLE_SCHEMAS[rawData.type]) {
    return null;
  }

  const schema = ARTICLE_SCHEMAS[rawData.type];
  const parsed = schema.parse(rawData) as BaseArticle;

  return [parsed.slug, parsed];
};

export const articleMap: Record<string, BaseArticle> = Object.fromEntries(
  Object.entries(modules)
    .map(([, data]) => normalizeArticle(data))
    .filter((x): x is [string, BaseArticle] => x !== null)
);

export const allArticles = Object.values(articleMap);
export const allPortfolioArticles = allArticles.filter((a) => a.type === 'portfolio');
export const allServiceArticles = allArticles.filter((a) => a.type === 'service');
export const allNewsArticles = allArticles.filter((a) => a.type === 'news');
export const allBlogArticles = allArticles.filter((a) => a.type === 'blog');
