// src/components/portfolio/CategoryNav.tsx
import { Link } from 'react-router-dom';
import { cn } from '@/libs/utils';
import { categories } from '@/types/config/categories';
import { portfolioConfig } from '@/types/config/portfolioConfig';

interface CategoryNavProps {
  activeSlug: string | null; // null = /portfolio, "all" = /portfolio/all, etc.
}

/**
 * @component
 * @description Navigation tabs for filtering portfolio cases by category
 * @param {CategoryNavProps} props
 * @param {string | null} props.activeSlug - Current category slug; null or "all" highlights the "All" tab
 * @returns {JSX.Element} Horizontal flex layout with "All" and category filter buttons
 * @example <caption>Portfolio filter tabs</caption>
 * <CategoryNav activeSlug="branding" />
 */
export function CategoryNav({ activeSlug }: CategoryNavProps) {
  const allActive = activeSlug === null || activeSlug === 'all';

  return (
    <div className="mb-10 flex flex-wrap justify-center gap-2">
      <Link
        to="/portfolio"
        className={cn(
          'rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-5 sm:py-2 sm:text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
          allActive
            ? 'bg-primary text-white shadow-sm'
            : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
        )}
      >
        {portfolioConfig.allLabel}
      </Link>

      {categories.map((category) => (
        <Link
          key={category.slug}
          to={`/portfolio/${category.slug}`}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-5 sm:py-2 sm:text-sm',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
            activeSlug === category.slug
              ? 'bg-primary text-white shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
