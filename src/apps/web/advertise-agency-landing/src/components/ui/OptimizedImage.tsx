import { useState } from 'react';
import { resolveImageSrcSet } from '@/libs/imageSrcSet';
import { Skeleton } from './skeleton';
import { cn } from '@/libs/utils';

export interface OptimizedImageProps {
  /** Original image path under /images/, e.g. /images/portfolio/hero.jpg */
  src: string;
  alt: string;
  /** Responsive sizes string passed to <source> and <img>. Default: '100vw' */
  sizes?: string;
  /** true → loading="eager" fetchPriority="high"; false → loading="lazy" decoding="async" */
  priority?: boolean;
  width?: number;
  height?: number;
  /** CSS classes applied to the wrapper container (sizing, rounding, etc.) */
  className?: string;
  /** CSS classes applied to the <img> element specifically */
  imgClassName?: string;
  /** CSS aspect ratio for the container when dimensions aren't specified (e.g. '16/9') */
  aspectRatio?: string;
  /** CSS object-fit value for the image. Default: 'cover' */
  objectFit?: 'cover' | 'contain' | 'fill';
  /** Optional callback fired when image loads successfully */
  onLoad?: () => void;
}

/**
 * @component
 * @description Drop-in <img> replacement using WebP srcset variants from imageResizePlugin.
 * Renders a loading Skeleton placeholder behind lazy-loaded images for improved UX.
 * In dev mode renders plain <img>; in production renders <picture> with WebP source.
 * Priority images skip the skeleton and load eagerly.
 * @param {OptimizedImageProps} props
 * @param {string} props.src - Original image path under /images/
 * @param {string} props.alt - Image alt text for accessibility
 * @param {string} [props.sizes='100vw'] - Responsive sizes string for srcset
 * @param {boolean} [props.priority=false] - true for eager loading and high fetch priority; skips skeleton
 * @param {number} [props.width] - Explicit image width
 * @param {number} [props.height] - Explicit image height
 * @param {string} [props.className] - CSS classes applied to the wrapper container
 * @param {string} [props.imgClassName] - CSS classes applied to the <img> element
 * @param {string} [props.aspectRatio] - CSS aspect ratio for the container (e.g. '16/9')
 * @param {string} [props.objectFit='cover'] - CSS object-fit value
 * @returns {JSX.Element} Wrapper with optional Skeleton and picture/img element
 * @example
 * <OptimizedImage src="/images/hero.jpg" alt="Hero" sizes="100vw" priority className="rounded-lg" />
 */
export function OptimizedImage({
  src,
  alt,
  sizes = '100vw',
  priority = false,
  width,
  height,
  className,
  imgClassName,
  aspectRatio,
  objectFit = 'cover',
  onLoad,
}: OptimizedImageProps) {
  // Start as loaded for priority images (no skeleton needed), not loaded for lazy images
  const [loaded, setLoaded] = useState(priority);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const loadingProps = priority
    ? ({ loading: 'eager', fetchPriority: 'high' } as const)
    : ({ loading: 'lazy', decoding: 'async' } as const);

  const containerStyle = cn('relative overflow-hidden', className);

  const imgClasses = cn(
    'w-full h-full transition-opacity duration-300',
    `object-${objectFit}`,
    loaded ? 'opacity-100' : 'opacity-0',
    imgClassName
  );

  const wrapperInlineStyle: React.CSSProperties = {
    ...(aspectRatio && { aspectRatio }),
    ...(width && { width }),
    ...(height && { height }),
  };

  // In dev mode the plugin hasn't generated _optimized files — render plain img
  if (import.meta.env.DEV) {
    return (
      <div className={containerStyle} style={wrapperInlineStyle}>
        {!loaded && <Skeleton className="absolute inset-0 w-full h-full" />}
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          width={width}
          height={height}
          className={imgClasses}
          onLoad={handleLoad}
          onError={() => setLoaded(true)}
          {...loadingProps}
        />
      </div>
    );
  }

  const srcset = resolveImageSrcSet(src);

  return (
    <div className={containerStyle} style={wrapperInlineStyle}>
      {!loaded && <Skeleton className="absolute inset-0 w-full h-full" />}
      <picture>
        {srcset && <source type="image/webp" srcSet={srcset} sizes={sizes} />}
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          width={width}
          height={height}
          className={imgClasses}
          onLoad={handleLoad}
          onError={() => setLoaded(true)}
          {...loadingProps}
        />
      </picture>
    </div>
  );
}
