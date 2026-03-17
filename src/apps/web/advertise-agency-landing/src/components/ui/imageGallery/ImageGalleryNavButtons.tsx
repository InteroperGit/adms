import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/libs/utils';

interface ImageGalleryNavButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
}

const btnClass = cn(
  'absolute top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer',
  'items-center justify-center rounded-full bg-black/40 p-2.5 text-white',
  'opacity-0 backdrop-blur-sm transition-all hover:bg-primary group-hover:opacity-100 sm:flex'
);

/**
 * @component
 * @description Previous/next navigation buttons for gallery preview, visible on hover (desktop only)
 * @param {ImageGalleryNavButtonsProps} props
 * @param {() => void} props.onPrev - Previous image callback
 * @param {() => void} props.onNext - Next image callback
 * @param {string} props.prevLabel - Aria label for previous button
 * @param {string} props.nextLabel - Aria label for next button
 * @returns {JSX.Element} Two navigation buttons positioned absolutely on sides
 * @example
 * <ImageGalleryNavButtons onPrev={handlePrev} onNext={handleNext} prevLabel="Previous" nextLabel="Next" />
 */
export function ImageGalleryNavButtons({
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: ImageGalleryNavButtonsProps) {
  return (
    <>
      <button
        type="button"
        tabIndex={-1}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onPrev();
        }}
        aria-label={prevLabel}
        className={cn(btnClass, 'left-3')}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        tabIndex={-1}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onNext();
        }}
        aria-label={nextLabel}
        className={cn(btnClass, 'right-3')}
      >
        <ChevronRight size={20} />
      </button>
    </>
  );
}
