// src/components/ui/PortfolioCard.tsx
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PortfolioThumbnail } from '@/components/ui/PortfolioThumbnail';
import { content } from '@/types/content';
import type { PortfolioCase } from '@/types/portfolio';

interface PortfolioCardProps {
  item: PortfolioCase & { href: string };
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const { detailsLabel } = content.portfolio;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <PortfolioThumbnail
        href={item.href}
        image={item.images?.preview}
        title={item.title}
        category={item.category}
        gradient={item.gradient}
      />

      <div className="p-6">
        <h3 className="mb-2 text-lg font-semibold leading-snug text-foreground">{item.title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

        <div className="mb-5 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

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
