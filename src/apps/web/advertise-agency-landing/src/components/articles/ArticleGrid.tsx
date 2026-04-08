// src/components/articles/ArticleGrid.tsx
import { useRef } from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { CategoryNav } from './CategoryNav';
import { Pagination } from './Pagination';
import { ArticleCard } from './ArticleCard';
import type { BaseArticle } from '@/types/articles/article';
import { paginationConfig } from '@/types/config/paginationConfig';

interface ArticleGridProps {
  /** Articles to display */
  items: BaseArticle[];
  /** Build href for an article */
  articleHref: (article: BaseArticle) => string;
  /** Label for "Details" link */
  detailsLabel: string;
  /** Base path for hrefs and category nav */
  basePath: string;
  /** CTA button after grid; omit for no CTA */
  cta?: { label: string; href: string };
  /** Label when no articles match */
  emptyLabel: string;
  /** Items per page */
  perPage: number;
  // Category nav (optional):
  /** Categories for optional tabs */
  categories?: Array<{ name: string; slug: string }>;
  /** Label for "All" category tab (used when categories provided) */
  allLabel?: string;
  /** Active category slug (used when categories provided) */
  activeSlug?: string | null;
}

/**
 * Complete article listing view: optional category filter tabs, paginated card grid, and an optional contact CTA.
 *
 * **Category nav** — shown when `categories` prop is provided (e.g. portfolio).
 * Omitted when `categories` is undefined (e.g. news, blog).
 *
 * **Pagination** stored in `?page` URL search param.
 * Page 1 omits the `?page` param for clean canonical URLs.
 *
 * Page derivation is guarded against stale/out-of-range values:
 * - `page` is clamped to `≥ 1`
 * - `safePage` is clamped to `≤ totalPages`
 *
 * @example
 * // Portfolio with category tabs:
 * <ArticleGrid
 *   items={filteredCases}
 *   articleHref={buildHref}
 *   detailsLabel="Подробнее"
 *   basePath="/portfolio"
 *   cta={{ label: "Contact", href: "/contact" }}
 *   emptyLabel="No projects yet"
 *   perPage={6}
 *   categories={categories}
 *   allLabel="All"
 *   activeSlug={categorySlug}
 * />
 *
 * @example
 * // News/Blog without categories:
 * <ArticleGrid
 *   items={pagedNews}
 *   articleHref={(a) => `/news/${a.slug}`}
 *   detailsLabel="Read"
 *   basePath="/news"
 *   emptyLabel="No articles"
 *   perPage={12}
 * />
 */
export function ArticleGrid({
  items,
  articleHref,
  detailsLabel,
  basePath,
  cta,
  emptyLabel,
  perPage,
  categories,
  allLabel,
  activeSlug,
}: ArticleGridProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);

  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = items.slice((safePage - 1) * perPage, safePage * perPage);

  const withHref = paged.map((item) => ({
    ...item,
    href: articleHref(item),
  }));

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
      {categories && (
        <CategoryNav
          activeSlug={activeSlug ?? null}
          basePath={basePath}
          categories={categories}
          allLabel={allLabel ?? 'All'}
        />
      )}

      <div
        key={activeSlug ?? 'all'}
        ref={gridRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
      >
        {withHref.length > 0 ? (
          withHref.map((item) => (
            <ArticleCard key={item.slug} article={item} detailsLabel={detailsLabel} />
          ))
        ) : (
          <p className="col-span-full py-16 text-center text-muted-foreground">{emptyLabel}</p>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          current={safePage}
          total={totalPages}
          prevLabel={paginationConfig.prevLabel}
          nextLabel={paginationConfig.nextLabel}
          pageLabel={paginationConfig.pageLabel}
          onPrev={() => setPage(safePage - 1)}
          onNext={() => setPage(safePage + 1)}
        />
      )}

      {cta && (
        <div className="mt-14 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 hover:bg-muted hover:text-primary"
          >
            <a href={cta.href}>{cta.label}</a>
          </Button>
        </div>
      )}
    </>
  );
}
