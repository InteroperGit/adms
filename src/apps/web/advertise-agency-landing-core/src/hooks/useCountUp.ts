import { useEffect, useState } from 'react';

export function useCountUp(target: number, animate: boolean, duration = 1500): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate) {
      return;
    }
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
  }, [animate, target, duration]);

  return count;
}
