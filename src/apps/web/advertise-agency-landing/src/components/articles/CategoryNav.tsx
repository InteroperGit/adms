// src/components/articles/CategoryNav.tsx
import { Link } from 'react-router';
import { cn } from '@/libs/utils';
import { AnimatedPillTabs, type AnimatedPillTabItem } from '@/components/ui/AnimatedPillTabs';

const DEFAULT_CATEGORY = 'all';

interface CategoryNavProps {
  /**
   * Slug of the currently active category route segment.
   *
   * - `null` — user is on the root listing page (maps to the "All" tab).
   * - `"all"` — user is on the explicit all-cases route (also maps to "All").
   * - Any other string — must match a `slug` from `categories` config.
   */
  activeSlug: string | null;
  /** Base path for category hrefs, e.g. "/portfolio", "/services" */
  basePath: string;
  /** Category definitions */
  categories: Array<{ name: string; slug: string }>;
  /** Label for the "All" tab */
  allLabel: string;
}

/** Extends `AnimatedPillTabItem` with the navigation target for each tab. */
interface CategoryTabItem extends AnimatedPillTabItem {
  /** Absolute href for the React Router `<Link>`. */
  href: string;
}

/**
 * Animated category filter tabs rendered on article listing pages with category taxonomies.
 *
 * Builds a tab list from the `categories` prop, prepending an "All" entry pointing to `basePath`.
 *
 * @param props - See {@link CategoryNavProps}.
 * @returns An `AnimatedPillTabs` container with one `<Link>` per category plus "All".
 *
 * @example
 * // Portfolio:
 * <CategoryNav activeSlug="branding" basePath="/portfolio" categories={categories} allLabel="Все" />
 */
export function CategoryNav({ activeSlug, basePath, categories, allLabel }: CategoryNavProps) {
  const activeValue = activeSlug && activeSlug !== DEFAULT_CATEGORY ? activeSlug : DEFAULT_CATEGORY;

  const items: CategoryTabItem[] = [
    {
      label: allLabel,
      value: DEFAULT_CATEGORY,
      href: basePath,
    },
    ...categories.map((category) => ({
      label: category.name,
      value: category.slug,
      href: `${basePath}/${category.slug}`,
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
