import { useEffect, useState } from 'react';

/**
 * @description Animates a count-up from 0 to a target number using eased interpolation.
 * Controlled by an animate flag that can be toggled to start/stop the animation.
 * Uses ease-out-cubic easing for smooth deceleration. Returns the current count value
 * for real-time display in components.
 *
 * @param {number} target - The final count value to animate to
 * @param {boolean} animate - Whether the animation is currently running (true = animate, false = pause)
 * @param {number} [duration=1500] - Animation duration in milliseconds (default 1500ms)
 * @param {number} [delay=0] - Delay before starting animation in milliseconds (default 0ms)
 * @returns {number} Current count value, updates on each animation frame
 *
 * @example
 * function MetricsCard() {
 *   const isVisible = useInView();
 *   const count = useCountUp(12500, isVisible, 2000);
 *
 *   return (
 *     <div>
 *       <p className="text-2xl font-bold">{count.toLocaleString()}</p>
 *       <p className="text-sm text-muted-foreground">Impressions</p>
 *     </div>
 *   );
 * }
 */
export function useCountUp(target: number, animate: boolean, duration = 1500, delay = 0): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate) {
      return;
    }

    const delayTimer = setTimeout(() => {
      const start = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        setCount(Math.round(eased * target));
        if (progress >= 1) {
          clearInterval(timer);
        }
      }, 16);
      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [animate, target, duration, delay]);

  return count;
}
