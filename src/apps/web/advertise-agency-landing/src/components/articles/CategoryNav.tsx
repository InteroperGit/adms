// src/components/articles/CategoryNav.tsx
import { Link } from 'react-router';
import { cn } from '@/libs/utils';
import { AnimatedPillTabs, type AnimatedPillTabItem } from '@/components/ui/AnimatedPillTabs';
import { categories } from '@/types/config/categories';
import { portfolioConfig } from '@/types/config/portfolioConfig';

interface CategoryNavProps {
  /**
   * Slug of the currently active category route segment.
   *
   * - `null` — user is on the root `/portfolio` page (maps to the "All" tab).
   * - `"all"` — user is on `/portfolio/all` (also maps to the "All" tab).
   * - Any other string — must match a `slug` from `categories` config.
   */
  activeSlug: string | null;
}

/** Extends `AnimatedPillTabItem` with the navigation target for each tab. */
interface CategoryTabItem extends AnimatedPillTabItem {
  /** Absolute href for the React Router `<Link>`. */
  href: string;
}

/**
 * Animated category filter tabs rendered on all portfolio listing pages.
 *
 * Builds a tab list from the `categories` config, prepending a hard-coded "All"
 * entry pointing to `/portfolio`. The list is passed to `AnimatedPillTabs` which
 * manages a sliding pill indicator that animates between the active tab's position.
 *
 * Each tab is rendered as a React Router `<Link>` (client-side navigation). Active
 * styling (`text-white`, transparent border) is set when `item.value === activeValue`;
 * inactive tabs show a muted accent border.
 *
 * The `CategoryTabItem` interface is a local extension of `AnimatedPillTabItem` that
 * adds `href`. It is required so TypeScript can resolve `item.href` inside `renderItem`
 * without a cast — removing it would widen the type to the base interface, losing `href`.
 *
 * @param props - See {@link CategoryNavProps}.
 * @returns An `AnimatedPillTabs` container with one `<Link>` per category plus "All".
 *
 * @example
 * // On /portfolio/branding — "Branding" tab is active:
 * <CategoryNav activeSlug="branding" />
 *
 * @example
 * // On /portfolio or /portfolio/all — "All" tab is active:
 * <CategoryNav activeSlug={null} />
 */
export function CategoryNav({ activeSlug }: CategoryNavProps) {
  const activeValue = activeSlug && activeSlug !== 'all' ? activeSlug : 'all';

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
    <AnimatedPillTabs<CategoryTabItem>
      items={items}
      activeValue={activeValue}
      renderItem={(item, isActive) => (
        <Link
          to={item.href}
          className={cn(
            'relative z-10 inline-flex items-center rounded-full',
            'px-3 py-1.5 sm:px-5 sm:py-2',
            'text-xs sm:text-sm font-medium',
            'transition-colors duration-200',
            'focus-ring',
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
