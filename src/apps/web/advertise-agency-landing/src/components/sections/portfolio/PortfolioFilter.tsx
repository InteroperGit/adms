// src/components/sections/portfolio/PortfolioFilter.tsx
import { cn } from '@/libs/utils';
import { AnimatedPillTabs, type AnimatedPillTabItem } from '@/components/ui/AnimatedPillTabs';

interface PortfolioFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

/**
 * @component
 * @description Category filter tabs for portfolio section with animated sliding pill indicator
 * @param {PortfolioFilterProps} props
 * @param {string[]} props.categories - List of category names to display as filter buttons
 * @param {string} props.active - Currently active/selected category name
 * @param {function} props.onChange - Callback fired with category name when user clicks a filter button
 * @returns {JSX.Element} Flexbox container with animated sliding pill and category buttons
 * @example <caption>Portfolio category filter</caption>
 * <PortfolioFilter categories={['All', 'Branding', 'Web']} active="All" onChange={setCategory} />
 */
export function PortfolioFilter({ categories, active, onChange }: PortfolioFilterProps) {
  const items: AnimatedPillTabItem[] = categories.map((category) => ({
    label: category,
    value: category,
  }));

  return (
    <AnimatedPillTabs
      items={items}
      activeValue={active}
      renderItem={(item, isActive) => (
        <button
          onClick={() => onChange(item.value)}
          className={cn(
            'relative z-10 cursor-pointer rounded-full',
            'px-3 py-1.5 sm:px-5 sm:py-2',
            'text-xs sm:text-sm font-medium',
            'transition-colors duration-200',
            isActive
              ? 'text-white'
              : 'border border-accent/40 text-muted-foreground hover:text-foreground'
          )}
        >
          {item.label}
        </button>
      )}
    />
  );
}
