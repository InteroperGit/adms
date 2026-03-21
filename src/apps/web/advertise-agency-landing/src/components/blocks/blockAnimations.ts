import type { CSSProperties } from 'react';

/**
 * Shared animation style constants for block-level stagger entrance animations.
 * Both `CardsBlock` and `MetricsBlock` use these to animate their grid children
 * on scroll entry. `animationDelay` is set per-item via inline style spread.
 *
 * @example
 * style={hasAnimated
 *   ? { ...STAGGER_ANIMATION_BASE, animationDelay: `${index * 80}ms` }
 *   : HIDDEN_STYLE}
 */
export const HIDDEN_STYLE: CSSProperties = { opacity: 0 };

export const STAGGER_ANIMATION_BASE = {
  animationName: 'stagger-fade-in',
  animationDuration: '0.5s',
  animationTimingFunction: 'ease-out',
  animationFillMode: 'both',
} satisfies CSSProperties;
