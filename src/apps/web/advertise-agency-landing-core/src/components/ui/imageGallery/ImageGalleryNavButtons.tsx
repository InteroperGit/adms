import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function ImageGalleryNavButtons({
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: ImageGalleryNavButtonsProps) {
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label={prevLabel}
        className={cn(btnClass, 'left-3')}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={(e) => {
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
