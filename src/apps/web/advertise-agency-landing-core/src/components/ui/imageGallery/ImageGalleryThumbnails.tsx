import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ImageGalleryThumbnailsProps {
  images: { src: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
  altPrefix: string;
}

export function ImageGalleryThumbnails({
  images,
  activeIndex,
  onSelect,
  altPrefix,
}: ImageGalleryThumbnailsProps) {
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    thumbRefs.current[activeIndex]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [activeIndex]);

  return (
    <div className="flex gap-2 overflow-x-auto scroll-smooth py-1 [scroll-snap-type:x_mandatory]">
      {images.map((image, i) => (
        <button
          key={image.src}
          ref={(el) => {
            thumbRefs.current[i] = el;
          }}
          onClick={() => onSelect(i)}
          className={cn(
            'relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg transition-opacity sm:h-16 sm:w-24 [scroll-snap-align:center]',
            i === activeIndex ? 'ring-2 ring-primary opacity-100' : 'opacity-60 hover:opacity-100'
          )}
        >
          <OptimizedImage
            src={image.src}
            alt={`${altPrefix} ${i + 1}`}
            sizes="80px"
            className="h-full w-full object-cover"
          />
          {i === activeIndex && (
            <span className="pointer-events-none absolute inset-0 bg-primary/20" />
          )}
        </button>
      ))}
    </div>
  );
}
