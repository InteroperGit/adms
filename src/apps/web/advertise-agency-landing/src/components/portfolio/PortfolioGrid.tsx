// src/components/portfolio/PortfolioGrid.tsx
import { useRef } from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { PortfolioCard } from '@/components/ui/portfolio/PortfolioCard';
import { CategoryNav } from '@/components/portfolio/CategoryNav';
import { Pagination } from '@/components/portfolio/Pagination';
import { portfolioConfig } from '@/types/config/portfolioConfig';
import type { PortfolioCase, PortfolioCaseWithHref } from '@/types/portfolio';
import { extractYearMonth } from '@/libs/dateUtils';

interface PortfolioGridProps {
  /**
   * Portfolio cases to display, pre-filtered by the parent page component.
   * The grid slices this array for the current page; it does not filter internally.
   */
  items: PortfolioCase[];
  /**
   * Category slug for the currently active route, used to construct per-case hrefs.
   *
   * - `null` — root `/portfolio` listing; hrefs use `"all"` as the category segment.
   * - `"all"` — explicit all-cases route; hrefs also use `"all"`.
   * - Any other value — a specific category slug (e.g. `"branding"`).
   *
   * Hrefs are built as `/portfolio/{activeSlug ?? 'all'}/{year}/{month}/{slug}`.
   */
  activeSlug: string | null;
}

/**
 * Complete portfolio listing view: category filter tabs, paginated case grid, and a contact CTA.
 *
 * **Pagination** is stored in the `?page` URL search param so that:
 * - Deep links to page N work correctly after SSG pre-render.
 * - The browser back button returns to the correct page without a full navigation.
 * - Changing page triggers a smooth scroll to the top of the grid via `gridRef`.
 *
 * Page derivation is guarded against stale/out-of-range values:
 * - `page` is clamped to `≥ 1` (guards against `NaN` and `0`).
 * - `safePage` is clamped to `≤ totalPages` (guards against URL tampering).
 * - Page 1 omits the `?page` param entirely for clean canonical URLs.
 *
 * **Href construction** — `extractYearMonth` derives `year` and `month` from each
 * case's `publishedAt` so the URL matches the file-system path in `data/portfolio/`.
 *
 * **Empty state** — when `items` is empty (e.g. a category with no cases), a full-width
 * centred message is rendered using `portfolioConfig.emptyLabel`.
 *
 * All labels (`prevLabel`, `nextLabel`, `pageLabel`, `emptyLabel`, `cta`) come from
 * `portfolioConfig` (`data/config/portfolio.json`) for white-label localisation.
 *
 * @param props - See {@link PortfolioGridProps}.
 * @returns A React fragment containing `<CategoryNav>`, the grid, optional `<Pagination>`,
 *   and a contact CTA button.
 *
 * @example
 * // All cases, root listing:
 * <PortfolioGrid items={allPortfolioCases} activeSlug={null} />
 *
 * @example
 * // Filtered to a single category:
 * <PortfolioGrid items={brandingCases} activeSlug="branding" />
 */
export function PortfolioGrid({ items, activeSlug }: PortfolioGridProps) {
  const cfg = portfolioConfig;
  const [searchParams, setSearchParams] = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);

  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const totalPages = Math.max(1, Math.ceil(items.length / cfg.perPage));
  const safePage = Math.min(page, totalPages);
  const paged = items.slice((safePage - 1) * cfg.perPage, safePage * cfg.perPage);

  const withHref: PortfolioCaseWithHref[] = paged.map((item) => {
    const { year, month } = extractYearMonth(item.publishedAt);
    return {
      ...item,
      href: `/portfolio/${activeSlug ?? 'all'}/${year}/${month}/${item.slug}`,
    };
  });

  function setPage(next: number) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next > 1) {
        params.set('page', String(next));
      } else {
        params.delete('page');
      }
      return params;
    });
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <CategoryNav activeSlug={activeSlug} />

      <div
        key={activeSlug ?? 'all'}
        ref={gridRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
      >
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
