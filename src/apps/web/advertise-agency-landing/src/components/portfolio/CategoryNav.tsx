// src/components/portfolio/CategoryNav.tsx
import { Link } from 'react-router';
import { cn } from '@/libs/utils';
import { AnimatedPillTabs, type AnimatedPillTabItem } from '@/components/ui/AnimatedPillTabs';
import { categories } from '@/types/config/categories';
import { portfolioConfig } from '@/types/config/portfolioConfig';

interface CategoryNavProps {
  activeSlug: string | null; // null = /portfolio, "all" = /portfolio/all, etc.
}

interface CategoryTabItem extends AnimatedPillTabItem {
  href: string;
}

/**
 * @component
 * @description Navigation tabs for filtering portfolio cases by category with animated sliding pill indicator
 * @param {CategoryNavProps} props
 * @param {string | null} props.activeSlug - Current category slug; null or "all" highlights the "All" tab
 * @returns {JSX.Element} Horizontal flex layout with "All" and category filter buttons with sliding pill
 * @example <caption>Portfolio filter tabs</caption>
 * <CategoryNav activeSlug="branding" />
 */
export function CategoryNav({ activeSlug }: CategoryNavProps) {
  const allActive = activeSlug === null || activeSlug === 'all';
  const activeValue = allActive ? 'all' : activeSlug || 'all';

  const items: CategoryTabItem[] = [
    {
      label: portfolioConfig.allLabel,
      value: 'all',
      href: '/portfolio',
    },
    ...categories.map((category) => ({
      label: category.name,
      value: category.slug,
      href: `/portfolio/${category.slug}`,
    })),
  ];

  return (
    <AnimatedPillTabs
      items={items}
      activeValue={activeValue}
      renderItem={(item, isActive) => (
        <Link
          to={(item as CategoryTabItem).href}
          className={cn(
            'relative z-10 inline-flex items-center rounded-full',
            'px-3 py-1.5 sm:px-5 sm:py-2',
            'text-xs sm:text-sm font-medium',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-primary focus-visible:ring-offset-1',
            isActive
              ? 'border border-transparent text-white'
              : 'border border-accent/40 text-muted-foreground hover:text-foreground'
          )}
        >
          {item.label}
        </Link>
      )}
    />
  );
}
