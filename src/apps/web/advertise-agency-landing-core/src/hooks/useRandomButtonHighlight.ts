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
 * Cycles a highlight through `count` indices in random order.
 * Only one index is active at a time.
 * Both the effect duration and the pause between cycles are randomised.
 *
 * @param count - number of items to cycle through
 * @returns the currently highlighted index, or null when between highlights
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
