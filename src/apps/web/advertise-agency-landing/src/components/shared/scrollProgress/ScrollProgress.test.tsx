import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ScrollProgress } from './ScrollProgress';

// jsdom does not implement matchMedia — provide a stub
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

function setPageDimensions({
  scrollHeight,
  innerHeight,
  scrollY = 0,
}: {
  scrollHeight: number;
  innerHeight: number;
  scrollY?: number;
}) {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: innerHeight,
  });
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: scrollY,
  });
}

describe('ScrollProgress', () => {
  beforeEach(() => {
    setPageDimensions({ scrollHeight: 800, innerHeight: 600 });
  });

  afterEach(() => {
    setPageDimensions({ scrollHeight: 800, innerHeight: 600 });
  });

  it('is hidden when page is short (< 2x viewport)', () => {
    render(<ScrollProgress />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('renders progress bar when page is long (> 2x viewport)', () => {
    setPageDimensions({ scrollHeight: 3000, innerHeight: 600 });
    render(<ScrollProgress />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('updates width on scroll', () => {
    setPageDimensions({ scrollHeight: 3000, innerHeight: 600, scrollY: 0 });
    render(<ScrollProgress />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveStyle({ width: '0%' });

    act(() => {
      setPageDimensions({ scrollHeight: 3000, innerHeight: 600, scrollY: 600 });
      window.dispatchEvent(new Event('scroll'));
    });

    // scrollable = 3000 - 600 = 2400; 600/2400 * 100 = 25%
    expect(bar).toHaveStyle({ width: '25%' });
  });

  it('has correct aria attributes', () => {
    setPageDimensions({ scrollHeight: 3000, innerHeight: 600 });
    render(<ScrollProgress />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-label', 'Page scroll progress');
  });
});
