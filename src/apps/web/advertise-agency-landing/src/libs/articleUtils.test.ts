import { describe, it, expect } from 'vitest';
import { getArticleHref, type ArticleRef } from './articleUtils';

function makeArticle(slug: string, publishedAt: string): ArticleRef {
  return { slug, publishedAt };
}

describe('getArticleHref()', () => {
  it('should return portfolio path with category slug', () => {
    const article = makeArticle('artplex', '2023-03-01');
    expect(getArticleHref('portfolio', article, 'branding')).toBe(
      '/portfolio/branding/2023/03/artplex'
    );
  });

  it('should return portfolio path with "all" as category', () => {
    const article = makeArticle('mobibank', '2023-09-15');
    expect(getArticleHref('portfolio', article, 'all')).toBe('/portfolio/all/2023/09/mobibank');
  });

  it('should return news path without category', () => {
    const article = makeArticle('company-update', '2026-04-08');
    expect(getArticleHref('news', article, 'ignored')).toBe('/news/2026/04/company-update');
  });

  it('should return blog path without category', () => {
    const article = makeArticle('design-trends', '2026-01-22');
    expect(getArticleHref('blog', article, 'ignored')).toBe('/blog/2026/01/design-trends');
  });

  it('should handle single-digit months (01)', () => {
    const article = makeArticle('jan-post', '2024-01-10');
    expect(getArticleHref('news', article, '')).toBe('/news/2024/01/jan-post');
  });

  it('should handle december (12)', () => {
    const article = makeArticle('dec-post', '2025-12-25');
    expect(getArticleHref('blog', article, '')).toBe('/blog/2025/12/dec-post');
  });
});
