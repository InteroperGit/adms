// src/components/portfolio/Pagination.tsx
import { Button } from '@/components/ui/button';

interface PaginationProps {
  current: number;
  total: number;
  prevLabel: string;
  nextLabel: string;
  pageLabel: string;
  onPrev: () => void;
  onNext: () => void;
}

export function Pagination({
  current,
  total,
  prevLabel,
  nextLabel,
  pageLabel,
  onPrev,
  onNext,
}: PaginationProps) {
  const label = pageLabel.replace('{current}', String(current)).replace('{total}', String(total));

  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      <Button
        variant="default"
        size="sm"
        onClick={onPrev}
        disabled={current <= 1}
        className="rounded-full px-5"
      >
        {prevLabel}
      </Button>
      <span className="text-sm text-muted-foreground">{label}</span>
      <Button
        variant="default"
        size="sm"
        onClick={onNext}
        disabled={current >= total}
        className="rounded-full px-5"
      >
        {nextLabel}
      </Button>
    </div>
  );
}
