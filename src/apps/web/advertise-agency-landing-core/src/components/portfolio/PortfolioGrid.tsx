// src/components/portfolio/PortfolioGrid.tsx
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PortfolioCard } from '@/components/ui/portfolio/PortfolioCard';
import { CategoryNav } from '@/components/portfolio/CategoryNav';
import { Pagination } from '@/components/portfolio/Pagination';
import { portfolioConfig } from '@/types/config/portfolioConfig';
import type { PortfolioCase } from '@/types/portfolio';
import { extractYearMonth } from '@/lib/dateUtils';

interface PortfolioGridProps {
  items: PortfolioCase[];
  activeSlug: string | null; // current category slug, used to build case hrefs
}

/**
 * @component
 * @description Complete portfolio listing with category filter, paginated grid, and call-to-action
 * @param {PortfolioGridProps} props
 * @param {PortfolioCase[]} props.items - Array of portfolio cases to display
 * @param {string | null} props.activeSlug - Current category filter; null for all cases
 * @returns {JSX.Element} Category nav, paginated case grid, pagination controls, and contact CTA
 * @example <caption>Portfolio page listing</caption>
 * <PortfolioGrid items={allCases} activeSlug="branding" />
 */
export function PortfolioGrid({ items, activeSlug }: PortfolioGridProps) {
  const cfg = portfolioConfig;
  const [searchParams, setSearchParams] = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);

  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const totalPages = Math.max(1, Math.ceil(items.length / cfg.perPage));
  const safePage = Math.min(page, totalPages);
  const paged = items.slice((safePage - 1) * cfg.perPage, safePage * cfg.perPage);

  const withHref = paged.map((item) => {
    const { year, month } = extractYearMonth(item.publishDate);
    return {
      ...item,
      href: `/portfolio/${activeSlug ?? 'all'}/${year}/${month}/${item.slug}`,
    };
  });

  function setPage(next: number) {
    const params: Record<string, string> = {};
    if (next > 1) {
      params.page = String(next);
    }
    setSearchParams(params);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <CategoryNav activeSlug={activeSlug} />

      <div ref={gridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {withHref.length > 0 ? (
          withHref.map((item) => <PortfolioCard key={item.slug} item={item} />)
        ) : (
          <p className="col-span-full py-16 text-center text-muted-foreground">{cfg.emptyLabel}</p>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          current={safePage}
          total={totalPages}
          prevLabel={cfg.prevLabel}
          nextLabel={cfg.nextLabel}
          pageLabel={cfg.pageLabel}
          onPrev={() => setPage(safePage - 1)}
          onNext={() => setPage(safePage + 1)}
        />
      )}

      <div className="mt-14 text-center">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-full px-8 hover:bg-muted hover:text-primary"
        >
          <a href={cfg.cta.href}>{cfg.cta.label}</a>
        </Button>
      </div>
    </>
  );
}
