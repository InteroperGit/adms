import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageGalleryPreview } from './ImageGalleryPreview';
import { ImageGalleryThumbnails } from './ImageGalleryThumbnails';
import { ImageGalleryNav } from './ImageGalleryNav';

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
      <ImageGalleryPreview
        src={active.src}
        alt={`${altPrefix} ${activeIndex + 1}`}
        description={active.description}
      />
      {multi && (
        <div className="mt-4 flex items-center justify-between">
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
