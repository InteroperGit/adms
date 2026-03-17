import { useState, useEffect, useRef } from 'react';

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickDifferent(current: number | null, count: number): number {
  if (count === 1) {
    return 0;
  }
  let next: number;
  do {
    next = Math.floor(Math.random() * count);
  } while (next === current);
  return next;
}

/**
 * @description Cycles a highlight through a sequence of indices in random order, with randomized
 * timing for effect duration and pauses between cycles. Only one index is highlighted at a time,
 * returning null between highlights. Useful for attention-drawing animations on button arrays or
 * feature lists.
 *
 * @param {number} count - Number of items (indices 0 to count-1) to cycle through
 * @returns {number | null} Currently highlighted index (0 to count-1), or null when between cycles
 *
 * @example
 * function FeatureButtons() {
 *   const highlight = useRandomButtonHighlight(4);
 *   return (
 *     <div>
 *       {[0, 1, 2, 3].map(i => (
 *         <button
 *           key={i}
 *           className={highlight === i ? 'ring-2 ring-primary' : ''}
 *         >
 *           Feature {i}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 */
export function useRandomButtonHighlight(count: number): number | null {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function cycle() {
      const next = pickDifferent(activeRef.current, count);
      activeRef.current = next;
      setActiveIndex(next);

      // Hold the effect for 2–5 seconds (random)
      timeoutId = setTimeout(
        () => {
          setActiveIndex(null);
          activeRef.current = null;

          // Pause 1–4 seconds before the next highlight (random)
          timeoutId = setTimeout(cycle, rand(1000, 4000));
        },
        rand(2000, 5000)
      );
    }

    // Small initial delay so the page settles before the first highlight
    timeoutId = setTimeout(cycle, rand(800, 2500));

    return () => clearTimeout(timeoutId);
  }, [count]);

  return activeIndex;
}
