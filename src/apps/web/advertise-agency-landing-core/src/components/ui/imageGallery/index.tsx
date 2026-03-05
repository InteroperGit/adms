import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  counterTemplate: string;
  className?: string;
}

export function ImageGallery({
  images,
  altPrefix,
  prevLabel,
  nextLabel,
  counterTemplate,
  className,
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef(0);
  const didSwipe = useRef(false);

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  const active = images[activeIndex];
  const multi = images.length > 1;

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
      }}
      className={cn('outline-none', className)}
    >
      <div
        className="group relative"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
          didSwipe.current = false;
        }}
        onTouchEnd={(e) => {
          const delta = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(delta) > 50) {
            didSwipe.current = true;
            if (delta > 0) next();
            else prev();
          }
        }}
        onClick={() => {
          if (!didSwipe.current) setLightboxOpen(true);
        }}
      >
        <ImageGalleryPreview
          src={active.src}
          alt={`${altPrefix} ${activeIndex + 1}`}
          description={active.description}
        />
        {multi && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label={prevLabel}
              className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 p-2.5 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-primary group-hover:opacity-100 sm:flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label={nextLabel}
              className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 p-2.5 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-primary group-hover:opacity-100 sm:flex"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 right-3 z-10 hidden rounded-full bg-black/50 px-3 py-1 text-xs text-white tabular-nums opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 sm:block">
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
