// src/components/sections/portfolio/PortfolioFilter.tsx
import { cn } from '@/lib/utils';

interface PortfolioFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

export function PortfolioFilter({ categories, active, onChange }: PortfolioFilterProps) {
  return (
    <div className="mb-10 flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-5 sm:py-2 sm:text-sm',
            active === category
              ? 'bg-primary text-white shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
