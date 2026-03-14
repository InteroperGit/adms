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

/**
 * @component
 * @description Pagination controls for navigating between portfolio pages
 * @param {PaginationProps} props
 * @param {number} props.current - Current page number
 * @param {number} props.total - Total number of pages
 * @param {string} props.prevLabel - Label text for previous button
 * @param {string} props.nextLabel - Label text for next button
 * @param {string} props.pageLabel - Template string with {current} and {total} placeholders
 * @param {() => void} props.onPrev - Callback when previous button clicked
 * @param {() => void} props.onNext - Callback when next button clicked
 * @returns {JSX.Element} Centered prev/next buttons with page number display
 * @example <caption>Portfolio pagination</caption>
 * <Pagination current={2} total={5} prevLabel="Back" nextLabel="Next" pageLabel="Page {current} of {total}" onPrev={() => {}} onNext={() => {}} />
 */
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
