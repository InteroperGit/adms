// src/components/sections/portfolio/PortfolioFilter.tsx
import { cn } from '@/libs/utils';

interface PortfolioFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

/**
 * @component
 * @description Category filter tabs for portfolio section. Displays category buttons with active/inactive styling and smooth transitions.
 * @param {PortfolioFilterProps} props
 * @param {string[]} props.categories - List of category names to display as filter buttons
 * @param {string} props.active - Currently active/selected category name
 * @param {function} props.onChange - Callback fired with category name when user clicks a filter button
 * @returns {JSX.Element} Flexbox container with centered category buttons
 * @example <caption>Portfolio category filter</caption>
 * <PortfolioFilter categories={['All', 'Branding', 'Web']} active="All" onChange={setCategory} />
 */
export function PortfolioFilter({ categories, active, onChange }: PortfolioFilterProps) {
  return (
    <div className="mb-10 flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={cn(
            'cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-5 sm:py-2 sm:text-sm',
            active === category
              ? 'bg-primary text-white shadow-sm'
              : 'border border-primary bg-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
