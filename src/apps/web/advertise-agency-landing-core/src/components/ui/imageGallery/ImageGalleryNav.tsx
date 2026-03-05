import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryNavProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
  counterTemplate: string;
}

export function ImageGalleryNav({
  current,
  total,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  counterTemplate,
}: ImageGalleryNavProps) {
  const counter = counterTemplate
    .replace('{current}', String(current))
    .replace('{total}', String(total));

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPrev}
        aria-label={prevLabel}
        className="rounded-full bg-muted p-2 hover:bg-muted/80 transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="text-sm text-muted-foreground tabular-nums">{counter}</span>
      <button
        onClick={onNext}
        aria-label={nextLabel}
        className="rounded-full bg-muted p-2 hover:bg-muted/80 transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
