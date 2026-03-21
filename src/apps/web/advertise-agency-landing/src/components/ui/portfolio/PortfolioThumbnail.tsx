// src/components/ui/PortfolioThumbnail.tsx
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/libs/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface PortfolioThumbnailProps {
  href: string;
  image?: string;
  title: string;
  category: string;
  gradient: string;
}

/**
 * @component
 * @description Portfolio case thumbnail with gradient background, optional image, category badge and hover overlay
 * @param {PortfolioThumbnailProps} props
 * @param {string} props.href - Link to case detail page
 * @param {string} [props.image] - Case preview image URL
 * @param {string} props.title - Case title for alt text
 * @param {string} props.category - Category label for badge
 * @param {string} props.gradient - Tailwind gradient classes (fallback if no image)
 * @returns {JSX.Element} Linked thumbnail with image or pattern overlay with lazy loading skeleton
 * @example
 * <PortfolioThumbnail href="/portfolio/all/case" image="/images/thumb.jpg" title="Case Title" category="Branding" gradient="from-purple-500 to-pink-500" />
 */
export function PortfolioThumbnail({
  href,
  image,
  title,
  category,
  gradient,
}: PortfolioThumbnailProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <a
      href={href}
      className={cn(
        'group/thumb relative block h-40 cursor-pointer overflow-hidden bg-gradient-to-br sm:h-52',
        gradient
      )}
    >
      {image ? (
        <>
          {!imageLoaded && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted-foreground) / 0.05) 50%, hsl(var(--muted)) 100%)',
                backgroundSize: '1000px 100%',
                animation: 'shimmer 2s infinite',
              }}
              aria-hidden="true"
            />
          )}
          <OptimizedImage
            src={image}
            alt={title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              'absolute inset-0 h-full w-full transition-transform duration-500 group-hover/thumb:scale-105',
              !imageLoaded && 'animate-blur-up'
            )}
            imgClassName="object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        </>
      ) : (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      )}
      <div
        className={cn(
          'absolute inset-0 bg-black/0',
          'transition-colors duration-300 group-hover/thumb:bg-black/40'
        )}
      />
      <div className="absolute left-4 top-4">
        <Badge className="border-0 bg-black/50 text-white backdrop-blur-sm">{category}</Badge>
      </div>
    </a>
  );
}
