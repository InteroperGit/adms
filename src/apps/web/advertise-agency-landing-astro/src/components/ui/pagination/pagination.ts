// Share the visible page-number window between static and browser rendering.

export type PaginationItem = number | "ellipsis";

const PAGINATION_SIBLINGS = 1;
const PAGINATION_BOUNDARIES = 1;

export function getPaginationItems(
  total: number,
  current: number,
): PaginationItem[] {
  if (total <= 1) {
    return [];
  }

  const totalPageNumbers =
    PAGINATION_BOUNDARIES * 2 + PAGINATION_SIBLINGS * 2 + 3;
  if (total <= totalPageNumbers) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const leftDots = current > PAGINATION_SIBLINGS + PAGINATION_BOUNDARIES + 2;
  const rightDots =
    current < total - PAGINATION_SIBLINGS - PAGINATION_BOUNDARIES - 1;
  if (!leftDots && rightDots) {
    return [
      ...Array.from({ length: totalPageNumbers - 2 }, (_, index) => index + 1),
      "ellipsis",
      total,
    ];
  }

  if (leftDots && !rightDots) {
    return [
      1,
      "ellipsis",
      ...Array.from(
        { length: totalPageNumbers - 2 },
        (_, index) => total - totalPageNumbers + 3 + index,
      ),
    ];
  }

  return [
    1,
    "ellipsis",
    ...Array.from(
      { length: PAGINATION_SIBLINGS * 2 + 1 },
      (_, index) => current - PAGINATION_SIBLINGS + index,
    ),
    "ellipsis",
    total,
  ];
}
