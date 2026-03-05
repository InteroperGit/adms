import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageGalleryPreview } from './ImageGalleryPreview';
import { ImageGalleryThumbnails } from './ImageGalleryThumbnails';
import { ImageGalleryNav } from './ImageGalleryNav';
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
        className="relative"
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
        <div className="mt-4 hidden items-center justify-between sm:flex">
          <ImageGalleryNav
            current={activeIndex + 1}
            total={images.length}
            onPrev={prev}
            onNext={next}
            prevLabel={prevLabel}
            nextLabel={nextLabel}
            counterTemplate={counterTemplate}
          />
        </div>
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
