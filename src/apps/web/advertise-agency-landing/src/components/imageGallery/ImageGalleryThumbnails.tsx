import { useEffect, useRef } from 'react';
import { cn } from '@/libs/utils';
import { OptimizedImage } from '@/components/shared/images/OptimizedImage';

interface ImageGalleryThumbnailsProps {
  images: { src: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
  altPrefix: string;
}

/**
 * @component
 * @description Horizontal scrollable thumbnail strip with snap alignment and auto-scroll to active image
 * @param {ImageGalleryThumbnailsProps} props
 * @param {Array<{ src: string }>} props.images - Images with src property
 * @param {number} props.activeIndex - Currently selected thumbnail index
 * @param {(index: number) => void} props.onSelect - Selection callback
 * @param {string} props.altPrefix - Alt text prefix
 * @returns {JSX.Element} Scrollable thumbnail container with ring indicator on active
 * @example
 * <ImageGalleryThumbnails images={photos} activeIndex={0} onSelect={selectIndex} altPrefix="Thumbnail" />
 */
export function ImageGalleryThumbnails({
  images,
  activeIndex,
  onSelect,
  altPrefix,
}: ImageGalleryThumbnailsProps) {
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mounted = useRef(false);

  useEffect(() => {
    // Trim stale refs when images array shrinks
    thumbRefs.current = thumbRefs.current.slice(0, images.length);
  }, [images.length]);

  useEffect(() => {
    // Skip scrollIntoView on initial mount — index 0 is already visible
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
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
          type="button"
          ref={(el) => {
            thumbRefs.current[i] = el;
          }}
          tabIndex={-1}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(i);
          }}
          className={cn(
            'relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg',
            'transition-opacity sm:h-16 sm:w-24 [scroll-snap-align:center]',
            i === activeIndex ? 'ring-2 ring-primary opacity-100' : 'opacity-60 hover:opacity-100'
          )}
        >
          <OptimizedImage
            src={image.src}
            alt={`${altPrefix} ${i + 1}`}
            sizes="80px"
            className="h-full w-full"
            imgClassName="object-cover"
          />
          {i === activeIndex && (
            <span className="pointer-events-none absolute inset-0 bg-primary/20" />
          )}
        </button>
      ))}
    </div>
  );
}
