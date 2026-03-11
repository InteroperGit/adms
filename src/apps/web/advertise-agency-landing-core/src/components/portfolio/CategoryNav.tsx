// src/components/portfolio/CategoryNav.tsx
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { categories } from '@/types/config/categories';
import { portfolioConfig } from '@/types/config/portfolioConfig';

interface CategoryNavProps {
  activeSlug: string | null; // null = /portfolio, "all" = /portfolio/all, etc.
}

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
