import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImageGalleryItem } from './index';

interface ImageGalleryLightboxProps {
  images: ImageGalleryItem[];
  activeIndex: number;
  altPrefix: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  prevLabel: string;
  nextLabel: string;
}

export function ImageGalleryLightbox({
  images,
  activeIndex,
  altPrefix,
  onClose,
  onPrev,
  onNext,
  onSelect,
  prevLabel,
  nextLabel,
}: ImageGalleryLightboxProps) {
  const active = images[activeIndex];
  const multi = images.length > 1;
  const touchStartX = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4"
      onClick={onClose}
    >
      <button
        className="absolute right-3 top-3 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25"
        onClick={onClose}
        aria-label="Закрыть"
      >
        <X size={20} />
      </button>

      <div
        className="flex w-full max-w-5xl flex-col gap-2 sm:gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image with swipe support + desktop-only nav buttons */}
        <div
          className="relative"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const delta = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(delta) > 50) {
              if (delta > 0) onNext();
              else onPrev();
            }
          }}
        >
          <img
            src={active.src}
            alt={`${altPrefix} ${activeIndex + 1}`}
            className="max-h-[55vh] w-full rounded-xl object-contain sm:max-h-[75vh]"
          />
          {multi && (
            <>
              <button
                onClick={onPrev}
                aria-label={prevLabel}
                className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-3 text-white transition-colors hover:bg-black/60 sm:flex"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={onNext}
                aria-label={nextLabel}
                className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/40 p-3 text-white transition-colors hover:bg-black/60 sm:flex"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        {/* Description */}
        {active.description && (
          <p className="border-l-2 border-primary pl-3 text-sm text-white/70">
            {active.description}
          </p>
        )}

        {/* Thumbnail strip */}
        {multi && (
          <div className="flex gap-1.5 overflow-x-auto py-1 sm:gap-2">
            {images.map((img, i) => (
              <button
                key={img.src}
                onClick={() => onSelect(i)}
                className={cn(
                  'h-10 w-14 shrink-0 overflow-hidden rounded-md transition-opacity sm:h-14 sm:w-20 sm:rounded-lg',
                  i === activeIndex
                    ? 'opacity-100 ring-2 ring-primary'
                    : 'opacity-50 hover:opacity-80'
                )}
              >
                <img
                  src={img.src}
                  alt={`${altPrefix} ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
