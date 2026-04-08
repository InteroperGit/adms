import { extractYearMonth } from './dateUtils';

export type ArticleType = 'portfolio' | 'news' | 'blog';

/** Minimal shape needed to generate an article href. */
export interface ArticleRef {
  slug: string;
  publishedAt: string;
}

/**
 * Build the URL for a single article depending on its type and optional category slug.
 *
 * @param type - The article type ('portfolio', 'news', or 'blog')
 * @param article - The article to generate the href for (must have `slug` and `publishedAt`)
 * @param category - The category slug (used only for 'portfolio' type; ignored for news/blog)
 * @returns The relative path to the article page
 *
 * @example
 * getArticleHref('news', { slug: 'update-2026', publishedAt: '2026-04-08' })
 * // => '/news/2026/04/update-2026'
 */
export function getArticleHref(type: ArticleType, article: ArticleRef, category: string): string {
  const { year, month } = extractYearMonth(article.publishedAt);
  switch (type) {
    case 'portfolio':
      return `/portfolio/${category}/${year}/${month}/${article.slug}`;
    case 'news':
      return `/news/${year}/${month}/${article.slug}`;
    case 'blog':
      return `/blog/${year}/${month}/${article.slug}`;
  }
}
