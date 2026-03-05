// src/components/ui/PortfolioCard.tsx
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { content } from '@/lib/content';
import { cn } from '@/lib/utils';
import type { PortfolioCase } from '@/types/portfolio';

interface PortfolioCardProps {
  item: PortfolioCase & { href: string };
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const { detailsLabel } = content.portfolio;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Thumbnail */}
      <a
        href={item.href}
        className={cn(
          'group/thumb relative block h-40 cursor-pointer bg-gradient-to-br sm:h-52',
          item.gradient
        )}
      >
        {item.images?.preview ? (
          <img
            src={item.images.preview}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
        )}
        {/* Dark hover overlay */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/thumb:bg-black/30" />
        {/* Category badge */}
        <div className="absolute left-4 top-4">
          <Badge className="border-0 bg-white/20 text-white backdrop-blur-sm">
            {item.category}
          </Badge>
        </div>
      </a>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground">{item.title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

        {/* Tags */}
        <div className="mb-5 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Link */}
        <a
          href={item.href}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-primary transition-all duration-200 hover:gap-2.5 hover:bg-primary/10"
        >
          {detailsLabel}
          <ArrowRight size={14} />
        </a>
      </div>
    </article>
  );
}
