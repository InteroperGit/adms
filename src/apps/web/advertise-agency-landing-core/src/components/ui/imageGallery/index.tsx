import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSwipe } from '@/hooks/useSwipe';
import { ImageGalleryNavButtons } from './ImageGalleryNavButtons';
import { ImageGalleryPreview } from './ImageGalleryPreview';
import { ImageGalleryThumbnails } from './ImageGalleryThumbnails';
import { ImageGalleryLightbox } from './ImageGalleryLightbox';

export interface ImageGalleryItem {
  src: string;
  description?: string;
}

export interface ImageGalleryProps {
  images: ImageGalleryItem[];
  altPrefix: string;
  prevLabel: string;
  nextLabel: string;
  closeLabel: string;
  counterTemplate: string;
  className?: string;
}

/**
 * @component
 * @description Full-featured image gallery with preview, thumbnails, lightbox, keyboard/touch navigation and counter
 * @param {ImageGalleryProps} props
 * @param {ImageGalleryItem[]} props.images - Array of image objects with src and optional description
 * @param {string} props.altPrefix - Alt text prefix for accessibility
 * @param {string} props.prevLabel - Aria label for previous button
 * @param {string} props.nextLabel - Aria label for next button
 * @param {string} props.closeLabel - Aria label for close button
 * @param {string} props.counterTemplate - Template for counter display with {current} and {total} placeholders
 * @param {string} [props.className] - Additional container classes
 * @returns {JSX.Element} Gallery wrapper with preview, nav buttons, thumbnails and lightbox
 * @example
 * <ImageGallery images={photos} altPrefix="Project" prevLabel="Previous" nextLabel="Next" closeLabel="Close" counterTemplate="{current}/{total}" />
 */
export function ImageGallery({
  images,
  altPrefix,
  prevLabel,
  nextLabel,
  closeLabel,
  counterTemplate,
  className,
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);
  const { onTouchStart, onTouchEnd, didSwipe } = useSwipe(next, prev);

  const active = images[activeIndex];
  const multi = images.length > 1;

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          prev();
        }
        if (e.key === 'ArrowRight') {
          next();
        }
      }}
      className={cn('outline-none', className)}
    >
      <div
        className="group relative"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={() => {
          if (!didSwipe.current) {
            setLightboxOpen(true);
          }
        }}
      >
        <ImageGalleryPreview
          src={active.src}
          alt={`${altPrefix} ${activeIndex + 1}`}
          description={active.description}
        />
        {multi && (
          <>
            <ImageGalleryNavButtons
              onPrev={prev}
              onNext={next}
              prevLabel={prevLabel}
              nextLabel={nextLabel}
            />
            <span
              className={cn(
                'absolute bottom-3 right-3 z-10 hidden rounded-full bg-black/50',
                'px-3 py-1 text-xs text-white tabular-nums',
                'opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 sm:block'
              )}
            >
              {counterTemplate
                .replace('{current}', String(activeIndex + 1))
                .replace('{total}', String(images.length))}
            </span>
          </>
        )}
      </div>
      {lightboxOpen && (
        <ImageGalleryLightbox
          images={images}
          activeIndex={activeIndex}
          altPrefix={altPrefix}
          onClose={() => setLightboxOpen(false)}
          onPrev={prev}
          onNext={next}
          onSelect={setActiveIndex}
          prevLabel={prevLabel}
          nextLabel={nextLabel}
          closeLabel={closeLabel}
        />
      )}
      {multi && (
        <div className="mt-3">
          <ImageGalleryThumbnails
            images={images}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            altPrefix={altPrefix}
          />
        </div>
      )}
    </div>
  );
}
