// src/components/articles/Pagination.tsx
import { Button } from '@/components/ui/button';
import { interpolate } from '@/libs/utils';

interface PaginationProps {
  /** Current page number (1-based). */
  current: number;
  /** Total number of pages. */
  total: number;
  /** Label for the previous-page button (e.g. `"← Назад"`). */
  prevLabel: string;
  /** Label for the next-page button (e.g. `"Вперёд →"`). */
  nextLabel: string;
  /**
   * Template string for the page indicator rendered between the buttons.
   * Placeholders `{current}` and `{total}` are replaced at runtime via `interpolate`.
   * Example: `"{current} из {total}"` → `"2 из 5"`.
   */
  pageLabel: string;
  /** Called when the user clicks the previous button. Not called when already on page 1. */
  onPrev: () => void;
  /** Called when the user clicks the next button. Not called when already on the last page. */
  onNext: () => void;
}

/**
 * Prev / current / next pagination controls for the portfolio case grid.
 *
 * Renders two pill-shaped buttons flanking a page indicator label:
 * `[← Prev]  2 из 5  [Next →]`
 *
 * Boundary behaviour:
 * - Prev button is `disabled` when `current <= 1`.
 * - Next button is `disabled` when `current >= total`.
 *
 * The centre label is produced by calling `interpolate(pageLabel, { current, total })`
 * from `@/libs/utils`, keeping the format string in `portfolioConfig` for localisation.
 *
 * `PortfolioGrid` only renders this component when `totalPages > 1`, so it never
 * appears for a single-page listing.
 *
 * @param props - See {@link PaginationProps}.
 * @returns A centred flex row with prev button, label span, and next button.
 *
 * @example
 * <Pagination
 *   current={2}
 *   total={5}
 *   prevLabel="← Назад"
 *   nextLabel="Вперёд →"
 *   pageLabel="{current} из {total}"
 *   onPrev={() => setPage(1)}
 *   onNext={() => setPage(3)}
 * />
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
  const label = interpolate(pageLabel, { current, total });

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
