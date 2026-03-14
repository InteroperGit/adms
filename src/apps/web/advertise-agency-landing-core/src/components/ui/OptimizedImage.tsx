import { resolveImageSrcSet } from '@/lib/imageSrcSet';

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
  className?: string;
}

/**
 * @component
 * @description Drop-in <img> replacement using WebP srcset variants from imageResizePlugin. In dev mode renders plain <img>; in production renders <picture> with WebP source
 * @param {OptimizedImageProps} props
 * @param {string} props.src - Original image path under /images/
 * @param {string} props.alt - Image alt text for accessibility
 * @param {string} [props.sizes='100vw'] - Responsive sizes string for srcset
 * @param {boolean} [props.priority=false] - true for eager loading and high fetch priority
 * @param {number} [props.width] - Explicit image width
 * @param {number} [props.height] - Explicit image height
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} picture element with WebP source or fallback img
 * @example
 * <OptimizedImage src="/images/hero.jpg" alt="Hero" sizes="100vw" priority />
 */
export function OptimizedImage({
  src,
  alt,
  sizes = '100vw',
  priority = false,
  width,
  height,
  className,
}: OptimizedImageProps) {
  const loadingProps = priority
    ? ({ loading: 'eager', fetchPriority: 'high' } as const)
    : ({ loading: 'lazy', decoding: 'async' } as const);

  // In dev mode the plugin hasn't generated _optimized files — render plain img
  if (import.meta.env.DEV) {
    return (
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        width={width}
        height={height}
        className={className}
        {...loadingProps}
      />
    );
  }

  const srcset = resolveImageSrcSet(src);

  return (
    <picture>
      {srcset && <source type="image/webp" srcSet={srcset} sizes={sizes} />}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        width={width}
        height={height}
        className={className}
        {...loadingProps}
      />
    </picture>
  );
}
