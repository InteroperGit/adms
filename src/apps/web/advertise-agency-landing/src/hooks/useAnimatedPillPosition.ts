import { useLayoutEffect, useRef, useState } from 'react';

interface PillPosition {
  left: number;
  width: number;
  height: number;
}

interface UseAnimatedPillPositionReturn {
  position: PillPosition;
  isAnimating: boolean;
}

/**
 * @hook
 * @description Calculates and tracks the animated pill position behind a set of items based on the active index
 * @param {Object} containerRef - Ref object to the container element
 * @param {Object} itemRefs - Ref object containing array of item elements (buttons/links)
 * @param {number} activeIndex - The index of the currently active item
 * @returns {UseAnimatedPillPositionReturn} Object with position (left, width, height) and isAnimating flag
 * @example
 * const containerRef = useRef<HTMLDivElement>(null);
 * const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
 * const activeIndex = items.indexOf(activeItem);
 * const { position, isAnimating } = useAnimatedPillPosition(containerRef, itemRefs, activeIndex);
 */
export function useAnimatedPillPosition(
  containerRef: { current: HTMLDivElement | null },
  itemRefs: { current: (HTMLElement | null)[] },
  activeIndex: number
): UseAnimatedPillPositionReturn {
  const isFirstRender = useRef(true);
  const [pillPosition, setPillPosition] = useState<PillPosition>({ left: 0, width: 0, height: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  useLayoutEffect(() => {
    const activeItem = itemRefs.current[activeIndex];

    if (activeItem && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      const newPosition = {
        left: itemRect.left - containerRect.left,
        width: itemRect.width,
        height: itemRect.height,
      };

      const isFirstRendering = isFirstRender.current;

      setIsAnimating(!isFirstRendering);
      isFirstRender.current = false;
      setPillPosition(newPosition);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return { position: pillPosition, isAnimating };
}
