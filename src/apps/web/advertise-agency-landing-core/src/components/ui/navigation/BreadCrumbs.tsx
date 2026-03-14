// src/components/ui/BreadCrumbs.tsx
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { cn } from '@/libs/utils';

const pillBase =
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium sm:px-4 sm:py-1.5 sm:text-sm';

interface BreadCrumbItem {
  label: string;
  href?: string;
}

interface BreadCrumbsProps {
  items: BreadCrumbItem[];
}

/**
 * @component
 * @description Semantic breadcrumb navigation with pills styling and chevron separators
 * @param {BreadCrumbsProps} props
 * @param {BreadCrumbItem[]} props.items - Breadcrumb items with labels and optional hrefs
 * @returns {JSX.Element} Nav element with styled breadcrumb links
 * @example
 * <BreadCrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
 */
export function BreadCrumbs({ items }: BreadCrumbsProps) {
  return (
    <div className="border-b border-border dark:border-gray-700 bg-background">
      <Container>
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 py-4">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="shrink-0 mx-1">
                    {/* Separator uses explicit color tokens for visibility: gray-500 in light mode,
                        gray-400 in dark mode. Larger size (16px) ensures prominent display. */}
                    <ChevronRight size={16} className="text-gray-500 dark:text-gray-400" />
                  </span>
                )}
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={cn(
                      pillBase,
                      'border-primary/20 dark:border-primary/40 bg-primary/5 text-primary'
                    )}
                  >
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    className={cn(
                      pillBase,
                      'border-border dark:border-gray-600 bg-transparent text-muted-foreground',
                      'transition-all duration-200',
                      'hover:border-primary/20 dark:hover:border-primary/60 hover:bg-primary/5 hover:text-primary'
                    )}
                  >
                    {item.label}
                  </a>
                )}
              </span>
            );
          })}
        </nav>
      </Container>
    </div>
  );
}
