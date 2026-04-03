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
 * infers type from file path, validates against the matching extended schema,
 * and exports type-filtered arrays for listing pages.
 */

const ARTICLE_SCHEMAS = {
  portfolio: PortfolioArticleSchema,
  service: ServiceArticleSchema,
  news: NewsArticleSchema,
  blog: BlogArticleSchema,
} as const;

const ARTICLE_TYPE_PATTERN =
  /^(?<type>portfolio|service|news|blog)(?:\/(?<category>[^/]+))?\/(?<year>\d{4})\/(?<month>\d{2})\/\d{4}_\d{2}_\d{2}_(?<slug>[^/]+)\.json$/;

interface ArticleModule {
  publishedAt?: string;
  slug?: string;
  [key: string]: unknown;
}

interface ParsedPath {
  type: ArticleType;
  category?: string;
  year: string;
  month: string;
  slug: string;
}

const parseArticlePath = (filePath: string): ParsedPath | null => {
  const match = ARTICLE_TYPE_PATTERN.exec(filePath);
  if (!match?.groups) {
    return null;
  }

  return {
    type: match.groups.type as ArticleType,
    category: match.groups.category,
    year: match.groups.year,
    month: match.groups.month,
    slug: match.groups.slug,
  };
};

const modules = import.meta.glob<ArticleModule>(
  ['@data/articles/**/*.json', '@data/content/portfolio/**/*.json'],
  { eager: true, import: 'default' }
);

const normalizeArticle = (
  rawData: ArticleModule,
  filePath: string
): [string, BaseArticle & { type: ArticleType }] | null => {
  const pathInfo = parseArticlePath(filePath);
  if (!pathInfo) {
    return null;
  }

  if (!rawData.publishedAt) {
    throw new Error(`Missing required field "publishedAt" in ${filePath}`);
  }

  const parsed = ARTICLE_SCHEMAS[pathInfo.type].parse(rawData) as BaseArticle & {
    type: ArticleType;
  };
  parsed.type = pathInfo.type;

  return [parsed.slug, parsed];
};

export const articleMap: Record<string, BaseArticle & { type: ArticleType }> = Object.fromEntries(
  Object.entries(modules)
    .map(([path, data]) => normalizeArticle(data, path))
    .filter((x): x is [string, BaseArticle & { type: ArticleType }] => x !== null)
);

export const allArticles = Object.values(articleMap);
export const allPortfolioArticles = allArticles.filter((a) => a.type === 'portfolio');
export const allServiceArticles = allArticles.filter((a) => a.type === 'service');
export const allNewsArticles = allArticles.filter((a) => a.type === 'news');
export const allBlogArticles = allArticles.filter((a) => a.type === 'blog');
