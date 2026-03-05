// src/components/ui/PortfolioThumbnail.tsx
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PortfolioThumbnailProps {
  href: string;
  image?: string;
  title: string;
  category: string;
  gradient: string;
}

export function PortfolioThumbnail({
  href,
  image,
  title,
  category,
  gradient,
}: PortfolioThumbnailProps) {
  return (
    <a
      href={href}
      className={cn(
        'group/thumb relative block h-40 cursor-pointer bg-gradient-to-br sm:h-52',
        gradient
      )}
    >
      {image ? (
        <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      )}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/thumb:bg-black/30" />
      <div className="absolute left-4 top-4">
        <Badge className="border-0 bg-white/20 text-white backdrop-blur-sm">{category}</Badge>
      </div>
    </a>
  );
}
