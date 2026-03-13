import { useRef } from 'react';
import type React from 'react';

const DEFAULT_THRESHOLD = 50;

/**
 * Returns onTouchStart/onTouchEnd handlers that detect horizontal swipes.
 * Swipe left (finger moves left, delta > 0) → onLeft()
 * Swipe right (finger moves right, delta < 0) → onRight()
 * didSwipe ref is set to true when a swipe was detected (use to suppress click handlers).
 */
export function useSwipe(onLeft: () => void, onRight: () => void, threshold = DEFAULT_THRESHOLD) {
  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    didSwipe.current = false;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) {
      return;
    }
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) >= threshold) {
      didSwipe.current = true;
      if (delta > 0) {
        onLeft();
      } else {
        onRight();
      }
    }
    touchStartX.current = null;
  };

  return { onTouchStart, onTouchEnd, didSwipe };
}
