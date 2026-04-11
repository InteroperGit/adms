import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/libs/utils';
import { useSwipe } from '@/hooks/useSwipe';
import type { ImageGalleryItem } from './index';
import { OptimizedImage } from '@/components/shared/images/OptimizedImage';
import { ImageGalleryThumbnails } from './ImageGalleryThumbnails';

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
  closeLabel: string;
}

const navBtn = cn(
  'absolute top-1/2 hidden -translate-y-1/2',
  'cursor-pointer rounded-full bg-white/20 p-3',
  'text-white transition-colors hover:bg-primary sm:flex'
);

/**
 * @component
 * @description Full-screen lightbox modal for enlarged image viewing with arrow/escape navigation, thumbnail strip and descriptions
 * @param {ImageGalleryLightboxProps} props
 * @param {ImageGalleryItem[]} props.images - Gallery images
 * @param {number} props.activeIndex - Current image index
 * @param {string} props.altPrefix - Alt text prefix
 * @param {() => void} props.onClose - Close handler
 * @param {() => void} props.onPrev - Previous image handler
 * @param {() => void} props.onNext - Next image handler
 * @param {(index: number) => void} props.onSelect - Image selection by index
 * @param {string} props.prevLabel - Previous aria label
 * @param {string} props.nextLabel - Next aria label
 * @param {string} props.closeLabel - Close aria label
 * @returns {JSX.Element} Fixed overlay lightbox with large image and controls
 * @example
 * <ImageGalleryLightbox images={images} activeIndex={0} altPrefix="Photo" onClose={handleClose} onPrev={prev} onNext={next} onSelect={selectIndex} prevLabel="Prev" nextLabel="Next" closeLabel="Close" />
 */
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
  closeLabel,
}: ImageGalleryLightboxProps) {
  const active = images[activeIndex];
  const multi = images.length > 1;
  const { onTouchStart, onTouchEnd } = useSwipe(onNext, onPrev);

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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-2 sm:p-4"
      onClick={onClose}
    >
      <button
        className={cn(
          'absolute right-3 top-3 cursor-pointer rounded-full p-2',
          'bg-white/20 text-white transition-colors hover:bg-primary'
        )}
        onClick={onClose}
        aria-label={closeLabel}
      >
        <X size={20} />
      </button>

      <div
        className="flex w-full max-w-5xl flex-col gap-2 sm:gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image with swipe support + desktop-only nav buttons */}
        <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <OptimizedImage
            src={active.src}
            alt={`${altPrefix} ${activeIndex + 1}`}
            sizes="100vw"
            className="max-h-[55vh] w-full rounded-xl sm:max-h-[75vh]"
            imgClassName="object-contain"
          />
          {multi && (
            <>
              <button onClick={onPrev} aria-label={prevLabel} className={cn(navBtn, 'left-3')}>
                <ChevronLeft size={22} />
              </button>
              <button onClick={onNext} aria-label={nextLabel} className={cn(navBtn, 'right-3')}>
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
          <ImageGalleryThumbnails
            images={images}
            activeIndex={activeIndex}
            onSelect={onSelect}
            altPrefix={altPrefix}
          />
        )}
      </div>
    </div>
  );
}
