// src/components/ui/PortfolioThumbnail.tsx
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

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
        <OptimizedImage
          src={image}
          alt={title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="absolute inset-0 h-full w-full object-cover"
          dev={import.meta.env.DEV}
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
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/thumb:bg-black/30" />
      <div className="absolute left-4 top-4">
        <Badge className="border-0 bg-black/50 text-white backdrop-blur-sm">{category}</Badge>
      </div>
    </a>
  );
}
