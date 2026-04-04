// src/components/articles/ArticleCard.tsx
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/libs/utils';
import { ArticleThumbnail } from '@/components/ui/article/ArticleThumbnail';
import type { BaseArticle } from '@/types/articles/article';

interface ArticleCardProps {
  article: BaseArticle & { href: string };
  detailsLabel: string;
}

/**
 * @component
 * @description Generic article card with thumbnail, title, description, tags and details link.
 *   Used by ArticleGrid to render portfolio, news, blog, and service articles.
 * @param {ArticleCardProps} props
 * @param {BaseArticle & { href: string }} props.article - Article data with computed href
 * @param {string} props.detailsLabel - Label for the details link
 * @returns {JSX.Element} Card article with hover animation
 */
export function ArticleCard({ article, detailsLabel }: ArticleCardProps) {
  return (
    <article
      data-testid="article-card"
      className={cn(
        'group h-full flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm',
        'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'
      )}
    >
      <ArticleThumbnail
        href={article.href}
        image={article.images?.preview}
        title={article.title}
        category={article.category}
        gradient={article.hero.gradient}
      />

      <div className="flex flex-col flex-grow p-6">
        <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground">{article.title}</h3>
        <p className="mb-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
          {article.description}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <a
          href={article.href}
          className={cn(
            'mt-auto inline-flex items-center gap-1.5 rounded-full',
            'px-3 py-1.5 text-sm font-medium text-primary',
            'transition-all duration-200 hover:gap-2.5 hover:bg-primary/10',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-primary focus-visible:ring-offset-1'
          )}
        >
          {detailsLabel}
          <ArrowRight size={14} />
        </a>
      </div>
    </article>
  );
}
