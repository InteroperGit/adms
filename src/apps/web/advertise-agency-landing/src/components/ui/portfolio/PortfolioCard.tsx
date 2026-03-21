// src/components/ui/PortfolioCard.tsx
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/libs/utils';
import { PortfolioThumbnail } from '@/components/ui/portfolio/PortfolioThumbnail';
import { portfolioSectionContent } from '@/types/portfolio';
import type { PortfolioCaseWithHref } from '@/types/portfolio';

interface PortfolioCardProps {
  item: PortfolioCaseWithHref;
}

/**
 * @component
 * @description Portfolio case card with thumbnail, title, description, tags and details link
 * @param {PortfolioCardProps} props
 * @param {PortfolioCaseWithHref} props.item - Case data with computed href
 * @returns {JSX.Element} Card article with hover animation
 * @example
 * <PortfolioCard item={{ ...caseData, href: "/portfolio/all/case-slug" }} />
 */
export function PortfolioCard({ item }: PortfolioCardProps) {
  const { detailsLabel } = portfolioSectionContent;

  return (
    <article
      className={cn(
        'group h-full flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm',
        'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'
      )}
    >
      <PortfolioThumbnail
        href={item.href}
        image={item.images?.preview}
        title={item.title}
        category={item.category}
        gradient={item.hero.gradient}
      />

      <div className="flex flex-col flex-grow p-6">
        <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground">{item.title}</h3>
        <p className="mb-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <a
          href={item.href}
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
