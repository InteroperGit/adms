// src/components/ui/BreadCrumbs.tsx
import { ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { cn } from '@/lib/utils';

const pillBase =
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium sm:px-4 sm:py-1.5 sm:text-sm';

interface BreadCrumbItem {
  label: string;
  href?: string;
}

interface BreadCrumbsProps {
  items: BreadCrumbItem[];
}

export function BreadCrumbs({ items }: BreadCrumbsProps) {
  return (
    <div className="border-b border-border bg-background">
      <Container>
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 py-4">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <ChevronRight size={12} className="shrink-0 text-muted-foreground/40" />}
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={cn(pillBase, 'border-primary/20 bg-primary/5 text-primary')}
                  >
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.href}
                    className={cn(
                      pillBase,
                      'border-border bg-transparent text-muted-foreground',
                      'transition-all duration-200',
                      'hover:border-primary/20 hover:bg-primary/5 hover:text-primary'
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
