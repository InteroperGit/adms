import { useRef } from 'react';
import type React from 'react';

const DEFAULT_THRESHOLD = 50;

/**
 * @description Detects horizontal swipe gestures on touch devices and triggers callbacks.
 * Left swipes (finger moves left) call onLeft(); right swipes call onRight().
 * Sets a didSwipe ref flag to true when movement exceeds the threshold, useful for
 * suppressing unwanted click handlers triggered after a swipe. Supports custom threshold
 * configuration for sensitivity adjustment.
 *
 * @param {() => void} onLeft - Callback invoked when user swipes left
 * @param {() => void} onRight - Callback invoked when user swipes right
 * @param {number} [threshold=50] - Minimum pixel distance to recognize as a valid swipe
 * @returns {object} Object with onTouchStart handler, onTouchEnd handler, and didSwipe ref
 *   - onTouchStart: React.TouchEvent handler to record initial position
 *   - onTouchEnd: React.TouchEvent handler to detect swipe direction and magnitude
 *   - didSwipe: useRef to check if a swipe occurred (set to true during valid swipe)
 *
 * @example
 * function ImageCarousel() {
 *   const { onTouchStart, onTouchEnd, didSwipe } = useSwipe(
 *     () => goToPrevImage(),
 *     () => goToNextImage(),
 *     60
 *   );
 *   return (
 *     <div
 *       onTouchStart={onTouchStart}
 *       onTouchEnd={onTouchEnd}
 *       onClick={() => !didSwipe.current && openImageDetail()}
 *     >
 *       <img src={currentImage} />
 *     </div>
 *   );
 * }
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
