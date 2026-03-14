import { cn } from '@/libs/utils';
import type { ImageBlock as ImageBlockData } from '@/types/portfolio/blocks';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ImageBlockProps {
  block: ImageBlockData;
}

/**
 * @component
 * @description Responsive image figure with optional caption
 * @param {ImageBlockProps} props
 * @param {ImageBlockData} props.block - Image with src, alt, optional caption and size
 * @returns {JSX.Element} Figure element with OptimizedImage and caption
 * @example
 * <ImageBlock block={{ src: "/images/photo.jpg", alt: "Photo", caption: "Photo caption", size: "medium" }} />
 */
const SIZE_CLASS = {
  small: 'max-w-md',
  medium: 'max-w-2xl',
  full: 'max-w-5xl',
} as const;

const SIZE_HINTS = {
  small: '(max-width: 768px) 100vw, 448px',
  medium: '(max-width: 768px) 100vw, 672px',
  full: '100vw',
} as const;

export function ImageBlock({ block }: ImageBlockProps) {
  const size = block.size ?? 'medium';
  const sizeClass = SIZE_CLASS[size];

  return (
    <figure className={cn('mx-auto', sizeClass)}>
      <OptimizedImage
        src={block.src}
        alt={block.alt}
        sizes={SIZE_HINTS[size]}
        className="w-full rounded-xl object-cover shadow-md"
      />
      {block.caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
